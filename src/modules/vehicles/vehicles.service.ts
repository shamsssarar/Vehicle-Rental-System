import { query } from '../../config/env';

export const createVehicle = async (data: any) => {
  const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = data;
  const sql = `
    INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const result = await query(sql, [vehicle_name, type, registration_number, daily_rent_price, availability_status]);
  return result.rows[0];
};

export const getAllVehicles = async () => {
  const sql = `SELECT * FROM vehicles ORDER BY created_at DESC`;
  const result = await query(sql);
  return result.rows;
};

export const getVehicleById = async (id: number) => {
  const sql = `SELECT * FROM vehicles WHERE id = $1`;
  const result = await query(sql, [id]);
  return result.rows[0];
};

export const updateVehicle = async (id: number, data: any) => {
  const { vehicle_name, type, daily_rent_price, availability_status } = data;
  // Note: We typically don't update registration_number as it's a unique identifier
  const sql = `
    UPDATE vehicles 
    SET vehicle_name = $1, type = $2, daily_rent_price = $3, availability_status = $4
    WHERE id = $5
    RETURNING *
  `;
  const result = await query(sql, [vehicle_name, type, daily_rent_price, availability_status, id]);
  return result.rows[0];
};

export const checkActiveBookings = async (vehicleId: number) => {
  const sql = `SELECT COUNT(*) FROM bookings WHERE vehicle_id = $1 AND status = 'active'`;
  const result = await query(sql, [vehicleId]);
  return parseInt(result.rows[0].count) > 0;
};

export const deleteVehicle = async (id: number) => {
  const sql = `DELETE FROM vehicles WHERE id = $1 RETURNING id`;
  const result = await query(sql, [id]);
  return result.rowCount && result.rowCount > 0;
};