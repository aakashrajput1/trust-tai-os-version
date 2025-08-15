import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { BulkOperationResult, CreateUserRequest } from '@/types/admin'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has admin role (only Admin can bulk import users)
    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!userProfile || userProfile.role !== 'Admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      return NextResponse.json({ error: 'Only CSV files are supported' }, { status: 400 })
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 })
    }

    // Process CSV file
    const csvText = await file.text()
    const result = await processBulkImport(supabase, csvText, session.user.id)

    return NextResponse.json({
      success: true,
      data: result,
      message: `Bulk import completed. ${result.successful} users created, ${result.failed} failed.`
    })

  } catch (error) {
    console.error('Bulk import error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function processBulkImport(
  supabase: any, 
  csvText: string, 
  adminUserId: string
): Promise<BulkOperationResult> {
  try {
    const lines = csvText.split('\n').filter(line => line.trim())
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    
    // Validate required headers
    const requiredHeaders = ['name', 'email', 'role']
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h))
    
    if (missingHeaders.length > 0) {
      return {
        total: 0,
        successful: 0,
        failed: 1,
        errors: [{
          row: 1,
          field: 'headers',
          message: `Missing required headers: ${missingHeaders.join(', ')}`
        }]
      }
    }

    const result: BulkOperationResult = {
      total: lines.length - 1, // Exclude header row
      successful: 0,
      failed: 0,
      errors: []
    }

    // Process each row
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      try {
        const values = parseCSVLine(line)
        const userData = parseUserData(headers, values, i + 1)
        
        if (userData) {
          // Check if user already exists
          const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', userData.email)
            .single()

          if (existingUser) {
            result.failed++
            result.errors.push({
              row: i + 1,
              field: 'email',
              message: `User with email ${userData.email} already exists`
            })
            continue
          }

          // Create user
          await createUserFromBulkImport(supabase, userData)
          result.successful++

          // Log the action
          await logAuditEvent(supabase, {
            userId: adminUserId,
            action: 'user_bulk_imported',
            resource: 'users',
            details: { 
              userEmail: userData.email,
              role: userData.role,
              row: i + 1
            }
          })

        } else {
          result.failed++
          result.errors.push({
            row: i + 1,
            field: 'data',
            message: 'Invalid user data format'
          })
        }

      } catch (error) {
        result.failed++
        result.errors.push({
          row: i + 1,
          field: 'processing',
          message: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return result

  } catch (error) {
    console.error('Error processing bulk import:', error)
    throw error
  }
}

function parseCSVLine(line: string): string[] {
  const values: string[] = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  
  values.push(current.trim())
  return values
}

function parseUserData(headers: string[], values: string[], rowNumber: number): CreateUserRequest | null {
  try {
    const userData: any = {}
    
    headers.forEach((header, index) => {
      if (values[index] !== undefined) {
        userData[header] = values[index].trim()
      }
    })

    // Validate required fields
    if (!userData.name || !userData.email || !userData.role) {
      throw new Error('Missing required fields: name, email, or role')
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(userData.email)) {
      throw new Error('Invalid email format')
    }

    // Validate role
    const validRoles = [
      'Admin', 'Executive', 'Project Manager', 'Developer', 
      'Support Lead', 'Support Agent', 'HR', 'Sales'
    ]
    if (!validRoles.includes(userData.role)) {
      throw new Error(`Invalid role. Must be one of: ${validRoles.join(', ')}`)
    }

    // Set default values
    userData.status = 'active'
    userData.sendInvitation = true

    return userData as CreateUserRequest

  } catch (error) {
    throw new Error(`Row ${rowNumber}: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

async function createUserFromBulkImport(supabase: any, userData: CreateUserRequest): Promise<void> {
  try {
    // Generate temporary password
    const tempPassword = generateTemporaryPassword()

    // Create user in Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        name: userData.name,
        role: userData.role,
        created_by: 'admin'
      }
    })

    if (authError) throw authError

    // Create user profile in users table with conflict handling
    const { error: profileError } = await supabase
      .from('users')
      .upsert({
        id: authUser.user.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        status: 'active',
        department: userData.department || null,
        position: userData.position || null,
        manager_id: userData.managerId || null,
        mfa_enabled: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, { 
        onConflict: 'id',
        ignoreDuplicates: false 
      })

    if (profileError) throw profileError

    // Send invitation email
    if (userData.sendInvitation) {
      await sendInvitationEmail(userData.email, userData.name, tempPassword)
    }

  } catch (error) {
    console.error('Error creating user from bulk import:', error)
    throw error
  }
}

function generateTemporaryPassword(): string {
  const length = 12
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let password = ''
  
  // Ensure at least one character from each category
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)] // Uppercase
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)] // Lowercase
  password += '0123456789'[Math.floor(Math.random() * 10)] // Number
  password += '!@#$%^&*'[Math.floor(Math.random() * 4)] // Special character
  
  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)]
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('')
}

async function sendInvitationEmail(email: string, name: string, password: string) {
  // In real app, implement email service
  console.log(`Invitation email sent to ${email} with password: ${password}`)
}

async function logAuditEvent(supabase: any, eventData: {
  userId: string
  action: string
  resource: string
  details: Record<string, any>
}) {
  try {
    await supabase
      .from('audit_logs')
      .insert({
        user_id: eventData.userId,
        action: eventData.action,
        resource: eventData.resource,
        details: eventData.details,
        ip_address: '127.0.0.1', // In real app, get from request
        user_agent: 'Admin API',
        severity: 'low',
        category: 'user_management',
        created_at: new Date().toISOString()
      })
  } catch (error) {
    console.error('Error logging audit event:', error)
  }
}
