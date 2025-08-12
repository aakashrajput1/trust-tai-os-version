import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    // Verify admin role (you can implement proper auth middleware later)
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!file.name.endsWith('.csv')) {
      return NextResponse.json({ error: 'File must be a CSV' }, { status: 400 })
    }

    // Read CSV content
    const csvText = await file.text()
    const lines = csvText.split('\n').filter(line => line.trim())
    
    if (lines.length < 2) {
      return NextResponse.json({ error: 'CSV must have header and at least one data row' }, { status: 400 })
    }

    // Parse CSV header
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    const requiredHeaders = ['name', 'email', 'role', 'status']
    
    for (const header of requiredHeaders) {
      if (!headers.includes(header)) {
        return NextResponse.json({ error: `Missing required header: ${header}` }, { status: 400 })
      }
    }

    // Parse data rows
    const users = []
    const errors = []
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue
      
      const values = line.split(',').map(v => v.trim())
      if (values.length !== headers.length) {
        errors.push(`Row ${i + 1}: Invalid number of columns`)
        continue
      }
      
      const user = {
        name: values[headers.indexOf('name')],
        email: values[headers.indexOf('email')],
        role: values[headers.indexOf('role')],
        status: values[headers.indexOf('status')]
      }
      
      // Validate user data
      if (!user.name || !user.email || !user.role || !user.status) {
        errors.push(`Row ${i + 1}: Missing required fields`)
        continue
      }
      
      if (!user.email.includes('@')) {
        errors.push(`Row ${i + 1}: Invalid email format`)
        continue
      }
      
      if (!['active', 'inactive', 'pending'].includes(user.status)) {
        errors.push(`Row ${i + 1}: Invalid status (must be active, inactive, or pending)`)
        continue
      }
      
      users.push(user)
    }

    if (errors.length > 0) {
      return NextResponse.json({ 
        error: 'Validation errors found', 
        details: errors 
      }, { status: 400 })
    }

    if (users.length === 0) {
      return NextResponse.json({ error: 'No valid users found in CSV' }, { status: 400 })
    }

    // Check if users already exist
    const emails = users.map(u => u.email)
    const { data: existingUsers, error: checkError } = await supabase
      .from('users')
      .select('email')
      .in('email', emails)

    if (checkError) throw checkError

    const existingEmails = existingUsers?.map(u => u.email) || []
    const newUsers = users.filter(u => !existingEmails.includes(u.email))

    if (newUsers.length === 0) {
      return NextResponse.json({ 
        message: 'All users already exist', 
        imported: 0,
        skipped: users.length 
      })
    }

    // Insert new users in batches to handle large imports
    const batchSize = 100
    let imported = 0
    
    for (let i = 0; i < newUsers.length; i += batchSize) {
      const batch = newUsers.slice(i, i + batchSize)
      
      const { error: insertError } = await supabase
        .from('users')
        .insert(batch.map(user => ({
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          password_hash: 'temp_password_hash', // Will be reset by user
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })))

      if (insertError) {
        console.error('Batch insert error:', insertError)
        errors.push(`Failed to insert batch starting at row ${i + 1}`)
        continue
      }
      
      imported += batch.length
    }

    // Log the bulk import action
    await supabase
      .from('audit_logs')
      .insert({
        user_id: 'system', // or actual admin user ID
        action: 'bulk_user_import',
        details: `Imported ${imported} users from CSV file: ${file.name}`,
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown',
        severity: 'medium',
        category: 'user_management',
        status: 'success',
        timestamp: new Date().toISOString()
      })

    return NextResponse.json({
      message: 'Bulk import completed',
      imported,
      skipped: users.length - imported,
      errors: errors.length > 0 ? errors : undefined
    })

  } catch (error) {
    console.error('Bulk import error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
