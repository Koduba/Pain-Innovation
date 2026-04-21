import { NextResponse } from 'next/server'
import { testSupabaseConnection } from '@/lib/test-supabase'

export async function GET() {
  try {
    const result = await testSupabaseConnection()
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Supabase connection is working',
        data: result.data 
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Supabase connection failed',
        error: result.error 
      }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: 'Unexpected error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
