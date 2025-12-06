import { Pool } from "pg";

export const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT ?? 5432),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  ssl: { rejectUnauthorized: false },
});

export async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone VARCHAR(15) NOT NULL,
      role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'customer')),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id SERIAL PRIMARY KEY,
      vehicle_name VARCHAR(150) NOT NULL,
      type VARCHAR(20) NOT NULL CHECK (type IN ('car', 'bike', 'van', 'SUV')),
      registration_number VARCHAR(100) UNIQUE NOT NULL,
      daily_rent_price NUMERIC(12,2) NOT NULL CHECK (daily_rent_price > 0),
      availability_status VARCHAR(20) NOT NULL CHECK (availability_status IN ('available', 'booked')) DEFAULT 'available',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      customer_id INT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
      vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
      rent_start_date DATE NOT NULL,
      rent_end_date DATE NOT NULL,
      total_price NUMERIC(12,2) NOT NULL CHECK (total_price > 0),
      status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'cancelled', 'returned')) DEFAULT 'active',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      CHECK (rent_end_date > rent_start_date)
    );
  `);

  console.log("✅ DB tables ready (users, vehicles, bookings)");
}
