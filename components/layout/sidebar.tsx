'use client'

import type { User as UserType } from '@supabase/supabase-js'
import { ChevronsUpDown, LogOutIcon, Settings2Icon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MENU } from '@/constants'
import { useIsMobile } from '@/hooks/use-mobile'
import { createClient } from '@/lib/supabase/client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '../ui/sidebar'

export function LayoutSidebar() {
  const pathname = usePathname()
  const supabase = createClient()
  const isMobile = useIsMobile()
  const [user, setUser] = useState<UserType | null>(null)

  const router = useRouter()
  const { state } = useSidebar()

  const isCollapsed = state === 'collapsed'

  const logout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  function isActivePath(pathname: string, href: string) {
    if (href === '/dashboard') {
      return pathname === href
    }

    return pathname === href || pathname.startsWith(href + '/')
  }

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      setUser(user)
    }

    getUser()
  }, [supabase.auth])
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-9 ${isCollapsed ? 'w-7.75' : 'w-9'} items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground shadow-sm`}
            >
              P
            </div>

            {!isCollapsed && (
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold">Dashboard</span>
                <span className="text-xs text-muted-foreground">v1.0.0</span>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <div className="flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-[10px] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Online
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        {MENU.map((group) => (
          <SidebarGroup key={group.label}>
            {group.label !== 'Main' && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}

            <SidebarMenu>
              {group.items.map((item) => {
                const Icon = item.icon
                const isActive = isActivePath(pathname, item.href)

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton isActive={isActive} onClick={() => router.push(item.href)}>
                      <Icon />
                      {item.title}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full">
                {isCollapsed ? (
                  <Settings2Icon className="w-full" />
                ) : (
                  <div className="flex w-full items-center gap-2 rounded-md p-2 hover:bg-accent">
                    <Avatar className="h-8 w-8 rounded-lg grayscale">
                      <AvatarImage
                        src={user?.user_metadata?.avatar_url}
                        alt={user?.user_metadata?.name}
                      />
                      <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">{user?.user_metadata?.name}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {user?.user_metadata?.email}
                      </span>
                    </div>
                    <ChevronsUpDown />
                  </div>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent side={isMobile ? 'top' : 'right'} align="end" sideOffset={4}>
                <DropdownMenuItem onClick={logout}>
                  <LogOutIcon />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
