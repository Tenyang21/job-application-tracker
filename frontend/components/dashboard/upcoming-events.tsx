"use client"

import { format, isToday, isTomorrow } from "date-fns"
import { CalendarDays, Phone } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { UpcomingEvent } from "@/lib/types"

interface UpcomingEventsProps {
  events: UpcomingEvent[]
}

function formatEventDate(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    if (isToday(date)) return "Today"
    if (isTomorrow(date)) return "Tomorrow"
    return format(date, "MMM d, yyyy")
  } catch {
    return dateStr
  }
}

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  if (events.length === 0) {
    return (
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8">
            <CalendarDays className="size-10 text-muted-foreground/40" />
            <p className="mt-3 text-sm text-muted-foreground">No upcoming events</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {events.map((event) => (
            <div
              key={`${event._id}-${event.type}`}
              className="flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
            >
              <div
                className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
                  event.type === "phone"
                    ? "bg-warning/10 text-warning"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {event.type === "phone" ? (
                  <Phone className="size-5" />
                ) : (
                  <CalendarDays className="size-5" />
                )}
              </div>
              <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
                <p className="truncate font-medium text-foreground">{event.company_name}</p>
                <p className="truncate text-sm text-muted-foreground">{event.position}</p>
              </div>
              <div className="flex flex-col items-end gap-0.5">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {event.type === "phone" ? "Phone Screen" : "Interview"}
                </span>
                <span className="text-sm font-medium text-foreground">
                  {formatEventDate(event.date)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
