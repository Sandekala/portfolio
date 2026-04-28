export interface Technology {
  id: string
  name: string
  icon_url: string
}

export interface Profile {
  id: string
  full_name: string
  job_title: string
  bio: string
  full_bio: string
  cv_url: string
  email: string
  avatar_url: string
  social_links: {
    url: string
    icon: string
    platform: string
  }[]
  created_at: string
}

export interface Project {
  id: string
  title: string
  slug: string
  short_description: string
  content: string
  image_url: string
  demo_url: string
  github_url: string
  is_featured: boolean
  created_at: string
}

export interface WorkExperience {
  id: string
  company_name: string
  position: string
  location: string
  start_date: string
  end_date: string
  is_current: boolean
  description: string
  company_logo_url: string
  created_at: string
}
