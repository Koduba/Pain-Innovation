import { supabase } from '../supabase'
import { 
  Profile, 
  Connection, 
  Message, 
  Group, 
  GroupMember, 
  CollaborationRequest, 
  Notification,
  ProfileWithRelations,
  DirectorySearchFilters,
  CSVProfileImport
} from './directory-types'

export class DirectoryDatabase {
  // Profile CRUD operations
  static async createProfile(profile: Omit<Profile, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('profiles')
      .insert([profile])
      .select()
      .single()

    if (error) {
      console.error('Error creating profile:', error)
      throw error
    }

    return data
  }

  static async getProfile(id: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      throw error
    }

    return data
  }

  static async getProfileByUserId(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile by user ID:', error)
      throw error
    }

    return data
  }

  static async updateProfile(id: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating profile:', error)
      throw error
    }

    return data
  }

  static async searchProfiles(filters: DirectorySearchFilters, limit: number = 20, offset: number = 0) {
    let query = supabase
      .from('profiles')
      .select('*')
      .eq('status', 'CONFIRMED')

    // Apply filters
    if (filters.query) {
      query = query.or(`full_name.ilike.%${filters.query}%,institution.ilike.%${filters.query}%,job_role.ilike.%${filters.query}%`)
    }

    if (filters.specialty) {
      query = query.contains('areas_of_interest', [filters.specialty])
    }

    if (filters.location) {
      query = query.or(`nationality.ilike.%${filters.location}%,address.ilike.%${filters.location}%`)
    }

    if (filters.institution) {
      query = query.ilike('institution', `%${filters.institution}%`)
    }

    if (filters.areas_of_interest && filters.areas_of_interest.length > 0) {
      query = query.contains('areas_of_interest', filters.areas_of_interest)
    }

    const { data, error } = await query
      .order('full_name', { ascending: true })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error searching profiles:', error)
      throw error
    }

    return data
  }

  static async getConnectedProfiles(profileId: string) {
    const { data, error } = await supabase
      .from('connections')
      .select(`
        profiles!connections_recipient_id_fkey (
          id, full_name, institution, job_role, profile_picture, status
        )
      `)
      .eq('requester_id', profileId)
      .eq('status', 'accepted')

    if (error) {
      console.error('Error fetching connected profiles:', error)
      throw error
    }

    return data?.map(conn => conn.profiles) || []
  }

  // Connection operations
  static async createConnectionRequest(requesterId: string, recipientId: string) {
    const { data, error } = await supabase
      .from('connections')
      .insert([{ requester_id: requesterId, recipient_id: recipientId }])
      .select()
      .single()

    if (error) {
      console.error('Error creating connection request:', error)
      throw error
    }

    return data
  }

  static async updateConnectionStatus(connectionId: string, status: 'accepted' | 'declined') {
    const { data, error } = await supabase
      .from('connections')
      .update({ status })
      .eq('id', connectionId)
      .select()
      .single()

    if (error) {
      console.error('Error updating connection status:', error)
      throw error
    }

    return data
  }

  static async getPendingConnections(profileId: string) {
    const { data, error } = await supabase
      .from('connections')
      .select(`
        *,
        profiles!connections_requester_id_fkey (
          id, full_name, institution, profile_picture
        )
      `)
      .eq('recipient_id', profileId)
      .eq('status', 'pending')

    if (error) {
      console.error('Error fetching pending connections:', error)
      throw error
    }

    return data
  }

  // Message operations
  static async sendMessage(senderId: string, recipientId: string, content: string) {
    const { data, error } = await supabase
      .from('messages')
      .insert([{ sender_id: senderId, recipient_id: recipientId, content }])
      .select()
      .single()

    if (error) {
      console.error('Error sending message:', error)
      throw error
    }

    return data
  }

  static async getMessages(profileId: string, otherProfileId: string, limit: number = 50) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${profileId},recipient_id.eq.${otherProfileId}),and(sender_id.eq.${otherProfileId},recipient_id.eq.${profileId})`)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching messages:', error)
      throw error
    }

    return data
  }

  static async markMessageAsRead(messageId: string) {
    const { data, error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', messageId)
      .select()
      .single()

    if (error) {
      console.error('Error marking message as read:', error)
      throw error
    }

    return data
  }

  static async getUnreadMessageCount(profileId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select('id')
      .eq('recipient_id', profileId)
      .eq('is_read', false)

    if (error) {
      console.error('Error fetching unread message count:', error)
      throw error
    }

    return data?.length || 0
  }

  // Group operations
  static async createGroup(group: Omit<Group, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('groups')
      .insert([group])
      .select()
      .single()

    if (error) {
      console.error('Error creating group:', error)
      throw error
    }

    // Add creator as admin
    await this.addGroupMember(data.id, group.creator_id, 'admin')

    return data
  }

  static async getGroups(profileId: string) {
    const { data, error } = await supabase
      .from('group_members')
      .select(`
        groups (
          id, name, description, is_private, created_at
        )
      `)
      .eq('profile_id', profileId)

    if (error) {
      console.error('Error fetching groups:', error)
      throw error
    }

    return data?.map(member => member.groups) || []
  }

  static async addGroupMember(groupId: string, profileId: string, role: 'admin' | 'member' = 'member') {
    const { data, error } = await supabase
      .from('group_members')
      .insert([{ group_id: groupId, profile_id: profileId, role }])
      .select()
      .single()

    if (error) {
      console.error('Error adding group member:', error)
      throw error
    }

    return data
  }

  // Collaboration operations
  static async createCollaborationRequest(request: Omit<CollaborationRequest, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('collaboration_requests')
      .insert([request])
      .select()
      .single()

    if (error) {
      console.error('Error creating collaboration request:', error)
      throw error
    }

    return data
  }

  static async updateCollaborationStatus(requestId: string, status: 'accepted' | 'declined') {
    const { data, error } = await supabase
      .from('collaboration_requests')
      .update({ status })
      .eq('id', requestId)
      .select()
      .single()

    if (error) {
      console.error('Error updating collaboration status:', error)
      throw error
    }

    return data
  }

  static async getCollaborationRequests(profileId: string, type: 'sent' | 'received' = 'received') {
    const column = type === 'sent' ? 'requester_id' : 'recipient_id'
    
    const { data, error } = await supabase
      .from('collaboration_requests')
      .select(`
        *,
        profiles!collaboration_requests_${column}_fkey (
          id, full_name, institution, profile_picture
        )
      `)
      .eq(column, profileId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching collaboration requests:', error)
      throw error
    }

    return data
  }

  // Notification operations
  static async createNotification(notification: Omit<Notification, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('notifications')
      .insert([notification])
      .select()
      .single()

    if (error) {
      console.error('Error creating notification:', error)
      throw error
    }

    return data
  }

  static async getNotifications(profileId: string, unreadOnly: boolean = false) {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('profile_id', profileId)

    if (unreadOnly) {
      query = query.eq('is_read', false)
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error fetching notifications:', error)
      throw error
    }

    return data
  }

  static async markNotificationAsRead(notificationId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .select()
      .single()

    if (error) {
      console.error('Error marking notification as read:', error)
      throw error
    }

    return data
  }

  // CSV Import functionality
  static async importProfilesFromCSV(csvProfiles: CSVProfileImport[]) {
    const results = {
      imported: 0,
      failed: 0,
      errors: [] as string[]
    }

    for (const csvProfile of csvProfiles) {
      try {
        const profile: Omit<Profile, 'id' | 'created_at' | 'updated_at'> = {
          membership_code: csvProfile.membership_code,
          full_name: csvProfile.full_name,
          professional_email: csvProfile.professional_email,
          profile_picture: csvProfile.profile_picture,
          institution: csvProfile.institution,
          job_role: csvProfile.job_role,
          role_title: csvProfile.role_title,
          nationality: csvProfile.nationality,
          address: csvProfile.address,
          areas_of_interest: csvProfile.areas_of_interest,
          affiliated_pain_society: csvProfile.affiliated_pain_society,
          linkedin_profile: csvProfile.linkedin_profile,
          twitter_profile: csvProfile.twitter_profile,
          publications_link: csvProfile.publications_link,
          bio: csvProfile.bio,
          status: csvProfile.status as 'CONFIRMED' | 'PENDING' | 'INACTIVE' || 'CONFIRMED',
          is_public: true,
          show_email_to_connections: false
        }

        await this.createProfile(profile)
        results.imported++
      } catch (error) {
        results.failed++
        results.errors.push(`Failed to import ${csvProfile.full_name}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    return results
  }

  // Analytics
  static async getDirectoryStats() {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, status, nationality, institution')

    const { data: connections } = await supabase
      .from('connections')
      .select('id, status')

    const { data: groups } = await supabase
      .from('groups')
      .select('id')

    const countries = Array.from(new Set(profiles?.map(p => p.nationality).filter(Boolean) || []))
    const institutions = Array.from(new Set(profiles?.map(p => p.institution).filter(Boolean) || []))

    return {
      total_profiles: profiles?.length || 0,
      confirmed_profiles: profiles?.filter(p => p.status === 'CONFIRMED').length || 0,
      total_connections: connections?.filter(c => c.status === 'accepted').length || 0,
      total_groups: groups?.length || 0,
      countries: countries.length,
      institutions: institutions.length
    }
  }
}
