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
import { Project } from '@/types'

import BaseEditor from '../base/base-editor'
import { Textarea } from '../ui/textarea'

export const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Short Description is required'),
  content: z.string().min(1, 'Content is required'),
  image_url: z.url('Image Url is required'),
  demo_url: z.url().optional(),
  github_url: z.url('Github Url is required'),
  is_featured: z.boolean(),
})

/**
 * SETUP LOCAL INTERFACE
 */

type Props = {
  open: boolean
  isLoading: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: z.infer<typeof formSchema>) => void
  defaultValues?: Project | null
}

const DEFAULT_VALUES = {
  title: '',
  description: '',
  content: '',
  image_url: '',
  demo_url: '',
  github_url: '',
  is_featured: false,
}

export default function FormProject({
  open,
  isLoading,
  onOpenChange,
  onSubmit,
  defaultValues,
}: Props) {
  /**
   * SETUP HOOKS
   */

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: DEFAULT_VALUES,
  })

  /**
   * SETUP STATE
   */

  /**
   * SETUP COMPUTED
   */

  /**
   * SETUP FUNCTIONS
   */

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values)
    onOpenChange(false)
    form.reset()
  }

  /**
   * SETUP EFFECTS
   */
  useEffect(() => {
    const values = open ? (defaultValues ?? DEFAULT_VALUES) : DEFAULT_VALUES

    form.reset(values)

    if (!open) {
      form.clearErrors()
    }
  }, [open, defaultValues, form])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100vw-20rem)]!">
        <DialogHeader>
          <DialogTitle>{defaultValues?.id ? 'Edit Project' : 'Create Project'}</DialogTitle>
        </DialogHeader>

        <form
          id="form-project"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="no-scrollbar max-h-[calc(100dvh-20rem)] space-y-4 overflow-auto"
        >
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Title</FieldLabel>
                  <Input {...field} placeholder="Please input title..." />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Short Description</FieldLabel>
                  <Textarea {...field} placeholder="Please input short description..." />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="content"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Content</FieldLabel>
                  <BaseEditor model={field.value || ''} onChange={field.onChange} />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="image_url"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Image Url</FieldLabel>
                  <Textarea {...field} placeholder="Please input image url..." />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="demo_url"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Demo Url</FieldLabel>
                  <Textarea {...field} placeholder="Please input demo url..." />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="github_url"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Github Url</FieldLabel>
                  <Textarea {...field} placeholder="Please input github url..." />
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
          <Button form="form-project" type="submit" loading={isLoading}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
