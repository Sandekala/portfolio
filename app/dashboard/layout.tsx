import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Dashboard',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <main className="h-dvh w-screen overflow-auto">{children}</main>
}
