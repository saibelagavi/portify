import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PortfolioBuilder } from '@/components/builder/PortfolioBuilder'

export default async function BuilderPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  const [
    { data: skills },
    { data: projects },
    { data: experiences },
    { data: education },
    { data: profile },
  ] = await Promise.all([
    supabase.from('skills').select('*').eq('profile_id', user.id).order('sort_order'),
    supabase.from('projects').select('*').eq('profile_id', user.id).order('sort_order'),
    supabase.from('experiences').select('*').eq('profile_id', user.id).order('sort_order'),
    supabase.from('education').select('*').eq('profile_id', user.id).order('sort_order'),
    supabase.from('profiles').select('username').eq('id', user.id).single(),
  ])

  return (
    <div className="space-y-6 pt-16 md:pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-3xl font-black text-text tracking-tight"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            Portfolio Builder
          </h1>
          <p className="text-text-muted mt-1">Add your skills, projects, experience, and education.</p>
        </div>
        <a
          href={`/u/${profile?.username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary text-sm hidden sm:flex"
        >
          Preview →
        </a>
      </div>

      <PortfolioBuilder
        initialSkills={skills ?? []}
        initialProjects={projects ?? []}
        initialExperiences={experiences ?? []}
        initialEducation={education ?? []}
      />
    </div>
  )
}
