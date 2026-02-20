import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProfileForm } from '@/components/dashboard/ProfileForm'

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="space-y-8 pt-16 md:pt-0">
      <div>
        <h1
          className="text-3xl font-black text-text tracking-tight"
          style={{ fontFamily: 'var(--font-syne)' }}
        >
          Your Profile
        </h1>
        <p className="text-text-muted mt-1">
          This info appears on your public portfolio.
        </p>
      </div>

      <ProfileForm profile={profile} userId={user.id} />
    </div>
  )
}
