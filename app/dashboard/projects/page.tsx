'use client'

import { ColumnDef } from '@tanstack/react-table'
import { SquarePen, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import useSWR from 'swr'
import z from 'zod'

import BaseHtmlRenderer from '@/components/base/base-hmtl-renderer'
import { BaseTable } from '@/components/base/base-table'
import FormProject, { formSchema } from '@/components/form/form-project'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { createClient } from '@/lib/supabase/client'
import { Project } from '@/types'

export default function Page() {
  const supabase = createClient()

  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<Project | null>(null)

  /**
   * SWR FETCHER
   */
  const fetcher = async () => {
    const { data, error } = await supabase.from('projects').select('*').overrideTypes<Project[]>()

    if (error) throw error
    return data ?? []
  }

  const { data = [], mutate, isLoading } = useSWR('projects', fetcher)

  /**
   * HANDLERS
   */
  const handleCreate = () => {
    setSelected(null)
    setIsOpen(true)
  }

  const handleEdit = (tech: Project) => {
    setSelected(tech)
    setIsOpen(true)
  }

  const handleSubmit = async (formData: z.infer<typeof formSchema>) => {
    try {
      if (selected?.id) {
        const { error } = await supabase.from('projects').update(formData).eq('id', selected.id)

        if (error) throw error
        toast.success('Updated successfully')
      } else {
        const { error } = await supabase.from('projects').insert([formData])

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
    if (!confirm('Are you sure?')) return

    const { error } = await supabase.from('projects').delete().eq('id', id)

    if (error) {
      toast.error('Delete failed')
    } else {
      toast.success('Deleted successfully')
      await mutate() // ✅ refresh data
    }
  }

  const handleFeaturedChange = async (isFeatured: boolean, payload: Project): Promise<void> => {
    const { error } = await supabase
      .from('projects')
      .update({ ...payload, is_featured: isFeatured })
      .eq('id', payload.id)

    if (error) {
      toast.error(error.message)
      return
    }

    await mutate() // ✅ refresh data
    toast.success('Updated successfully')
  }
  /**
   * COLUMNS
   */
  const columns: ColumnDef<Project>[] = [
    { header: 'No', cell: ({ row }) => <p>{row.index + 1}</p> },
    { accessorKey: 'title', header: 'Title' },
    {
      accessorKey: 'description',
      header: 'Short Description',
      cell: ({ row }) => (
        <div className="line-clamp-6 w-[20rem] whitespace-normal">{row.original.description}</div>
      ),
    },
    {
      accessorKey: 'content',
      header: 'Content',
      cell: ({ row }) => (
        <div className="line-clamp-6 w-160 whitespace-normal">
          <BaseHtmlRenderer>{row.original.content}</BaseHtmlRenderer>
        </div>
      ),
    },
    {
      accessorKey: 'image_url',
      header: 'Image Url',
      cell: ({ row }) => (
        <a href={row.original.image_url} target="_blank">
          Open Link
        </a>
      ),
    },
    {
      accessorKey: 'demo_url',
      header: 'Demo Url',
      cell: ({ row }) => (
        <a href={row.original.demo_url} target="_blank">
          Open Link
        </a>
      ),
    },
    {
      accessorKey: 'github_url',
      header: 'Github Url',
      cell: ({ row }) => (
        <a href={row.original.github_url} target="_blank">
          Open Link
        </a>
      ),
    },
    {
      accessorKey: 'is_featured',
      header: 'Featured',
      cell: ({ row }) => (
        <Switch
          checked={row.original.is_featured}
          onCheckedChange={(checked) => handleFeaturedChange(checked, row.original)}
        ></Switch>
      ),
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
            onClick={() => handleDelete(row.original.id)}
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
        <h1 className="text-2xl font-bold">Manage Project</h1>
        <Button onClick={handleCreate}>Create</Button>
      </div>

      <BaseTable columns={columns} data={data!} />

      <FormProject
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
