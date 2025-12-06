import { query } from '../../config/env';

// Helper to calculate days between dates
const calculateDuration = (start: Date, end: Date) => {
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
};

export const createBooking = async (customerId: number, vehicleId: number, startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // 1. Get Vehicle Price & Status
  const vehicleRes = await query('SELECT daily_rent_price, availability_status FROM vehicles WHERE id = $1', [vehicleId]);
  if (vehicleRes.rows.length === 0) throw new Error('Vehicle not found');
  
  const vehicle = vehicleRes.rows[0];
  if (vehicle.availability_status !== 'available') throw new Error('Vehicle is not available');

  // 2. Calculate Total Price
  const duration = calculateDuration(start, end);
  if (duration <= 0) throw new Error('Invalid booking duration');
  
  const totalPrice = duration * parseFloat(vehicle.daily_rent_price);

  // 3. Create Booking & Update Vehicle Status (Ideally in a transaction)
  // Note: For simplicity, we are running sequential queries. In production, use BEGIN/COMMIT.
  
  const bookingSql = `
    INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
    VALUES ($1, $2, $3, $4, $5, 'active')
    RETURNING *
  `;
  const booking = await query(bookingSql, [customerId, vehicleId, startDate, endDate, totalPrice]);
  
  // Update vehicle to 'booked'
  await query("UPDATE vehicles SET availability_status = 'booked' WHERE id = $1", [vehicleId]);

  return booking.rows[0];
};

export const getBookings = async (userId: number, role: string) => {
  let sql = `
    SELECT b.*, v.vehicle_name, v.registration_number, u.name as customer_name 
    FROM bookings b
    JOIN vehicles v ON b.vehicle_id = v.id
    JOIN users u ON b.customer_id = u.id
  `;

  // Customers see only their own bookings; Admins see all
  if (role === 'customer') {
    sql += ` WHERE b.customer_id = $1`;
    const result = await query(sql, [userId]);
    return result.rows;
  } else {
    const result = await query(sql);
    return result.rows;
  }
};

export const updateBookingStatus = async (bookingId: number, status: string) => {
  // If returning, we need to free up the vehicle
  if (status === 'returned') {
    const bookingRes = await query('SELECT vehicle_id FROM bookings WHERE id = $1', [bookingId]);
    if (bookingRes.rows.length > 0) {
       await query("UPDATE vehicles SET availability_status = 'available' WHERE id = $1", [bookingRes.rows[0].vehicle_id]);
    }
  }

  const sql = `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`;
  const result = await query(sql, [status, bookingId]);
  return result.rows[0];
};

export const getBookingById = async (id: number) => {
  const result = await query('SELECT * FROM bookings WHERE id = $1', [id]);
  return result.rows[0];
};