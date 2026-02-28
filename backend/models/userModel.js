const { pool } = require("../db");

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

module.exports = { signup, getUserByEmail };
