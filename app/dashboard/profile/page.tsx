'use client'

import { SquarePen } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import useSWR from 'swr'
import z from 'zod'

import BaseHtmlRenderer from '@/components/base/base-hmtl-renderer'
import FormProfile, { formSchema } from '@/components/form/form-profile'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/types'

const USER_ID = process.env.NEXT_PUBLIC_USER_ID

export default function Page() {
  const supabase = createClient()

  const [isOpen, setIsOpen] = useState<boolean>(false)

  /**
   * SWR FETCHER — single profile (first row)
   */

  const fetcher = async (): Promise<Profile> => {
    if (!USER_ID) throw new Error('Missing user id')

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', USER_ID)
      .maybeSingle()

    if (error) throw error
    return data
  }

  const {
    data: profile,
    mutate,
    isLoading,
  } = useSWR<Profile>(USER_ID ? ['profile-single', USER_ID] : null, fetcher)

  /**
   * HANDLERS
   */
  const handleSubmit = async (formData: z.infer<typeof formSchema>) => {
    try {
      if (profile?.id) {
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: formData.full_name,
            job_title: formData.job_title,
            bio: formData.bio,
            full_bio: formData.full_bio,
            cv_url: formData.cv_url,
            email: formData.email,
            avatar_url: formData.avatar_url,
            social_links: formData.social_links,
          })
          .eq('id', profile.id)

        if (error) throw error
        toast.success('Profile updated successfully')
      } else {
        const { error } = await supabase.from('profiles').insert([formData])
        if (error) throw error
        toast.success('Profile created successfully')
      }

      setIsOpen(false)
      await mutate()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  /**
   * LOADING STATE
   */
  if (isLoading) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-16">
        <div className="flex flex-col items-center gap-6">
          <Skeleton className="h-32 w-32 rounded-full" />
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    )
  }

  /**
   * EMPTY STATE
   */
  if (!profile) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="mb-4 text-muted-foreground">No profile found.</p>
        <Button onClick={() => setIsOpen(true)}>Create Profile</Button>
        <FormProfile
          key="new"
          open={isOpen}
          onOpenChange={setIsOpen}
          onSubmit={handleSubmit}
          defaultValues={null}
          isLoading={false}
        />
      </div>
    )
  }

  /**
   * RENDER
   */
  return (
    <div className="container mx-auto py-16">
      {/* Header Actions */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Profile</h1>
        <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
          <SquarePen className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      {/* Profile Card */}
      <div className="space-y-8 rounded-2xl border bg-card p-8 shadow-sm">
        {/* Avatar + Identity */}
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt={profile.full_name}
              className="h-24 w-24 shrink-0 rounded-full object-cover ring-2 ring-border"
            />
          ) : (
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-muted text-3xl font-bold text-muted-foreground">
              {profile.full_name?.[0]?.toUpperCase() ?? '?'}
            </div>
          )}

          <div className="space-y-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold">{profile.full_name}</h2>
            {profile.job_title && (
              <p className="text-sm font-medium text-muted-foreground">{profile.job_title}</p>
            )}
            {profile.email && (
              <a href={`mailto:${profile.email}`} className="text-sm text-primary hover:underline">
                {profile.email}
              </a>
            )}
          </div>
        </div>

        {/* Divider */}
        <hr className="border-border" />

        {/* Short Bio */}
        {profile.bio && (
          <section>
            <h3 className="mb-3 text-sm font-semibold tracking-wider text-muted-foreground uppercase">
              Bio
            </h3>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <BaseHtmlRenderer>{profile.bio}</BaseHtmlRenderer>
            </div>
          </section>
        )}

        {/* Full Bio */}
        {profile.full_bio && (
          <section>
            <h3 className="mb-3 text-sm font-semibold tracking-wider text-muted-foreground uppercase">
              Full Bio
            </h3>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <BaseHtmlRenderer>{profile.full_bio}</BaseHtmlRenderer>
            </div>
          </section>
        )}

        {/* Divider */}
        {(profile.cv_url || profile.social_links?.length > 0) && <hr className="border-border" />}

        {/* Links Row */}
        <div className="flex flex-wrap items-center gap-4">
          {/* CV */}
          {profile.cv_url && (
            <a
              href={profile.cv_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
            >
              📄 Open CV
            </a>
          )}

          {/* Social Links */}
          {profile.social_links?.map(({ platform, url }, i) => (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium capitalize transition-colors hover:bg-muted"
            >
              🔗 {platform}
            </a>
          ))}
        </div>
      </div>

      {/* Edit Form */}
      <FormProfile
        key={profile?.id || 'edit'}
        open={isOpen}
        onOpenChange={setIsOpen}
        onSubmit={handleSubmit}
        defaultValues={profile}
        isLoading={isLoading}
      />
    </div>
  )
}
