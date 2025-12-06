-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role VARCHAR(10) CHECK (role IN ('admin', 'customer')) NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Vehicles Table
CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    vehicle_name VARCHAR(100) NOT NULL,
    type VARCHAR(20) CHECK (type IN ('car', 'bike', 'van', 'SUV')) NOT NULL,
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    daily_rent_price DECIMAL(10, 2) CHECK (daily_rent_price > 0) NOT NULL,
    availability_status VARCHAR(20) CHECK (availability_status IN ('available', 'booked')) DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE SET NULL,
    rent_start_date TIMESTAMP NOT NULL,
    rent_end_date TIMESTAMP NOT NULL,
    total_price DECIMAL(10, 2) CHECK (total_price > 0) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('active', 'cancelled', 'returned')) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Constraint: End date must be after start date
    CONSTRAINT check_dates CHECK (rent_end_date > rent_start_date)
);