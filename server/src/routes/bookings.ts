import express from 'express';
import {
    createBooking,
    getBookingById,
    listBookings,
    updateBookingStatus,
} from '../controllers/bookings.controller';
import { requireAuth } from '../middlewares/auth';

const router = express.Router();

router.post('/', requireAuth, createBooking);
router.get('/', requireAuth, listBookings);
router.get('/:id', requireAuth, getBookingById);
router.put('/:id/status', requireAuth, updateBookingStatus);

export default router;
