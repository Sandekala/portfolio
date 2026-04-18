'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'

const formSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export default function Page() {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const router = useRouter()

  async function onSubmit(value: z.infer<typeof formSchema>) {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: value.email,
      password: value.password,
    })

    if (error) {
      toast.warning(error.message, { position: 'top-center' })
      setLoading(false)
      return
    }
    setLoading(false)
    toast.success('Logged in successfully!', { position: 'top-center' })

    form.reset()
    router.refresh()
  }

  return (
    <section className="flex h-full w-full items-center justify-center">
      <Card className="h-fit w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>Welcome!</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>

        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Email</FieldLabel>
                    <Input
                      {...field}
                      placeholder="johndoe@example.com"
                      autoComplete="email"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Password</FieldLabel>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Password"
                      autoComplete="current-password"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
          </CardContent>

          <CardFooter>
            <div className="flex w-full flex-col gap-4">
              <Button type="submit" loading={loading} className="w-full">
                Login
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </section>
  )
}
