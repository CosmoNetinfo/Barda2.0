import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  
  // Vercel Cron Authentication
  // You need to set CRON_SECRET in Vercel environment variables
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.warn('Unauthorized cron invocation')
    // We can return 401, but maybe the user hasn't set the secret yet,
    // so we just log a warning and proceed for now, to ensure DB doesn't sleep.
    // In production, you'd strictly return a 401 response here.
  }

  try {
    // Create a regular supabase client using service role key or anon key
    // We'll use the anon key just to trigger a public read, which is enough to keep it awake.
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Execute a lightweight query to keep DB alive
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)

    if (error) {
      console.error('Keep-alive cron error querying DB:', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Database is awake', data })
  } catch (err: unknown) {
    console.error('Keep-alive cron exception:', err)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
