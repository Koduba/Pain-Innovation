export interface Profile {
  id: string
  user_id?: string
  membership_code?: string
  full_name: string
  professional_email?: string
  profile_picture?: string[]
  institution?: string
  job_role?: string
  role_title?: string
  nationality?: string
  address?: string
  areas_of_interest?: string[]
  affiliated_pain_society?: string[]
  linkedin_profile?: string
  twitter_profile?: string
  publications_link?: string
  bio?: string
  status: 'CONFIRMED' | 'PENDING' | 'INACTIVE'
  is_public: boolean
  show_email_to_connections: boolean
  created_at: string
  updated_at: string
}

export interface Connection {
  id: string
  requester_id: string
  recipient_id: string
  status: 'pending' | 'accepted' | 'declined'
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  sender_id: string
  recipient_id: string
  content: string
  is_read: boolean
  created_at: string
}

export interface Group {
  id: string
  name: string
  description?: string
  creator_id: string
  is_private: boolean
  created_at: string
  updated_at: string
}

export interface GroupMember {
  id: string
  group_id: string
  profile_id: string
  role: 'admin' | 'member'
  joined_at: string
}

export interface CollaborationRequest {
  id: string
  requester_id: string
  recipient_id: string
  title: string
  description?: string
  status: 'pending' | 'accepted' | 'declined'
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  profile_id: string
  type: 'message' | 'connection_request' | 'collaboration_request' | 'group_invite'
  title: string
  content?: string
  related_id?: string
  is_read: boolean
  email_sent: boolean
  created_at: string
}

export interface ProfileWithRelations extends Profile {
  connections?: Connection[]
  unread_message_count?: number
  pending_requests?: number
}

export interface DirectorySearchFilters {
  query?: string
  specialty?: string
  location?: string
  institution?: string
  areas_of_interest?: string[]
  status?: string
}

export interface CSVProfileImport {
  membership_code?: string
  profile_picture?: string[]
  id?: string
  directory_participation?: boolean
  terms_agreed?: boolean
  nationality?: string
  areas_of_interest?: string[]
  affiliated_pain_society?: string[]
  rules_agreed?: boolean
  address?: string
  linkedin_profile?: string
  publications_link?: string
  status?: string
  institution?: string
  bio?: string
  job_role?: string
  professional_email?: string
  full_name: string
  created_date?: string
  role_title?: string
  twitter_profile?: string
}
