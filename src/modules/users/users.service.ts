import { query } from '../../config/env';

export const getAllUsers = async () => {
  const result = await query('SELECT id, name, email, phone, role, created_at FROM users');
  return result.rows;
};

export const getUserById = async (id: number) => {
  const result = await query('SELECT id, name, email, phone, role FROM users WHERE id = $1', [id]);
  return result.rows[0];
};

export const updateUser = async (id: number, data: any) => {
  const { name, email, phone, role } = data;
  const sql = `
    UPDATE users SET name = $1, email = $2, phone = $3, role = $4
    WHERE id = $5 RETURNING id, name, email, phone, role
  `;
  const result = await query(sql, [name, email, phone, role, id]);
  return result.rows[0];
};

export const deleteUser = async (id: number) => {
  const sql = 'DELETE FROM users WHERE id = $1';
  await query(sql, [id]);
};