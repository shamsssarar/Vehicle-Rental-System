import { query } from '../../config/env';

export const createUser = async (name: string, email: string, passwordHash: string, phone: string, role: string) => {
  const sql = `
    INSERT INTO users (name, email, password, phone, role)
    VALUES ($1, LOWER($2), $3, $4, $5)
    RETURNING id, name, email, phone, role
  `;
  const result = await query(sql, [name, email, passwordHash, phone, role]);
  return result.rows[0];
};

export const findUserByEmail = async (email: string) => {
  const sql = `SELECT * FROM users WHERE email = LOWER($1)`;
  const result = await query(sql, [email]);
  return result.rows[0];
};