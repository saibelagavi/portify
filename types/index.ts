export interface Profile {
  id: string
  username: string
  full_name: string | null
  headline: string | null
  bio: string | null
  avatar_url: string | null
  location: string | null
  website: string | null
  github: string | null
  linkedin: string | null
  twitter: string | null
  instagram: string | null
  youtube: string | null
  dribbble: string | null
  is_public: boolean
  created_at: string
  updated_at: string
}

export interface Skill {
  id: string
  profile_id: string
  name: string
  category: string | null
  level: number // 1-5
  sort_order: number
  created_at: string
}

export interface Project {
  id: string
  profile_id: string
  title: string
  description: string | null
  tech_stack: string[]
  github_url: string | null
  live_url: string | null
  image_url: string | null
  featured: boolean
  sort_order: number
  created_at: string
}

export interface Experience {
  id: string
  profile_id: string
  company: string
  role: string
  description: string | null
  start_date: string | null
  end_date: string | null
  is_current: boolean
  sort_order: number
  created_at: string
}

export interface Education {
  id: string
  profile_id: string
  institution: string
  degree: string | null
  field: string | null
  start_year: number | null
  end_year: number | null
  description: string | null
  sort_order: number
  created_at: string
}

export interface FullProfile {
  profile: Profile
  skills: Skill[]
  projects: Project[]
  experiences: Experience[]
  education: Education[]
}
