"use server"

import { supabaseAdmin } from './supabase/admin'
import { createClient as createSupabaseServerClient } from './supabase/server'

export async function signUp(userData: {
  name: string
  email: string
  password: string
  avatar_url?: string
}) {
  const supabase = await createSupabaseServerClient()
  try {
    // Sign up user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          name: userData.name,
          avatar_url: userData.avatar_url,
        },
      },
    })

    if (error) {
      return { success: false, error: error.message }
    }

    if (data.user) {
      // Create user profile with initial credits
      const { error: profileError } = await supabaseAdmin.from('profiles').insert({
        id: data.user.id,
        name: userData.name,
        email: userData.email,
        avatar_url: userData.avatar_url,
        credits: 10, // Free credits for new users
      })

      if (profileError) {
        console.error('Profile creation error:', profileError)
        return { success: false, error: 'Failed to create user profile' }
      }

      return {
        success: true,
        user: {
          id: data.user.id,
          name: userData.name,
          email: userData.email,
          avatar_url: userData.avatar_url,
        },
      }
    }

    return { success: false, error: 'User creation failed' }
  } catch (error) {
    console.error('Signup error:', error)
    return { success: false, error: 'Failed to create account' }
  }
}

export async function signIn(email: string, password: string) {
  const supabase = await createSupabaseServerClient()
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    if (data.user) {
      // Get user profile
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (profileError) {
        console.error('Profile fetch error:', profileError)
        return { success: false, error: 'Failed to fetch user profile' }
      }

      return {
        success: true,
        user: {
          id: data.user.id,
          name: profile.name,
          email: profile.email,
          avatar_url: profile.avatar_url,
        },
      }
    }

    return { success: false, error: 'Sign in failed' }
  } catch (error) {
    console.error('Signin error:', error)
    return { success: false, error: 'Sign in failed' }
  }
}

export async function signOut() {
  const supabase = await createSupabaseServerClient()
  try {
    const { error } = await supabase.auth.signOut({ scope: 'global' })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Signout error:', error)
    return { success: false, error: 'Sign out failed' }
  }
}

export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient()
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return null
    }

    // Get user profile with credits
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Profile fetch error:', profileError)
      return null
    }

    return {
      id: user.id,
      name: profile.name,
      email: profile.email,
      avatar_url: profile.avatar_url,
      credits: profile.credits,
    }
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}

export async function createProfileFromOAuth(user: {
  id: string
  name: string
  email: string
  avatar_url: string
}) {
  try {
    // Use upsert to create or update the profile
    const { error } = await supabaseAdmin.from('profiles').upsert(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar_url: user.avatar_url,
        // Only set credits if it's a new user, which upsert handles gracefully
        // by not overwriting existing values for unspecified columns.
        // However, to be explicit, we can check if the profile exists first
        // or handle credits separately if needed. For simplicity, we assume
        // new users get 10 credits and existing users' credits are untouched.
      },
      { onConflict: 'id' }
    )

    if (error) {
      console.error('Upsert profile error:', error)
      return { success: false, error: 'Failed to create or update user profile' }
    }

    // Additionally, ensure new users get their initial credits
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('credits')
      .eq('id', user.id)
      .single()

    if (profile && profile.credits === null) {
      await supabaseAdmin.from('profiles').update({ credits: 10 }).eq('id', user.id)
    }

    return { success: true, message: 'Profile created or updated successfully' }
  } catch (error) {
    console.error('Create profile from OAuth error:', error)
    return { success: false, error: 'Failed to create or update profile from OAuth' }
  }
}

export async function updateUserCredits(userId: string, creditsToDecrement: number) {
  try {
    // First, get the current credit balance
    const { data: profile, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single()

    if (fetchError) {
      return { success: false, error: 'Failed to fetch user profile' }
    }

    // Check if the user has enough credits
    if (profile.credits < creditsToDecrement) {
      return { success: false, error: 'Insufficient credits' }
    }

    // Proceed with decrementing credits
    const { data, error } = await supabaseAdmin.rpc('decrement_user_credits', {
      user_id_input: userId,
      decrement_amount: creditsToDecrement,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, newBalance: data }
  } catch (error) {
    console.error('Update credits error:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    return { success: false, error: `Failed to update credits: ${errorMessage}` }
  }
}

export async function addUserCredits(userId: string, creditsToAdd: number) {
  try {
    const { data, error } = await supabaseAdmin.rpc('increment_user_credits', {
      user_id_input: userId,
      increment_amount: creditsToAdd,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, newBalance: data }
  } catch (error) {
    console.error('Add credits error:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    return { success: false, error: `Failed to add credits: ${errorMessage}` }
  }
}
