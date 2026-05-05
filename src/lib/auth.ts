import { supabase } from './supabase'
import { DirectoryDatabase } from './database/directory-db'
import { Profile } from './database/directory-types'

export interface AuthUser {
  id: string
  email: string
  profile?: Profile
}

export class DirectoryAuth {
  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      console.error('Sign in error:', error)
      throw error
    }

    if (data.user) {
      const profile = await DirectoryDatabase.getProfileByUserId(data.user.id)
      return {
        user: {
          id: data.user.id,
          email: data.user.email!,
          profile
        },
        session: data.session
      }
    }

    throw new Error('No user returned from sign in')
  }

  static async signUp(email: string, password: string, profileData: Omit<Profile, 'id' | 'created_at' | 'updated_at' | 'user_id'>) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      console.error('Sign up error:', error)
      throw error
    }

    if (data.user) {
      // Create profile with user_id
      const profile = await DirectoryDatabase.createProfile({
        ...profileData,
        user_id: data.user.id
      })

      return {
        user: {
          id: data.user.id,
          email: data.user.email!,
          profile
        },
        session: data.session
      }
    }

    throw new Error('No user returned from sign up')
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  static async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return null
    }

    const profile = await DirectoryDatabase.getProfileByUserId(user.id)
    
    return {
      id: user.id,
      email: user.email!,
      profile: profile || undefined
    }
  }

  static async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    
    if (error) {
      console.error('Password reset error:', error)
      throw error
    }
  }

  static async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })
    
    if (error) {
      console.error('Password update error:', error)
      throw error
    }
  }

  static async onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await DirectoryDatabase.getProfileByUserId(session.user.id)
        callback({
          id: session.user.id,
          email: session.user.email!,
          profile: profile || undefined
        })
      } else {
        callback(null)
      }
    })
  }
}
