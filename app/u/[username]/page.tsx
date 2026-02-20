import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { PublicPortfolio } from '@/components/public/PublicPortfolio'
import type { FullProfile } from '@/types'

interface Props {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, headline, bio')
    .eq('username', username)
    .eq('is_public', true)
    .single()

  if (!profile) {
    return { title: 'Portfolio not found — Portify' }
  }

  return {
    title: `${profile.full_name ?? username} — Portify`,
    description: profile.headline ?? profile.bio ?? `${username}'s portfolio on Portify`,
    openGraph: {
      title: `${profile.full_name ?? username} — Portify`,
      description: profile.headline ?? profile.bio ?? undefined,
      type: 'profile',
    },
  }
}

export default async function PublicPortfolioPage({ params }: Props) {
  const { username } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .eq('is_public', true)
    .single()

  if (!profile) notFound()

  const [
    { data: skills },
    { data: projects },
    { data: experiences },
    { data: education },
  ] = await Promise.all([
    supabase.from('skills').select('*').eq('profile_id', profile.id).order('sort_order'),
    supabase.from('projects').select('*').eq('profile_id', profile.id).order('sort_order'),
    supabase.from('experiences').select('*').eq('profile_id', profile.id).order('sort_order'),
    supabase.from('education').select('*').eq('profile_id', profile.id).order('sort_order'),
  ])

  const data: FullProfile = {
    profile,
    skills: skills ?? [],
    projects: projects ?? [],
    experiences: experiences ?? [],
    education: education ?? [],
  }

  return <PublicPortfolio data={data} />
}
