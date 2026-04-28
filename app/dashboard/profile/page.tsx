'use client'

import { ColumnDef } from '@tanstack/react-table'
import { SquarePen, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import useSWR from 'swr'
import z from 'zod'

import { BaseDialogDelete } from '@/components/base/base-dialog-delete'
import { BaseTable } from '@/components/base/base-table'
import FormProfile, { formSchema } from '@/components/form/form-profile'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/types'

export default function Page() {
  const supabase = createClient()

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const [selected, setSelected] = useState<Profile | null>(null)
  const [deleteId, setDeleteId] = useState<string>('')

  /**
   * SWR FETCHER
   */
  const fetcher = async () => {
    const { data, error } = await supabase.from('profiles').select('*').overrideTypes<Profile[]>()

    if (error) throw error
    return data ?? []
  }

  const { data = [], mutate, isLoading } = useSWR('profiles', fetcher)

  /**
   * HANDLERS
   */
  const handleCreate = () => {
    setSelected(null)
    setIsOpen(true)
  }

  const handleEdit = (tech: Profile) => {
    setSelected(tech)
    setIsOpen(true)
  }

  const handleSubmit = async (formData: z.infer<typeof formSchema>) => {
    try {
      if (selected?.id) {
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
          .eq('id', selected.id)

        if (error) throw error
        toast.success('Updated successfully')
      } else {
        const { error } = await supabase.from('profiles').insert([formData])

        if (error) throw error
        toast.success('Created successfully')
      }

      setIsOpen(false)
      await mutate() // ✅ refresh data
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleDelete = async (id: string) => {
    setIsDeleting(true)
    const { error } = await supabase.from('profiles').delete().eq('id', id)

    if (error) {
      toast.error('Delete failed')
    } else {
      toast.success('Deleted successfully')
      await mutate() // ✅ refresh data
    }
    setIsDeleting(false)
  }

  /**
   * COLUMNS
   */
  const columns: ColumnDef<Profile>[] = [
    { accessorKey: 'full_name', header: 'Full Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'job_title', header: 'Job Title' },
    {
      accessorKey: 'avatar_url',
      header: 'Avatar',
      cell: ({ row }) => (
        <a href={row.original.avatar_url} target="_blank">
          Link
        </a>
      ),
    },
    {
      accessorKey: 'cv_url',
      header: 'CV URL',
      cell: ({ row }) => (
        <a href={row.original.cv_url} target="_blank">
          Link
        </a>
      ),
    },
    {
      accessorKey: 'social_links',
      header: 'Social Links',
      cell: ({ row }) => (
        <ul className="list-disc space-y-1">
          {row.original.social_links.map(({ platform, url }, i) => (
            <li key={i}>
              <a href={url} target="_blank">
                {platform}
              </a>
            </li>
          ))}
        </ul>
      ),
    },
    {
      accessorKey: 'bio',
      header: 'Bio',
      cell: ({ row }) => <p className="w-[40rem] whitespace-normal">{row.original.bio}</p>,
    },
    {
      accessorKey: 'full_bio',
      header: 'Full Bio',
      cell: ({ row }) => <p className="w-[40rem] whitespace-normal">{row.original.full_bio}</p>,
    },
    {
      id: 'action',
      header: 'Action',
      size: 40,
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(row.original)}>
            <SquarePen className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive"
            onClick={() => setDeleteId(row.original.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  /**
   * RENDER
   */
  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Profile</h1>
        <Button onClick={handleCreate}>Create</Button>
      </div>

      <BaseTable columns={columns} data={data!} />

      <BaseDialogDelete
        open={!!deleteId}
        isLoading={isDeleting}
        onOpenChange={(open) => !open && setDeleteId('')}
        onConfirm={async () => {
          if (!deleteId) return
          await handleDelete(deleteId)
          setDeleteId('')
        }}
      />

      <FormProfile
        key={selected?.id || 'new'}
        open={isOpen}
        onOpenChange={setIsOpen}
        onSubmit={handleSubmit}
        defaultValues={selected}
        isLoading={isLoading}
      />
    </div>
  )
}
