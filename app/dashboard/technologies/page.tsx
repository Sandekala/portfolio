/* eslint-disable @next/next/no-img-element */
'use client'

import { ColumnDef } from '@tanstack/react-table'
import { SquarePen, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import useSWR from 'swr'

import { BaseDialogDelete } from '@/components/base/base-dialog-delete'
import { BaseTable } from '@/components/base/base-table'
import { FormTechnology } from '@/components/form/form-technology'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { Technology } from '@/types'

export default function Page() {
  const supabase = createClient()

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const [selected, setSelected] = useState<Technology | null>(null)
  const [deleteId, setDeleteId] = useState<string>('')

  /**
   * SWR FETCHER
   */
  const fetcher = async () => {
    const { data, error } = await supabase
      .from('technologies')
      .select('*')
      .overrideTypes<Technology[]>()

    if (error) throw error
    return data ?? []
  }

  const { data = [], mutate, isLoading } = useSWR('technologies', fetcher)

  /**
   * HANDLERS
   */
  const handleCreate = () => {
    setSelected(null)
    setIsOpen(true)
  }

  const handleEdit = (tech: Technology) => {
    setSelected(tech)
    setIsOpen(true)
  }

  const handleSubmit = async (formData: { name: string; icon_url: string }) => {
    try {
      if (selected?.id) {
        const { error } = await supabase
          .from('technologies')
          .update({
            name: formData.name,
            icon_url: formData.icon_url,
          })
          .eq('id', selected.id)

        if (error) throw error
        toast.success('Updated successfully')
      } else {
        const { error } = await supabase.from('technologies').insert([formData])

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
    const { error } = await supabase.from('technologies').delete().eq('id', id)

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
  const columns: ColumnDef<Technology>[] = [
    { accessorKey: 'name', header: 'Name' },
    {
      accessorKey: 'icon_url',
      header: 'Icon URL',
      cell: ({ row }) => {
        const iconUrl = row.getValue<string>('icon_url')

        return (
          <div>
            <img src={iconUrl} alt={row.getValue('name')} width={24} height={24} />
          </div>
        )
      },
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
        <h1 className="text-2xl font-bold">Manage Technology</h1>
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

      <FormTechnology
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
