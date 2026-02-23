"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Application, ApplicationStatus } from "@/lib/types"

interface ApplicationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  application?: Application | null
  onSubmit: (data: ApplicationFormData) => Promise<void>
}

export interface ApplicationFormData {
  company_name: string
  position: string
  date_applied: string
  statuses: ApplicationStatus
  incoming_phone: string
  incoming_interview: string
  notes: string
}

const statusOptions: { value: ApplicationStatus; label: string }[] = [
  { value: "applied", label: "Applied" },
  { value: "phone_screen", label: "Phone Screen" },
  { value: "interviewing", label: "Interviewing" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
  { value: "withdrawn", label: "Withdrawn" },
]

function toInputDate(val: string | null | undefined): string {
  if (!val) return ""
  try {
    const d = new Date(val)
    return d.toISOString().split("T")[0]
  } catch {
    return ""
  }
}

export function ApplicationModal({ open, onOpenChange, application, onSubmit }: ApplicationModalProps) {
  const isEditing = !!application
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<ApplicationFormData>({
    company_name: "",
    position: "",
    date_applied: new Date().toISOString().split("T")[0],
    statuses: "applied",
    incoming_phone: "",
    incoming_interview: "",
    notes: "",
  })

  useEffect(() => {
    if (application) {
      setForm({
        company_name: application.company_name || "",
        position: application.position || "",
        date_applied: toInputDate(application.date_applied) || new Date().toISOString().split("T")[0],
        statuses: application.statuses || "applied",
        incoming_phone: toInputDate(application.incoming_phone),
        incoming_interview: toInputDate(application.incoming_interview),
        notes: application.notes || "",
      })
    } else {
      setForm({
        company_name: "",
        position: "",
        date_applied: new Date().toISOString().split("T")[0],
        statuses: "applied",
        incoming_phone: "",
        incoming_interview: "",
        notes: "",
      })
    }
  }, [application, open])

  function updateField<K extends keyof ApplicationFormData>(key: K, value: ApplicationFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(form)
      onOpenChange(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {isEditing ? "Edit Application" : "Add Application"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isEditing
              ? "Update the details for this application."
              : "Fill in the details for your new application."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="company_name" className="text-foreground">Company Name</Label>
              <Input
                id="company_name"
                placeholder="e.g. Google"
                value={form.company_name}
                onChange={(e) => updateField("company_name", e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="position" className="text-foreground">
                Position <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <Input
                id="position"
                placeholder="e.g. Software Engineer"
                value={form.position}
                onChange={(e) => updateField("position", e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="date_applied" className="text-foreground">Date Applied</Label>
              <Input
                id="date_applied"
                type="date"
                value={form.date_applied}
                onChange={(e) => updateField("date_applied", e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="statuses" className="text-foreground">Status</Label>
              <Select
                value={form.statuses}
                onValueChange={(val) => updateField("statuses", val as ApplicationStatus)}
              >
                <SelectTrigger id="statuses" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="incoming_phone" className="text-foreground">Phone Screen Date</Label>
              <Input
                id="incoming_phone"
                type="date"
                value={form.incoming_phone}
                onChange={(e) => updateField("incoming_phone", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="incoming_interview" className="text-foreground">Interview Date</Label>
              <Input
                id="incoming_interview"
                type="date"
                value={form.incoming_interview}
                onChange={(e) => updateField("incoming_interview", e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="notes" className="text-foreground">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes about this application..."
              value={form.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {isEditing ? "Saving..." : "Adding..."}
                </>
              ) : isEditing ? (
                "Save changes"
              ) : (
                "Add application"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
