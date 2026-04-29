import type { Metadata } from 'next'

import { LayoutSidebar } from '@/components/layout/sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

export const metadata: Metadata = {
  title: 'My Dashboard',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <LayoutSidebar />
      <SidebarTrigger />

      <main className="h-dvh w-screen overflow-auto pr-7">{children}</main>
    </SidebarProvider>
  )
}
