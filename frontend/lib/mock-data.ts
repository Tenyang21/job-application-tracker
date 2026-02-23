import type { Application, HomeData, UpcomingEvent } from "./types"

export const mockApplications: Application[] = [
  {
    _id: "1",
    company_name: "Google",
    position: "Senior Frontend Engineer",
    statuses: "interviewing",
    date_applied: "2026-02-10",
    incoming_phone: null,
    incoming_interview: "2026-02-25",
    notes: "Second round scheduled with engineering manager",
  },
  {
    _id: "2",
    company_name: "Stripe",
    position: "Full Stack Developer",
    statuses: "phone_screen",
    date_applied: "2026-02-12",
    incoming_phone: "2026-02-24",
    incoming_interview: null,
    notes: "Recruiter call went well",
  },
  {
    _id: "3",
    company_name: "Vercel",
    position: "Software Engineer",
    statuses: "applied",
    date_applied: "2026-02-18",
    incoming_phone: null,
    incoming_interview: null,
    notes: "Applied through website",
  },
  {
    _id: "4",
    company_name: "Netflix",
    position: "UI Engineer",
    statuses: "offer",
    date_applied: "2026-01-20",
    incoming_phone: null,
    incoming_interview: null,
    notes: "Offer received - $185k base + equity",
  },
  {
    _id: "5",
    company_name: "Meta",
    position: "React Engineer",
    statuses: "rejected",
    date_applied: "2026-01-15",
    incoming_phone: null,
    incoming_interview: null,
    notes: "Rejected after final round",
  },
  {
    _id: "6",
    company_name: "Shopify",
    position: "Frontend Developer",
    statuses: "withdrawn",
    date_applied: "2026-01-28",
    incoming_phone: null,
    incoming_interview: null,
    notes: "Withdrew after accepting another offer",
  },
  {
    _id: "7",
    company_name: "Airbnb",
    position: "Product Engineer",
    statuses: "applied",
    date_applied: "2026-02-20",
    incoming_phone: null,
    incoming_interview: null,
    notes: "",
  },
]

export const mockHomeData: HomeData = {
  stats: {
    totalApplications: mockApplications.length,
    replyRate: 57,
    rejections: 1,
  },
  applications: mockApplications,
}

export const mockUpcomingEvents: UpcomingEvent[] = [
  {
    _id: "2",
    company_name: "Stripe",
    position: "Full Stack Developer",
    type: "phone",
    date: "2026-02-24",
  },
  {
    _id: "1",
    company_name: "Google",
    position: "Senior Frontend Engineer",
    type: "interview",
    date: "2026-02-25",
  },
]
