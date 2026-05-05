import { DirectoryDatabase } from './database/directory-db'
import { CSVProfileImport } from './database/directory-types'

export interface ImportResult {
  success: boolean
  imported: number
  failed: number
  errors: string[]
  duplicates: number
}

export class DirectoryCSVImporter {
  static parseCSV(csvText: string): CSVProfileImport[] {
    const lines = csvText.split('\n').filter(line => line.trim())
    if (lines.length < 2) {
      throw new Error('CSV must have at least a header row and one data row')
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''))
    const profiles: CSVProfileImport[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''))
      const profile: Partial<CSVProfileImport> = {}

      headers.forEach((header, index) => {
        const value = values[index] || ''
        
        switch (header) {
          case 'membership code':
            profile.membership_code = value
            break
          case 'kindly upload your profile picture':
            if (value && value !== '[]') {
              try {
                profile.profile_picture = JSON.parse(value)
              } catch {
                profile.profile_picture = [value]
              }
            }
            break
          case 'id':
            profile.id = value
            break
          case 'please confirm your participation in the directory':
            profile.directory_participation = value === 'true'
            break
          case 'agree terms and conditions':
            profile.terms_agreed = value === 'true'
            break
          case 'nationality':
            profile.nationality = value
            break
          case 'areas of interest':
            if (value && value !== '[]') {
              try {
                profile.areas_of_interest = JSON.parse(value)
              } catch {
                profile.areas_of_interest = [value]
              }
            }
            break
          case 'affiliated pain society':
            if (value && value !== '[]') {
              try {
                profile.affiliated_pain_society = JSON.parse(value)
              } catch {
                profile.affiliated_pain_society = [value]
              }
            }
            break
          case 'agree to the rules of engagement for members':
            profile.rules_agreed = value === 'true'
            break
          case 'address':
            profile.address = value
            break
          case 'linkedin profile link':
            profile.linkedin_profile = value
            break
          case 'publications and research link':
            profile.publications_link = value
            break
          case 'status':
            profile.status = value
            break
          case 'organization/university/company':
            profile.institution = value
            break
          case 'please tell us about yourself':
            profile.bio = value
            break
          case 'job role':
            profile.job_role = value
            break
          case 'professional email':
            profile.professional_email = value
            break
          case 'full name':
            profile.full_name = value
            break
          case 'created date':
            profile.created_date = value
            break
          case 'role':
            profile.role_title = value
            break
          case 'x (formerly twitter) profile link':
            profile.twitter_profile = value
            break
        }
      })

      if (profile.full_name) {
        profiles.push(profile as CSVProfileImport)
      }
    }

    return profiles
  }

  static async importFromCSV(csvText: string): Promise<ImportResult> {
    try {
      const profiles = this.parseCSV(csvText)
      const result = await DirectoryDatabase.importProfilesFromCSV(profiles)
      
      return {
        success: result.failed === 0,
        imported: result.imported,
        failed: result.failed,
        errors: result.errors,
        duplicates: 0 // Will be calculated if needed
      }
    } catch (error) {
      return {
        success: false,
        imported: 0,
        failed: 0,
        errors: [error instanceof Error ? error.message : 'Unknown parsing error'],
        duplicates: 0
      }
    }
  }

  static generateImportTemplate(): string {
    const headers = [
      'Membership Code',
      'Kindly upload your profile picture',
      'Id',
      'Please confirm your participation in the directory',
      'Agree Terms and Conditions',
      'Nationality',
      'Areas of Interest',
      'Affiliated Pain Society',
      'Agree to the Rules of Engagement for Members',
      'Address',
      'LinkedIn Profile Link',
      'Publications and research link',
      'Status',
      'Organization/University/Company',
      'Please tell us about yourself',
      'Job Role',
      'Professional Email',
      'Full Name',
      'Created date',
      'Role',
      'X (formerly Twitter) Profile Link'
    ]

    const example = [
      'AAPM14',
      '["https://example.com/photo.jpg"]',
      '58fdf15f-3200-47f1-aa1e-1bf50eb8d129',
      'true',
      'true',
      'United States',
      '["Medical Education", "Pain Research"]',
      '["American Academy of Pain Medicine"]',
      'true',
      'Baltimore, Maryland',
      'https://linkedin.com/in/example',
      'https://pubmed.ncbi.nlm.nih.gov/example',
      'CONFIRMED',
      'Johns Hopkins',
      'I specialize in pain management and research.',
      'Medical Director',
      'doctor@hospital.edu',
      'Dr. John Smith',
      '2026-04-29T00:33:05Z',
      'President',
      'https://twitter.com/example'
    ]

    return headers.join(',') + '\n' + example.join(',')
  }
}
