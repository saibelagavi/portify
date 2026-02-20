'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function signUp(
  prevState: { error: string | null; success?: boolean },
  formData: FormData
) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  const username = (formData.get('username') as string).toLowerCase().trim()

  if (!email || !password || !username) {
    return { error: 'All fields are required.' }
  }

  // Check if username is taken
  const { data: existing } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)
    .single()

  if (existing) {
    return { error: 'Username is already taken. Try another one.' }
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, username },
    },
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  // Return success — client handles the redirect
  return { error: null, success: true }
}

export async function signIn(
  prevState: { error: string | null; success?: boolean },
  formData: FormData
) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: 'Invalid email or password. Please try again.' }
  }

  revalidatePath('/', 'layout')
  // Return success — client handles the redirect
  return { error: null, success: true }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
