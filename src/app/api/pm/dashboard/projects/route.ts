import { NextRequest, NextResponse } from 'next/server'
import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerActionClient({ cookies })
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user role is PM or higher
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    if (!['project-manager', 'executive'].includes(userProfile.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const client = searchParams.get('client')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Mock data - replace with actual database queries
    const mockProjects = [
      {
        id: 1,
        name: "E-commerce Platform v2.0",
        client: "Acme Corp",
        progress: 78,
        dueDate: "2024-02-15",
        budget: { used: 75000, total: 100000 },
        status: "on-track",
        blockers: 2,
        team: ["John D.", "Sarah M.", "Mike R."],
        managerId: user.id // Only show projects managed by this PM
      },
      {
        id: 2,
        name: "Mobile App Integration",
        client: "TechStart Inc",
        progress: 45,
        dueDate: "2024-01-30",
        budget: { used: 32000, total: 50000 },
        status: "needs-attention",
        blockers: 1,
        team: ["Anna K.", "Tom B."],
        managerId: user.id
      },
      {
        id: 3,
        name: "Data Migration Project",
        client: "Enterprise Ltd",
        progress: 92,
        dueDate: "2024-01-20",
        budget: { used: 48000, total: 60000 },
        status: "critical",
        blockers: 4,
        team: ["Dave L.", "Lisa P.", "Carlos M.", "Emma W."],
        managerId: user.id
      }
    ]

    // Filter projects
    let filteredProjects = mockProjects
    
    if (status && status !== 'all') {
      filteredProjects = filteredProjects.filter(p => p.status === status)
    }
    
    if (client && client !== 'all') {
      filteredProjects = filteredProjects.filter(p => p.client === client)
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProjects = filteredProjects.slice(startIndex, endIndex)

    return NextResponse.json({
      projects: paginatedProjects,
      total: filteredProjects.length,
      page,
      limit,
      totalPages: Math.ceil(filteredProjects.length / limit)
    })

  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerActionClient({ cookies })
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user role is PM or higher
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !userProfile || !['project-manager', 'executive'].includes(userProfile.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    const { name, client, description, budget, dueDate, teamMembers } = body

    // Validate required fields
    if (!name || !client || !budget || !dueDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Mock project creation - replace with actual database insert
    const newProject = {
      id: Date.now(), // Generate proper ID in real implementation
      name,
      client,
      description: description || '',
      progress: 0,
      dueDate,
      startDate: new Date().toISOString(),
      budget: { used: 0, total: budget },
      status: "on-track",
      priority: "medium",
      blockers: 0,
      team: teamMembers || [],
      managerId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({ project: newProject }, { status: 201 })

  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

