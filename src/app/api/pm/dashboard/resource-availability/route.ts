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

    if (profileError || !userProfile || !['project-manager', 'executive'].includes(userProfile.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const weekStart = searchParams.get('weekStart')
    const teamId = searchParams.get('teamId')
    const department = searchParams.get('department')

    // Mock team availability data - replace with actual database queries
    const mockTeamAvailability = [
      {
        id: 1,
        name: "John D.",
        role: "Senior Developer",
        department: "Engineering",
        avatar: "JD",
        email: "john@company.com",
        skills: ["React", "Node.js", "TypeScript"],
        availability: {
          monday: { status: "available", hours: 8, note: "" },
          tuesday: { status: "available", hours: 8, note: "" },
          wednesday: { status: "busy", hours: 6, note: "Client meeting 2-4 PM" },
          thursday: { status: "available", hours: 8, note: "" },
          friday: { status: "available", hours: 8, note: "" }
        },
        projects: [
          { name: "E-commerce Platform v2.0", hours: 25 },
          { name: "Mobile App Integration", hours: 10 }
        ],
        totalHours: 40,
        timeOff: []
      },
      {
        id: 2,
        name: "Sarah M.",
        role: "Frontend Developer",
        department: "Engineering",
        avatar: "SM",
        email: "sarah@company.com",
        skills: ["React", "CSS", "Figma"],
        availability: {
          monday: { status: "available", hours: 8, note: "" },
          tuesday: { status: "available", hours: 8, note: "" },
          wednesday: { status: "available", hours: 8, note: "" },
          thursday: { status: "busy", hours: 4, note: "Training session AM" },
          friday: { status: "available", hours: 8, note: "" }
        },
        projects: [
          { name: "E-commerce Platform v2.0", hours: 30 },
          { name: "Design System", hours: 5 }
        ],
        totalHours: 40,
        timeOff: []
      },
      {
        id: 3,
        name: "Mike R.",
        role: "Backend Developer",
        department: "Engineering",
        avatar: "MR",
        email: "mike@company.com",
        skills: ["Node.js", "Python", "Database"],
        availability: {
          monday: { status: "busy", hours: 6, note: "Migration deployment" },
          tuesday: { status: "available", hours: 8, note: "" },
          wednesday: { status: "available", hours: 8, note: "" },
          thursday: { status: "available", hours: 8, note: "" },
          friday: { status: "available", hours: 8, note: "" }
        },
        projects: [
          { name: "Data Migration Project", hours: 20 },
          { name: "API Gateway", hours: 15 }
        ],
        totalHours: 40,
        timeOff: ["2024-02-02"]
      },
      {
        id: 4,
        name: "Anna K.",
        role: "UI/UX Designer",
        department: "Design",
        avatar: "AK",
        email: "anna@company.com",
        skills: ["Figma", "Prototyping", "User Research"],
        availability: {
          monday: { status: "available", hours: 8, note: "" },
          tuesday: { status: "available", hours: 8, note: "" },
          wednesday: { status: "available", hours: 8, note: "" },
          thursday: { status: "available", hours: 8, note: "" },
          friday: { status: "off", hours: 0, note: "Personal day" }
        },
        projects: [
          { name: "E-commerce Platform v2.0", hours: 20 },
          { name: "Mobile App Integration", hours: 15 }
        ],
        totalHours: 40,
        timeOff: ["2024-02-09"]
      },
      {
        id: 5,
        name: "Tom B.",
        role: "QA Engineer",
        department: "Quality Assurance",
        avatar: "TB",
        email: "tom@company.com",
        skills: ["Testing", "Automation", "Cypress"],
        availability: {
          monday: { status: "available", hours: 8, note: "" },
          tuesday: { status: "busy", hours: 6, note: "Stakeholder demo" },
          wednesday: { status: "available", hours: 8, note: "" },
          thursday: { status: "available", hours: 8, note: "" },
          friday: { status: "available", hours: 8, note: "" }
        },
        projects: [
          { name: "E-commerce Platform v2.0", hours: 25 },
          { name: "Quality Framework", hours: 10 }
        ],
        totalHours: 40,
        timeOff: []
      }
    ]

    // Filter by department if specified
    let filteredTeam = mockTeamAvailability
    if (department && department !== 'all') {
      filteredTeam = filteredTeam.filter(member => member.department === department)
    }

    // Calculate utilization for each team member
    const teamWithUtilization = filteredTeam.map(member => {
      const totalProjectHours = member.projects.reduce((sum, project) => sum + project.hours, 0)
      const utilization = Math.round((totalProjectHours / member.totalHours) * 100)
      
      return {
        ...member,
        utilization,
        isOverallocated: utilization > 100
      }
    })

    return NextResponse.json({
      teamAvailability: teamWithUtilization,
      weekStart: weekStart || new Date().toISOString().split('T')[0],
      summary: {
        totalMembers: teamWithUtilization.length,
        avgUtilization: Math.round(
          teamWithUtilization.reduce((sum, member) => sum + member.utilization, 0) / teamWithUtilization.length
        ),
        overallocatedMembers: teamWithUtilization.filter(member => member.isOverallocated).length,
        availableHours: teamWithUtilization.reduce((sum, member) => {
          const availableHours = Object.values(member.availability).reduce((daySum: number, day: any) => daySum + day.hours, 0)
          return sum + availableHours
        }, 0)
      }
    })

  } catch (error) {
    console.error('Error fetching resource availability:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
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
    const { memberId, availability, timeOff } = body

    // Validate required fields
    if (!memberId) {
      return NextResponse.json({ error: 'Member ID is required' }, { status: 400 })
    }

    // Mock update - replace with actual database update
    const updatedMember = {
      id: memberId,
      availability: availability || {},
      timeOff: timeOff || [],
      updatedAt: new Date().toISOString(),
      updatedBy: user.id
    }

    return NextResponse.json({ 
      message: 'Availability updated successfully',
      member: updatedMember 
    })

  } catch (error) {
    console.error('Error updating resource availability:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

