import { Request, Response } from 'express';
import * as bookingService from './bookings.service';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { sendResponse, sendError } from '../../utils/response';

export const createBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { vehicleId, rent_start_date, rent_end_date } = req.body;
    const customerId = req.user!.id; 

    // Date Validation
    if (new Date(rent_start_date) >= new Date(rent_end_date)) {
      return sendError(res, 400, 'Rent end date must be after start date');
    }

    const booking = await bookingService.createBooking(customerId, vehicleId, rent_start_date, rent_end_date);
    
    
    sendResponse(res, 201, true, 'Booking created successfully', booking);
  } catch (error: any) {
    sendError(res, 400, error.message || 'Error creating booking');
  }
};

export const getBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const role = req.user!.role;
    const bookings = await bookingService.getBookings(req.user!.id, role);
    
    const message = role === 'customer' 
        ? 'Your bookings retrieved successfully' 
        : 'Bookings retrieved successfully';

    sendResponse(res, 200, true, message, bookings);
  } catch (error: any) {
    sendError(res, 500, 'Internal server error', error.message);
  }
};

export const modifyBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const bookingId = parseInt(req.params.bookingId!);
    const { status } = req.body; 
    const userRole = req.user!.role;
    const userId = req.user!.id;

    const booking = await bookingService.getBookingById(bookingId);
    if (!booking) {
      return sendError(res, 404, 'Booking not found');
    }

    // Logic Checks
    if (userRole === 'customer') {
      if (booking.customer_id !== userId) return sendError(res, 403, 'Access denied');
      if (status !== 'cancelled') return sendError(res, 400, 'Customers can only cancel bookings');
      if (new Date(booking.rent_start_date) < new Date()) return sendError(res, 400, 'Cannot cancel started/past bookings');
    }

    const updatedBooking = await bookingService.updateBookingStatus(bookingId, status);
    
    const message = status === 'returned' 
        ? 'Booking marked as returned. Vehicle is now available' 
        : 'Booking cancelled successfully';

    sendResponse(res, 200, true, message, updatedBooking);

  } catch (error: any) {
    sendError(res, 500, 'Internal server error', error.message);
  }
};