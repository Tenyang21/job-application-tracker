import { pool } from "../db";
import { User } from "../types";

async function signup(email: string, hash: string): Promise<User>{
  try {
    const result = await pool.query<User>(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
      [email, hash],
    );
    return result.rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getUserByEmail(email: string): Promise<User>{
  try {
    const result = await pool.query<User>("SELECT * FROM users where email = $1", [
      email,
    ]);
    return result.rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export {signup, getUserByEmail };
