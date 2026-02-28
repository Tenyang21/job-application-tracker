import { pool } from "../db";
import { Application, CountResult } from "../types/index";
async function addData(
  userId: number,
  companyName: string,
  dateApplied: string,
  statuses: string,
  incomingPhone: string | null,
  incomingInterview: string | null,
  notes: string,
  position: string,
): Promise<Application> {
  try {
    const result = await pool.query<Application>(
      "INSERT INTO applicationtracker (user_id, company_name, date_applied, statuses, incoming_phone, incoming_interview, notes, position) Values ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *",
      [
        userId,
        companyName,
        dateApplied,
        statuses,
        incomingPhone,
        incomingInterview,
        notes,
        position,
      ],
    );
    // "Returning *" returns the newly created row with all columns.
    return result.rows[0]; //gets the first row
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getData(userId: number): Promise<Application[]> {
  try {
    const result = await pool.query<Application>(
      "SELECT * FROM applicationtracker Where user_id = $1",
      [userId],
    );
    return result.rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getCountReplies(userId: number): Promise<CountResult> {
  // Count(*) returns a property called count auto.
  try {
    const result = await pool.query<CountResult>(
      "SELECT Count(*) From applicationtracker WHERE user_id = $1 AND (statuses = $2 OR statuses = $3 OR statuses = $4)",
      [userId, "phone_screen", "interviewing", "offer"],
    );
    return result.rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async function getCountRows(userId: number): Promise<CountResult> {
  try {
    const result = await pool.query<CountResult>(
      "SELECT Count(*) From applicationtracker Where user_id = $1",
      [userId],
    );
    return result.rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async function getRejections(userId: number): Promise<CountResult> {
  try {
    const result = await pool.query<CountResult>(
      "SELECT Count(*) From applicationtracker Where user_id = $1 AND (statuses = $2)",
      [userId, "rejected"],
    );
    return result.rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async function updateData(
  userId: number,
  id: number,
  companyName: string,
  dateApplied: string,
  statuses: string,
  incomingPhone: string | null,
  incomingInterview: string | null,
  notes: string,
  position: string,
): Promise<Application[]> {
  try {
    const result = await pool.query<Application>(
      "Update applicationtracker SET company_name = $1, date_applied = $2, statuses = $3, incoming_phone = $4, incoming_interview = $5, notes = $6, position = $7 Where user_id = $8 AND application_id = $9",
      [
        companyName,
        dateApplied,
        statuses,
        incomingPhone,
        incomingInterview,
        notes,
        position,
        userId,
        id,
      ],
    );
    return result.rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async function deleteData(userId: number, id: number): Promise<Application[]> {
  try {
    const result = await pool.query<Application>(
      "Delete FROM applicationtracker Where user_id = $1 AND application_id = $2 RETURNING *",
      [userId, id],
    );
    return result.rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async function upcomingEvents(userId: number): Promise<Application[]> {
  try {
    const result = await pool.query<Application>(
      "SELECT * FROM applicationtracker WHERE user_id = $1 AND (incoming_phone >= CURRENT_DATE OR incoming_interview >= CURRENT_DATE)",
      [userId],
    );
    return result.rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export {
  addData,
  getData,
  getCountReplies,
  getCountRows,
  getRejections,
  updateData,
  deleteData,
  upcomingEvents,
};
