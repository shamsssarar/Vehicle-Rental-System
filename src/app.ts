import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './modules/auth/auth.routes';
import vehicleRoutes from './modules/vehicles/vehicles.routes';
import bookingRoutes from './modules/bookings/bookings.routes';
import userRoutes from './modules/users/users.routes';

dotenv.config();

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Parse JSON bodies

//Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/vehicles', vehicleRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/users', userRoutes);

// Test Route
app.get('/', (req: Request, res: Response) => {
  res.send({ message: 'Vehicle Rental System API is running' });
});

export default app;