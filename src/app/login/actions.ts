'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect(`/login?message=${encodeURIComponent(error.message || 'Credenziali non valide')}`)
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = createClient()

  const name = formData.get('name') as string
  if (!name || name.trim() === '') {
    redirect(`/login?message=${encodeURIComponent('Il Nome e Cognome è obbligatorio per la registrazione via email.')}`)
  }

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        name: name.trim(),
        full_name: name.trim()
      }
    }
  }

  const { data: authData, error } = await supabase.auth.signUp(data)

  if (error) {
    redirect(`/login?message=${encodeURIComponent(error.message)}`)
  }

  if (!authData.session) {
    redirect(`/login?message=${encodeURIComponent('Controlla la tua email per confermare la registrazione!')}`)
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signInWithGoogle() {
  const supabase = createClient()
  

  
  const headersList = headers()
  const host = headersList.get('host')
  const protocol = host?.includes('localhost') ? 'http' : 'https'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`
  
  const callbackUrl = `${siteUrl}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: callbackUrl,
    },
  })

  if (data.url) {
    redirect(data.url)
  }

  if (error) {
    redirect('/login?message=Could not authenticate user')
  }
}

