import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const actionType = searchParams.get('action') || ''
    const startDate = searchParams.get('startDate') || ''
    const endDate = searchParams.get('endDate') || ''
    const userId = searchParams.get('userId') || ''
    const exportFormat = searchParams.get('export') || ''
    
    let query = supabase
      .from('audit_logs')
      .select(`
        *,
        user:users(name, email)
      `, { count: 'exact' })
    
    // Apply filters
    if (actionType && actionType !== 'all') {
      query = query.eq('action', actionType)
    }
    if (userId && userId !== 'all') {
      query = query.eq('user_id', userId)
    }
    if (startDate) {
      query = query.gte('timestamp', startDate)
    }
    if (endDate) {
      query = query.lte('timestamp', endDate)
    }
    
    // Apply pagination
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)
    query = query.order('timestamp', { ascending: false })
    
    const { data: logs, error, count } = await query
    
    if (error) throw error
    
    // Handle export
    if (exportFormat === 'csv') {
      const csvData = logs?.map(log => ({
        Date: new Date(log.timestamp).toLocaleString(),
        User: log.user?.name || log.user_id,
        Action: log.action,
        Details: log.details,
        'IP Address': log.ip_address
      })) || []
      
      const csv = convertToCSV(csvData)
      
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="audit-logs-${new Date().toISOString().split('T')[0]}.csv"`
        }
      })
    }
    
    if (exportFormat === 'pdf') {
      // For PDF export, you'd typically use a library like puppeteer or jsPDF
      // For now, return JSON with a message
      return NextResponse.json({
        message: 'PDF export not implemented yet',
        logs: logs || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit)
        }
      })
    }
    
    return NextResponse.json({
      logs: logs || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
    
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function convertToCSV(data: any[]): string {
  if (data.length === 0) return ''
  
  const headers = Object.keys(data[0])
  const csvRows = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]
        // Escape commas and quotes in CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      }).join(',')
    )
  ]
  
  return csvRows.join('\n')
}
