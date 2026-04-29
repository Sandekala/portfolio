'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { TrashIcon } from 'lucide-react'
import { useEffect } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Profile } from '@/types'

import BaseEditor from '../base/base-editor'

export const formSchema = z.object({
  full_name: z.string().min(1, 'Full Name is required'),
  job_title: z.string().min(1, 'Job Title is required'),
  bio: z.string().min(1, 'Bio is required'),
  full_bio: z.string().min(1, 'Full Bio is required'),
  cv_url: z.url('CV Url is required'),
  email: z.email('Email is required'),
  avatar_url: z.url('Avatar is required'),
  social_links: z.array(
    z.object({
      url: z.url('Url is required'),
      icon: z.string().min(1, 'Icon is required'),
      platform: z.string().min(1, 'Platform is required'),
    }),
  ),
})

/**
 * SETUP LOCAL INTERFACE
 */

type Props = {
  open: boolean
  isLoading: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: z.infer<typeof formSchema>) => void
  defaultValues?: Profile | null
}

const DEFAULT_VALUES = {
  full_name: '',
  job_title: '',
  bio: '',
  full_bio: '',
  cv_url: '',
  email: '',
  avatar_url: '',
  social_links: [
    {
      url: '',
      icon: '',
      platform: '',
    },
  ],
}

export default function FormProfile({
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
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'social_links',
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
          <DialogTitle>{defaultValues?.id ? 'Edit Profile' : 'Create Profile'}</DialogTitle>
        </DialogHeader>

        <form
          id="form-profile"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="no-scrollbar max-h-[calc(100dvh-20rem)] space-y-4 overflow-auto"
        >
          <FieldGroup>
            <Controller
              name="full_name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Name</FieldLabel>
                  <Input {...field} placeholder="John Doe" />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Email</FieldLabel>
                  <Input type="email" {...field} placeholder="johndoe@mail.com" />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="job_title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Job Title</FieldLabel>
                  <Input {...field} placeholder="Software Engineer" />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="bio"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Bio</FieldLabel>
                  <BaseEditor model={field.value || ''} onChange={field.onChange} />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="full_bio"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Full Bio</FieldLabel>
                  <BaseEditor model={field.value || ''} onChange={field.onChange} />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="cv_url"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>CV Url</FieldLabel>
                  <Input {...field} placeholder="Please input CV Url..." />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="avatar_url"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Avatar Url</FieldLabel>
                  <Input {...field} placeholder="Please input CV Url..." />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <FieldSet>
              <FieldLegend variant="label">Link Media Social</FieldLegend>
              <FieldDescription>Add up to 5 links of your social media.</FieldDescription>

              {fields.map((field, index) => (
                <FieldGroup key={field.id} className="gap-4">
                  <Controller
                    name={`social_links.${index}.url`}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Url</FieldLabel>
                        <Input {...field} placeholder="Please input Url..." />
                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                  <Controller
                    name={`social_links.${index}.icon`}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Icon</FieldLabel>
                        <Input {...field} placeholder="Please input Icon..." />
                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                  <Controller
                    name={`social_links.${index}.platform`}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Platform</FieldLabel>
                        <Input {...field} placeholder="Please input Platform..." />
                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  {fields.length > 1 && (
                    <Button
                      type="button"
                      className="ml-auto"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      <TrashIcon color="#fb2c36" />
                    </Button>
                  )}
                  <FieldSeparator />
                </FieldGroup>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ url: '', icon: '', platform: '' })}
                disabled={fields.length >= 5}
              >
                Add Social Link
              </Button>
            </FieldSet>
          </FieldGroup>
        </form>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button form="form-profile" type="submit" loading={isLoading}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
