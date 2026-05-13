"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Box,
  Cpu,
  Database,
  Terminal,
  Zap,
  Bot
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Box, label: "Architect", href: "/architect" },
  { icon: Cpu, label: "AI Generator", href: "/generator" },
  { icon: Database, label: "Vault", href: "/vault" },
  { icon: Terminal, label: "Telemetry", href: "/logs" },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r border-border bg-card">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
            <Bot size={24} />
          </div>
          <div>
            <h1 className="font-headline text-lg font-bold leading-tight">ZAk</h1>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-secondary">Version 2.0</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-6 text-muted-foreground uppercase tracking-widest">Main Systems</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-4">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    className={`staccato-transition h-11 px-4 ${
                      pathname === item.href 
                        ? "bg-primary/10 text-primary" 
                        : "hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="rounded-xl bg-muted/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={14} className="text-secondary" />
            <span className="text-xs font-bold uppercase tracking-wider text-secondary">ADB Active</span>
          </div>
          <p className="text-[10px] text-muted-foreground mb-3">ADB Bridge connected to SM-G998B</p>
          <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
            <div className="h-full w-4/5 bg-secondary animate-pulse" />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
