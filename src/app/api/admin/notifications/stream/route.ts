import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    // Set up SSE headers
    const headers = {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    }

    // Create response with streaming
    const stream = new ReadableStream({
      start(controller) {
        // Send initial connection message
        const initialMessage = `data: ${JSON.stringify({
          type: 'connection_established',
          timestamp: new Date().toISOString(),
          message: 'Real-time notifications connected'
        })}\n\n`
        
        controller.enqueue(new TextEncoder().encode(initialMessage))

        // Keep connection alive with heartbeat
        const heartbeat = setInterval(() => {
          const heartbeatMessage = `data: ${JSON.stringify({
            type: 'heartbeat',
            timestamp: new Date().toISOString()
          })}\n\n`
          
          try {
            controller.enqueue(new TextEncoder().encode(heartbeatMessage))
          } catch (error) {
            clearInterval(heartbeat)
            controller.close()
          }
        }, 30000) // Send heartbeat every 30 seconds

        // Cleanup on close
        request.signal.addEventListener('abort', () => {
          clearInterval(heartbeat)
          controller.close()
        })
      }
    })

    return new Response(stream, { headers })
  } catch (error) {
    console.error('Error in notifications stream:', error)
    return NextResponse.json(
      { error: 'Failed to establish notification stream' },
      { status: 500 }
    )
  }
}



