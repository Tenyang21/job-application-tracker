"use client"

import { Briefcase, TrendingUp, XCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { HomeStats } from "@/lib/types"

interface StatsCardsProps {
  stats: HomeStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: "Total Applications",
      value: stats.totalApplications,
      icon: Briefcase,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Reply Rate",
      value: `${stats.replyRate}%`,
      icon: TrendingUp,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "Rejections",
      value: stats.rejections,
      icon: XCircle,
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.label} className="border-border">
          <CardContent className="flex items-center gap-4 pt-0">
            <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${card.bg}`}>
              <card.icon className={`size-6 ${card.color}`} />
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <p className="text-2xl font-bold text-foreground">{card.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
