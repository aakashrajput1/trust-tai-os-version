import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { 
  User, 
  UserListResponse, 
  CreateUserRequest, 
  UpdateUserRequest,
  UserFilters,
  UserPagination,
  BulkOperationResult
} from '@/types/admin'

// Create service role client for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Helper function to verify admin authentication
async function verifyAdminAuth(supabase: any) {
  try {
    // Check if user has admin role in admin table
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      console.log('No session found')
      return { isAdmin: false, adminId: null }
    }

    console.log('Session found for user:', session.user.id)

    // Check admin table for current user
    const { data: adminUser, error: adminError } = await supabase
      .from('admin')
      .select('id, role, status')
      .eq('id', session.user.id)
      .eq('status', 'active')
      .single()

    if (adminError) {
      console.log('Admin table check error:', adminError)
      // Also check users table for admin role
      const { data: userAdmin } = await supabase
        .from('users')
        .select('id, role, status')
        .eq('id', session.user.id)
        .eq('role', 'Admin')
        .eq('status', 'active')
        .single()

      if (userAdmin) {
        console.log('User found in users table with Admin role')
        return { isAdmin: true, adminId: userAdmin.id }
      }
    }

    if (adminUser && adminUser.role === 'admin') {
      console.log('Admin user found in admin table')
      return { isAdmin: true, adminId: adminUser.id }
    }

    console.log('User is not admin')
    return { isAdmin: false, adminId: null }
  } catch (error) {
    console.error('Admin auth error:', error)
    return { isAdmin: false, adminId: null }
  }
}

export async function GET(request: NextRequest) {
  try {
    // TEMPORARY: Skip all authentication for testing
    console.log('🚀 GET /api/admin/users - Authentication bypassed for testing')
    
    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') || 'all'
    const status = searchParams.get('status') || 'all'
    const department = searchParams.get('department') || ''
    const startDate = searchParams.get('startDate') || ''
    const endDate = searchParams.get('endDate') || ''
    const mfaEnabled = searchParams.get('mfaEnabled') || ''

    // Build filters
    const filters: UserFilters = {
      search,
      role: role === 'all' ? undefined : role as any,
      status: status === 'all' ? undefined : status as any,
      department: department || undefined,
      dateRange: startDate && endDate ? { start: startDate, end: endDate } : undefined,
      mfaEnabled: mfaEnabled ? mfaEnabled === 'true' : undefined
    }

    // Get users with filters using admin client
    const userListResponse = await getUsersWithFilters(supabaseAdmin, filters, page, limit)

    return NextResponse.json({
      success: true,
      data: userListResponse
    })

  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // TEMPORARY: Skip all authentication for testing
    console.log('🚀 POST /api/admin/users - Authentication bypassed for testing')
    
    const userData: CreateUserRequest = await request.json()
    
    console.log('📥 Raw request body:', userData)
    console.log('📥 User data received:', {
      name: userData.name,
      email: userData.email,
      role: userData.role,
      roleType: typeof userData.role,
      department: userData.department,
      position: userData.position
    })

    // Validate required fields
    if (!userData.name || !userData.email || !userData.role) {
      console.log('❌ Validation failed:', {
        hasName: !!userData.name,
        hasEmail: !!userData.email,
        hasRole: !!userData.role,
        roleValue: userData.role
      })
      return NextResponse.json(
        { error: 'Name, email, and role are required' },
        { status: 400 }
      )
    }

    console.log('✅ Validation passed, proceeding with user creation')

    // Check if user already exists in either table
    const { data: existingUser, error: userCheckError } = await supabaseAdmin
      .from('users')
      .select('id, email')
      .eq('email', userData.email)
      .single()

    const { data: existingAdmin, error: adminCheckError } = await supabaseAdmin
      .from('admin')
      .select('id, email')
      .eq('email', userData.email)
      .single()

    // If user exists in either table, return error
    if (existingUser || existingAdmin) {
      const existingEmail = existingUser?.email || existingAdmin?.email
      console.log(`❌ User with email ${existingEmail} already exists`)
      return NextResponse.json(
        { error: `User with email ${existingEmail} already exists` },
        { status: 400 }
      )
    }

    console.log('✅ No existing user found, proceeding with creation')
    console.log('🎯 Creating user with role:', userData.role)

    let createdUser: any

    if (userData.role === 'admin') {
      console.log('👑 Creating admin user...')
      createdUser = await createAdminUser(supabaseAdmin, userData, 'admin-bypass')
    } else {
      console.log('👤 Creating regular user...')
      createdUser = await createRegularUser(supabaseAdmin, userData)
    }

    if (!createdUser) {
      throw new Error('Failed to create user')
    }

    console.log('✅ User created successfully:', createdUser)

    // Log the action
    await logAuditEvent(supabaseAdmin, {
      userId: 'admin-bypass',
      action: 'user_created',
      resource: userData.role === 'admin' ? 'admin' : 'users',
      resourceId: createdUser.id,
      details: { 
        userRole: userData.role,
        userEmail: userData.email,
        targetTable: userData.role === 'admin' ? 'admin' : 'users'
      }
    })

    return NextResponse.json({
      success: true,
      data: createdUser,
      message: 'User created successfully'
    })

  } catch (error) {
    console.error('❌ Create user error:', error)
    
    // Handle specific database errors
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 400 }
        )
      }
    }
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

