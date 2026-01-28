require("dotenv").config();
const { Pool } = require("pg");
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || '',
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
  notes
) {
  try {
    const result = await pool.query(
      "INSERT INTO ApplicationTracker (user_id, company_name, date_applied, statuses, incoming_phone, incoming_interview, notes) Values ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
      [
        userId,
        companyName,
        dateApplied,
        statuses,
        incomingPhone,
        incomingInterview,
        notes
      ]
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
      "SELECT * FROM ApplicationTracker Where user_id = ?" [userId],
    );
    return result.rows;
  } catch (error) {
    console.log(error);
  }
}

async function getCountReplies(userId) {
  try {
    const result = await pool.query(
      'SELECT Count(*) From ApplicationTracker WHERE user_id = ? AND statuses = "rejected" or statuses = "ongoing" or statuses = "offer"'[
        userId
      ],
    );
    return result.rows[0];
  } catch (error) {
    console.log(error);
  } 
}
async function getCountRows(userId) {
  try {
    const result = await pool.query(
      "SELECT Count(*) From ApplicationTracker Where user_id = ?"[userId],
    );
    return result.rows[0];
  } catch (error) {
    console.log(error);
  } 
}
async function getRejections(userId) {
  try {
    const result = await pool.query(
      'SELECT Count(*) From ApplicationTracker Where user_id = ? AND statuses = "rejected"'[
        userId
      ],
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
      "Update ApplicationTracker SET company_name = ?, date_applied = ?, statuses = ?, incoming_phone = ?, incoming_interview = ?, notes = ? Where user_id = ? AND application_id = ?"
      [
        companyName,
        dateApplied,
        statuses,
        incomingPhone,
        incomingInterview,
        notes,
        userId,
        id
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
      "Delete FROM ApplicationTracker Where user_id = ? AND application_id = ?"[
        userId, id
      ],
    );
    return result.rows;
  } catch (error) {
    console.log(error);
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
};
