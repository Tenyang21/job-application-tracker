export interface Application {
  application_id: number;
  company_name: string;
  position: string;
  statuses: string;
  date_applied: string;
  incoming_phone: string | null;
  incoming_interview: string | null;
  notes: string;
  user_id: number;
}

export interface User {
  user_id: number;
  email: string;
  password: string;
}

export interface CountResult {
  count: string;
}

export interface UpcomingEvents {
  type: string;
  company_name: string;
  date: string;
  application_id: number;
}

export interface UpdateBody {
  company_name: string;
  date_applied: string;
  statuses: string;
  incoming_phone: string | null;
  incoming_interview: string | null;
  notes: string;
  position: string;
}

export interface AuthBody {
  email: string;
  password: string;
}