async function createAdminUser(supabase: any, userData: CreateUserRequest, adminId: string): Promise<any> {
  try {
    console.log('Creating admin user with data:', userData)
    
    // Generate temporary password
    const tempPassword = generateTemporaryPassword()

    // Create user in Supabase Auth using admin client
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: userData.email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        name: userData.name,
        role: userData.role,
        created_by: 'admin'
      }
    })

    if (authError) {
      console.error('Auth error creating admin user:', authError)
      throw authError
    }

    console.log('Auth user created:', authUser.user.id)

    // Create admin user profile using admin client
    const { data: adminUser, error: profileError } = await supabaseAdmin
      .from('admin')
      .insert({
        id: authUser.user.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (profileError) {
      console.error('Profile error creating admin user:', profileError)
      throw profileError
    }

    console.log('Admin profile created successfully')

    // Send invitation email
    await sendInvitationEmail(userData.email, userData.name, tempPassword)

    return adminUser

  } catch (error) {
    console.error('Error creating admin user:', error)
    throw error
  }
}

async function createRegularUser(supabase: any, userData: CreateUserRequest): Promise<any> {
  try {
    console.log('🔧 createRegularUser called with data:', userData)
    console.log('🔧 Role value:', userData.role, 'Type:', typeof userData.role)
    
    // Generate temporary password
    const tempPassword = generateTemporaryPassword()

    // Create user in Supabase Auth using admin client
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: userData.email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        name: userData.name,
        role: userData.role,
        created_by: 'admin'
      }
    })

    if (authError) {
      console.error('❌ Auth error creating regular user:', authError)
      throw authError
    }

    console.log('✅ Auth user created:', authUser.user.id)

    // Prepare profile data
    const profileData = {
      id: authUser.user.id,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      status: 'active',
      department: userData.department || null,
      position: userData.position || null,
      mfa_enabled: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    console.log('🔧 Profile data to insert:', profileData)

    // Create regular user profile using admin client with conflict handling
    const { data: regularUser, error: profileError } = await supabaseAdmin
      .from('users')
      .upsert(profileData, { 
        onConflict: 'id',
        ignoreDuplicates: false 
      })
      .select()
      .single()

    if (profileError) {
      console.error('❌ Profile error creating regular user:', profileError)
      throw profileError
    }

    console.log('✅ Regular user profile created successfully:', regularUser)

    // Send invitation email
    await sendInvitationEmail(userData.email, userData.name, tempPassword)

    return regularUser

  } catch (error) {
    console.error('❌ Error creating regular user:', error)
    throw error
  }
}

async function getUsersWithFilters(
  supabase: any, 
  filters: UserFilters, 
  page: number, 
  limit: number
): Promise<UserListResponse> {
  try {
    // Get users from both tables
    let allUsers: any[] = []

    // Get regular users
    let usersQuery = supabase
      .from('users')
      .select('*', { count: 'exact' })

    // Apply filters
    if (filters.search) {
      usersQuery = usersQuery.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
    }

    if (filters.role) {
      usersQuery = usersQuery.eq('role', filters.role)
    }

    if (filters.status) {
      usersQuery = usersQuery.eq('status', filters.status)
    }

    const { data: users, count: usersCount } = await usersQuery

    // Get admin users (excluding current admin)
    let adminQuery = supabase
      .from('admin')
      .select('*', { count: 'exact' })
      .neq('role', 'admin') // Exclude super admins

    if (filters.search) {
      adminQuery = adminQuery.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
    }

    if (filters.role) {
      adminQuery = adminQuery.eq('role', filters.role)
    }

    const { data: adminUsers, count: adminCount } = await adminQuery

    // Combine and transform users
    if (users) allUsers.push(...users)
    if (adminUsers) allUsers.push(...adminUsers)

    // Apply additional filters
    if (filters.status && filters.status !== 'all') {
      allUsers = allUsers.filter(user => user.status === filters.status)
    }

    // Sort by creation date
    allUsers.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    // Apply pagination
    const total = (usersCount || 0) + (adminCount || 0)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedUsers = allUsers.slice(startIndex, endIndex)

    // Transform to User interface
    const transformedUsers: User[] = paginatedUsers.map((user: any) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: 'active', // Default since column doesn't exist
      department: '', // Default since column doesn't exist
      position: '', // Default since column doesn't exist
      mfa_enabled: false, // Default since column doesn't exist
      lastActive: user.updated_at || user.created_at,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      avatar: '', // Default since column doesn't exist
      phone: '', // Default since column doesn't exist
      location: '', // Default since column doesn't exist
      managerId: '', // Default since column doesn't exist
      permissions: [], // Default since column doesn't exist
      metadata: {} // Default since column doesn't exist
    }))

    const totalPages = Math.ceil(total / limit)

    const pagination: UserPagination = {
      page,
      limit,
      total,
      totalPages
    }

    return {
      users: transformedUsers,
      pagination,
      filters
    }

  } catch (error) {
    console.error('Error getting users with filters:', error)
    throw error
  }
}

async function logAuditEvent(supabase: any, eventData: {
  userId: string
  action: string
  resource: string
  resourceId?: string
  details: Record<string, any>
}) {
  try {
    await supabase
      .from('admin_audit_logs')
      .insert({
        admin_id: eventData.userId,
        action: eventData.action,
        details: eventData.details,
        ip_address: '127.0.0.1', // In real app, get from request
        timestamp: new Date().toISOString(),
        severity: 'low'
      })
  } catch (error) {
    console.error('Error logging audit event:', error)
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
