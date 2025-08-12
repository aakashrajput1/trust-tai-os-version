import { NextRequest, NextResponse } from 'next/server'
import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

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
    const { assignments, weekStart } = body

    // Validate required fields
    if (!assignments || !Array.isArray(assignments) || !weekStart) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Mock team member data with their constraints
    const teamMembers = [
      {
        id: 'member-1',
        name: 'John D.',
        maxHoursPerWeek: 40,
        maxHoursPerDay: 8,
        unavailableDays: [],
        skills: ['React', 'Node.js', 'TypeScript']
      },
      {
        id: 'member-2',
        name: 'Sarah M.',
        maxHoursPerWeek: 40,
        maxHoursPerDay: 8,
        unavailableDays: ['friday'], // Personal day
        skills: ['React', 'CSS', 'Figma']
      },
      {
        id: 'member-3',
        name: 'Mike R.',
        maxHoursPerWeek: 40,
        maxHoursPerDay: 8,
        unavailableDays: [],
        skills: ['Node.js', 'Python', 'Database']
      },
      {
        id: 'member-4',
        name: 'Anna K.',
        maxHoursPerWeek: 40,
        maxHoursPerDay: 8,
        unavailableDays: [],
        skills: ['Figma', 'Prototyping', 'User Research']
      },
      {
        id: 'member-5',
        name: 'Tom B.',
        maxHoursPerWeek: 40,
        maxHoursPerDay: 8,
        unavailableDays: [],
        skills: ['Testing', 'Automation', 'Cypress']
      }
    ]

    // Mock existing assignments for the week
    const existingAssignments = [
      { memberId: 'member-1', day: 'monday', hours: 8 },
      { memberId: 'member-1', day: 'tuesday', hours: 6 },
      { memberId: 'member-2', day: 'monday', hours: 8 },
      { memberId: 'member-2', day: 'tuesday', hours: 8 },
      { memberId: 'member-3', day: 'wednesday', hours: 8 }
    ]

    // Combine existing and new assignments
    const allAssignments = [...existingAssignments, ...assignments]

    // Detect conflicts
    const conflicts = []
    const memberHours: { [key: string]: { [key: string]: number, total: number } } = {}

    // Initialize member hours tracking
    teamMembers.forEach(member => {
      memberHours[member.id] = {
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0,
        total: 0
      }
    })

    // Calculate hours for each member
    allAssignments.forEach(assignment => {
      const memberId = assignment.memberId
      const day = assignment.day.toLowerCase()
      
      if (memberHours[memberId]) {
        memberHours[memberId][day] += assignment.hours
        memberHours[memberId].total += assignment.hours
      }
    })

    // Check for conflicts
    teamMembers.forEach(member => {
      const memberAssignments = memberHours[member.id]
      
      // Check weekly hour limits
      if (memberAssignments.total > member.maxHoursPerWeek) {
        conflicts.push({
          type: 'weekly_overallocation',
          memberId: member.id,
          memberName: member.name,
          severity: 'high',
          details: {
            assignedHours: memberAssignments.total,
            maxHours: member.maxHoursPerWeek,
            overageHours: memberAssignments.total - member.maxHoursPerWeek
          },
          message: `${member.name} is assigned ${memberAssignments.total} hours, exceeding the ${member.maxHoursPerWeek} hour weekly limit`
        })
      }

      // Check daily hour limits
      ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].forEach(day => {
        if (memberAssignments[day] > member.maxHoursPerDay) {
          conflicts.push({
            type: 'daily_overallocation',
            memberId: member.id,
            memberName: member.name,
            day,
            severity: 'medium',
            details: {
              assignedHours: memberAssignments[day],
              maxHours: member.maxHoursPerDay,
              overageHours: memberAssignments[day] - member.maxHoursPerDay
            },
            message: `${member.name} is assigned ${memberAssignments[day]} hours on ${day}, exceeding the ${member.maxHoursPerDay} hour daily limit`
          })
        }
      })

      // Check unavailable days
      member.unavailableDays.forEach(unavailableDay => {
        if (memberAssignments[unavailableDay] > 0) {
          conflicts.push({
            type: 'unavailable_day',
            memberId: member.id,
            memberName: member.name,
            day: unavailableDay,
            severity: 'high',
            details: {
              assignedHours: memberAssignments[unavailableDay]
            },
            message: `${member.name} is assigned ${memberAssignments[unavailableDay]} hours on ${unavailableDay}, but is unavailable that day`
          })
        }
      })
    })

    // Check for task skill mismatches (if task info is provided)
    const taskSkillConflicts = assignments
      .filter(assignment => assignment.requiredSkills && assignment.requiredSkills.length > 0)
      .map(assignment => {
        const member = teamMembers.find(m => m.id === assignment.memberId)
        if (!member) return null

        const missingSkills = assignment.requiredSkills.filter(
          (skill: string) => !member.skills.includes(skill)
        )

        if (missingSkills.length > 0) {
          return {
            type: 'skill_mismatch',
            memberId: member.id,
            memberName: member.name,
            taskId: assignment.taskId,
            severity: 'low',
            details: {
              requiredSkills: assignment.requiredSkills,
              memberSkills: member.skills,
              missingSkills
            },
            message: `${member.name} lacks required skills: ${missingSkills.join(', ')}`
          }
        }
        return null
      })
      .filter(conflict => conflict !== null)

    conflicts.push(...taskSkillConflicts)

    // Categorize conflicts by severity
    const conflictSummary = {
      high: conflicts.filter(c => c.severity === 'high').length,
      medium: conflicts.filter(c => c.severity === 'medium').length,
      low: conflicts.filter(c => c.severity === 'low').length,
      total: conflicts.length
    }

    // Generate suggestions for resolving conflicts
    const suggestions = []
    
    if (conflictSummary.high > 0) {
      suggestions.push({
        type: 'redistribute_hours',
        message: 'Consider redistributing tasks to balance workload across team members',
        priority: 'high'
      })
    }

    if (taskSkillConflicts.length > 0) {
      suggestions.push({
        type: 'skill_training',
        message: 'Consider providing training or pairing team members to address skill gaps',
        priority: 'medium'
      })
    }

    if (conflictSummary.total === 0) {
      suggestions.push({
        type: 'no_conflicts',
        message: 'No conflicts detected. The current assignment plan looks good!',
        priority: 'info'
      })
    }

    return NextResponse.json({
      hasConflicts: conflicts.length > 0,
      conflicts,
      conflictSummary,
      suggestions,
      memberUtilization: Object.keys(memberHours).map(memberId => {
        const member = teamMembers.find(m => m.id === memberId)
        const utilization = memberHours[memberId]
        return {
          memberId,
          memberName: member?.name,
          totalHours: utilization.total,
          utilizationPercentage: Math.round((utilization.total / (member?.maxHoursPerWeek || 40)) * 100),
          dailyHours: {
            monday: utilization.monday,
            tuesday: utilization.tuesday,
            wednesday: utilization.wednesday,
            thursday: utilization.thursday,
            friday: utilization.friday
          }
        }
      }),
      weekStart
    })

  } catch (error) {
    console.error('Error detecting conflicts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

