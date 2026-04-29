'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Technology } from '@/types'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  icon_url: z.string().url('Must be a valid URL'),
})

type Props = {
  open: boolean
  isLoading: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: { name: string; icon_url: string }) => void
  defaultValues?: Technology | null
}
const DEFAULT_VALUES = {
  name: '',
  icon_url: '',
}

export function FormTechnology({ open, isLoading, onOpenChange, onSubmit, defaultValues }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: DEFAULT_VALUES,
  })

  // populate form when editing

  useEffect(() => {
    const values = open ? (defaultValues ?? DEFAULT_VALUES) : DEFAULT_VALUES

    form.reset(values)

    if (!open) {
      form.clearErrors()
    }
  }, [open, defaultValues, form])

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      name: values.name,
      icon_url: values.icon_url,
    })
    onOpenChange(false)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{defaultValues?.id ? 'Edit Technology' : 'Create Technology'}</DialogTitle>
        </DialogHeader>

        <form id="form-techbology" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Name</FieldLabel>
                  <Input {...field} placeholder="Please input name..." />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="icon_url"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Icon URL</FieldLabel>
                  <Input {...field} placeholder="https://..." />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button form="form-techbology" type="submit" loading={isLoading}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
