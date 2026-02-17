require("dotenv").config();
const { Pool } = require("pg");
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

async function addData(
  userId,
  companyName,
  dateApplied,
  statuses,
  incomingPhone,
  incomingInterview,
  notes,
) {
  try {
    const result = await pool.query(
      "INSERT INTO applicationtracker (user_id, company_name, date_applied, statuses, incoming_phone, incoming_interview, notes) Values ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
      [
        userId,
        companyName,
        dateApplied,
        statuses,
        incomingPhone,
        incomingInterview,
        notes,
      ],
    );
    // "Returning *" returns the newly created row with all columns.
    return result.rows[0]; //gets the first row
  } catch (error) {
    console.log(error);
  }
}

async function getData(userId) {
  try {
    const result = await pool.query(
      "SELECT * FROM applicationtracker Where user_id = $1",
      [userId],
    );
    return result.rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getCountReplies(userId) {
  try {
    const result = await pool.query(
      "SELECT Count(*) From applicationtracker WHERE user_id = $1 AND (statuses = $2 OR statuses = $3 OR statuses = $4)",
      [userId, "rejected", "ongoing", "offer"],
    );
    return result.rows[0];
  } catch (error) {
    console.log(error);
  }
}
async function getCountRows(userId) {
  try {
    const result = await pool.query(
      "SELECT Count(*) From applicationtracker Where user_id = $1",
      [userId],
    );
    return result.rows[0];
  } catch (error) {
    console.log(error);
  }
}
async function getRejections(userId) {
  try {
    const result = await pool.query(
      "SELECT Count(*) From applicationtracker Where user_id = $1 AND (statuses = $2)",
      [userId, "rejected"],
    );
    return result.rows[0];
  } catch (error) {
    console.log(error);
  }
}
async function updateData(
  userId,
  id,
  companyName,
  dateApplied,
  statuses,
  incomingPhone,
  incomingInterview,
  notes,
) {
  try {
    const result = await pool.query(
      "Update applicationtracker SET company_name = $1, date_applied = $2, statuses = $3, incoming_phone = $4, incoming_interview = $5, notes = $6 Where user_id = $7 AND application_id = $8",
      [
        companyName,
        dateApplied,
        statuses,
        incomingPhone,
        incomingInterview,
        notes,
        userId,
        id,
      ],
    );
    return result.rows;
  } catch (error) {
    console.log(error);
  }
}
async function deleteData(userId, id) {
  try {
    const result = await pool.query(
      "Delete FROM applicationtracker Where user_id = $1 AND application_id = $2 RETURNING *",
      [userId, id],
    );
    return result.rows;
  } catch (error) {
    console.log(error);
  }
}
async function upcomingEvents(userId) {
  try {
    const result = await pool.query(
      "SELECT * FROM applicationtracker WHERE user_id = $1 AND (incoming_phone >= CURRENT_DATE OR incoming_interview >= CURRENT_DATE)",
      [userId],
    );
    return result.rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async function signup(email, hash) {
  try {
    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
      [email, hash],
    );
    return result.rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async function getUserData(email) {
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async function getUserByEmail(email) {
  try {
    const result = await pool.query("SELECT * FROM users where email = $1", [
      email,
    ]);
    return result.rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports = {
  addData,
  getData,
  getCountReplies,
  getCountRows,
  getRejections,
  updateData,
  deleteData,
  upcomingEvents,
  signup,
  getUserData,
  getUserByEmail,
};
