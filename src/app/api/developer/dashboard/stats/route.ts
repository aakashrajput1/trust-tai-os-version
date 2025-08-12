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

    // Verify user role is Developer or higher
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    if (!['developer', 'project-manager', 'executive'].includes(userProfile.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Get current week start and end
    const now = new Date()
    const weekStart = new Date(now)
    const day = weekStart.getDay()
    const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1)
    weekStart.setDate(diff)
    weekStart.setHours(0, 0, 0, 0)

    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    weekEnd.setHours(23, 59, 59, 999)

    // Mock developer statistics - replace with actual database queries
    const mockStats = {
      // Weekly hours tracking
      weeklyHours: {
        logged: 32,
        target: 40,
        billable: 28,
        nonBillable: 4,
        monday: 8,
        tuesday: 8,
        wednesday: 6,
        thursday: 8,
        friday: 2,
        saturday: 0,
        sunday: 0
      },
      
      // Performance metrics
      performance: {
        tasksCompleted: 8,
        tasksInProgress: 3,
        averageTaskTime: 4.2, // hours
        onTimeCompletion: 85, // percentage
        codeReviewsGiven: 5,
        codeReviewsReceived: 3
      },
      
      // Gamification metrics
      gamification: {
        streak: 12, // consecutive days with time logged
        streakRecord: 25,
        level: 5,
        xp: 2850,
        xpToNextLevel: 3000,
        leaderboardPosition: 3,
        totalDevelopers: 15,
        badges: [
          { id: 'early-bird', name: 'Early Bird', description: 'Logged time before 9 AM', earned: true },
          { id: 'night-owl', name: 'Night Owl', description: 'Worked after 8 PM', earned: true },
          { id: 'reviewer', name: 'Code Reviewer', description: 'Completed 10+ code reviews', earned: true },
          { id: 'speedster', name: 'Speedster', description: 'Completed tasks 20% faster than estimated', earned: false }
        ]
      },
      
      // Recent achievements and praise
      recent: {
        praise: [
          {
            id: 1,
            message: "Great job on the API optimization! Performance improved by 40%",
            from: "Sarah M. (PM)",
            fromAvatar: "SM",
            timestamp: "2024-01-25T14:30:00Z",
            project: "E-commerce Platform v2.0",
            rating: 5
          },
          {
            id: 2,
            message: "Your code review feedback was incredibly helpful",
            from: "Mike R. (Developer)",
            fromAvatar: "MR",
            timestamp: "2024-01-24T16:45:00Z",
            project: "Mobile App Integration",
            rating: 4
          },
          {
            id: 3,
            message: "Excellent work on the documentation updates",
            from: "John D. (Tech Lead)",
            fromAvatar: "JD",
            timestamp: "2024-01-23T11:20:00Z",
            project: "Documentation",
            rating: 5
          }
        ],
        
        achievements: [
          {
            id: 1,
            type: 'streak',
            title: 'Consistency Champion',
            description: 'Logged time for 12 consecutive days',
            timestamp: "2024-01-25T09:00:00Z",
            xpGained: 50
          },
          {
            id: 2,
            type: 'performance',
            title: 'Speed Demon',
            description: 'Completed 3 tasks ahead of schedule this week',
            timestamp: "2024-01-24T17:30:00Z",
            xpGained: 75
          }
        ]
      },
      
      // Team ranking and social metrics
      team: {
        weeklyRanking: {
          position: 3,
          totalMembers: 15,
          hoursRanking: 4,
          qualityRanking: 2,
          collaborationRanking: 3
        },
        
        monthlyStats: {
          tasksCompleted: 32,
          avgRating: 4.8,
          helpfulReviews: 18,
          mentoringSessions: 2
        },
        
        teammates: [
          { name: "Alice Chen", position: 1, hours: 38, quality: 4.9 },
          { name: "Bob Wilson", position: 2, hours: 36, quality: 4.7 },
          { name: "You", position: 3, hours: 32, quality: 4.8 },
          { name: "David Kim", position: 4, hours: 30, quality: 4.6 },
          { name: "Emma Davis", position: 5, hours: 28, quality: 4.5 }
        ]
      },
      
      // Project contributions
      projects: {
        active: [
          {
            id: 1,
            name: "E-commerce Platform v2.0",
            hoursContributed: 24,
            tasksCompleted: 5,
            role: "Backend Developer",
            progress: 78
          },
          {
            id: 2,
            name: "Mobile App Integration", 
            hoursContributed: 8,
            tasksCompleted: 2,
            role: "Full Stack Developer",
            progress: 45
          }
        ],
        
        recentContributions: [
          {
            project: "E-commerce Platform v2.0",
            task: "User authentication API",
            hours: 6,
            date: "2024-01-25",
            status: "completed"
          },
          {
            project: "Mobile App Integration",
            task: "Responsive layout fixes",
            hours: 3,
            date: "2024-01-24",
            status: "completed"
          }
        ]
      }
    }

    // Calculate dynamic stats based on current time
    const currentHour = now.getHours()
    if (currentHour < 9) {
      mockStats.gamification.badges[0].earned = true // Early bird
    }
    if (currentHour > 20) {
      mockStats.gamification.badges[1].earned = true // Night owl
    }

    return NextResponse.json({
      stats: mockStats,
      weekRange: {
        start: weekStart.toISOString(),
        end: weekEnd.toISOString()
      },
      generatedAt: now.toISOString(),
      user: {
        id: user.id,
        email: user.email,
        role: userProfile.role
      }
    })

  } catch (error) {
    console.error('Error fetching developer stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

