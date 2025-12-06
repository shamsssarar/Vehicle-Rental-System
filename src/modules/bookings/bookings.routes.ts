import { Router } from 'express';
import * as bookingController from './bookings.controller';
import { authenticateToken, authorizeRole } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/', authenticateToken, bookingController.createBooking);

router.get('/', authenticateToken, bookingController.getBookings);

router.put('/:bookingId', authenticateToken, bookingController.modifyBooking);

export default router;