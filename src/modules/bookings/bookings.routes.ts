import { Router } from 'express';
import * as bookingController from './bookings.controller';
import { authenticateToken, authorizeRole } from '../../middlewares/auth.middleware';

const router = Router();

// Create Booking (Customer/Admin)
router.post('/', authenticateToken, bookingController.createBooking);

// View Bookings (Role-based filtering handled in controller)
router.get('/', authenticateToken, bookingController.getBookings);

// Cancel (Customer) or Return (Admin)
router.put('/:bookingId', authenticateToken, bookingController.modifyBooking);

export default router;