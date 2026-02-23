"use client"

import { Briefcase, LogOut, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { isDemoMode } from "@/lib/api"

interface DashboardHeaderProps {
  onAddClick: () => void
  onLogout: () => void
}

export function DashboardHeader({ onAddClick, onLogout }: DashboardHeaderProps) {
  const demo = isDemoMode()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-4 py-3 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
            <Briefcase className="size-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-foreground">JobTracker</span>
          {demo && (
            <Badge variant="secondary" className="text-xs">
              Demo
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={onAddClick} size="sm" className="gap-1.5">
            <Plus className="size-4" />
            <span className="hidden sm:inline">Add Application</span>
          </Button>
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="size-9 text-muted-foreground hover:text-foreground"
            onClick={onLogout}
          >
            <LogOut className="size-4" />
            <span className="sr-only">Log out</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
