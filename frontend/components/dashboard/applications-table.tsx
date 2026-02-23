"use client"

import { format } from "date-fns"
import { Edit2, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { Application, ApplicationStatus } from "@/lib/types"

interface ApplicationsTableProps {
  applications: Application[]
  onEdit: (app: Application) => void
  onDelete: (id: string) => void
}

const statusConfig: Record<ApplicationStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  applied: { label: "Applied", variant: "secondary" },
  phone_screen: { label: "Phone Screen", variant: "outline" },
  interviewing: { label: "Interviewing", variant: "default" },
  offer: { label: "Offer", variant: "default" },
  rejected: { label: "Rejected", variant: "destructive" },
  withdrawn: { label: "Withdrawn", variant: "secondary" },
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-"
  try {
    return format(new Date(dateStr), "MMM d, yyyy")
  } catch {
    return dateStr
  }
}

export function ApplicationsTable({ applications, onEdit, onDelete }: ApplicationsTableProps) {
  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
        <p className="text-lg font-medium text-foreground">No applications found</p>
        <p className="text-sm text-muted-foreground">Add your first application to get started</p>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="overflow-hidden rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold">Company</TableHead>
              <TableHead className="font-semibold">Position</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Applied</TableHead>
              <TableHead className="font-semibold">Phone</TableHead>
              <TableHead className="font-semibold">Interview</TableHead>
              <TableHead className="hidden font-semibold lg:table-cell">Notes</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => {
              const config = statusConfig[app.statuses] || statusConfig.applied
              return (
                <TableRow key={app._id}>
                  <TableCell className="font-medium text-foreground">
                    {app.company_name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{app.position}</TableCell>
                  <TableCell>
                    <StatusBadge status={app.statuses} config={config} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(app.date_applied)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(app.incoming_phone)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(app.incoming_interview)}
                  </TableCell>
                  <TableCell className="hidden max-w-[200px] truncate text-muted-foreground lg:table-cell">
                    {app.notes || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-muted-foreground hover:text-foreground"
                            onClick={() => onEdit(app)}
                          >
                            <Edit2 className="size-4" />
                            <span className="sr-only">Edit application</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-muted-foreground hover:text-destructive"
                            onClick={() => onDelete(app._id)}
                          >
                            <Trash2 className="size-4" />
                            <span className="sr-only">Delete application</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  )
}

function StatusBadge({
  status,
  config,
}: {
  status: ApplicationStatus
  config: { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
}) {
  const colorMap: Record<ApplicationStatus, string> = {
    applied: "bg-secondary text-secondary-foreground",
    phone_screen: "border-primary/30 text-primary bg-primary/10",
    interviewing: "bg-primary text-primary-foreground",
    offer: "bg-success text-success-foreground",
    rejected: "bg-destructive/10 text-destructive",
    withdrawn: "bg-muted text-muted-foreground",
  }

  return (
    <Badge variant={config.variant} className={colorMap[status]}>
      {config.label}
    </Badge>
  )
}
