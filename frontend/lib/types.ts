export type ApplicationStatus =
  | "applied"
  | "phone_screen"
  | "interviewing"
  | "offer"
  | "rejected"
  | "withdrawn"

export interface Application {
  _id: string
  company_name: string
  position: string
  statuses: ApplicationStatus
  date_applied: string
  incoming_phone: string | null
  incoming_interview: string | null
  notes: string
}

export interface HomeStats {
  totalApplications: number
  replyRate: number
  rejections: number
}

export interface HomeData {
  stats: HomeStats
  applications: Application[]
}

export interface UpcomingEvent {
  _id: string
  company_name: string
  position: string
  type: "phone" | "interview"
  date: string
}
