import { Router } from 'express';
import * as vehicleController from './vehicles.controller';
import { authenticateToken, authorizeRole } from '../../middlewares/auth.middleware';

const router = Router();

// Public Routes
router.get('/', vehicleController.getVehicles);
router.get('/:vehicleId', vehicleController.getVehicle);

// Admin Only Routes
router.post('/', authenticateToken, authorizeRole('admin'), vehicleController.addVehicle);
router.put('/:vehicleId', authenticateToken, authorizeRole('admin'), vehicleController.updateVehicle);
router.delete('/:vehicleId', authenticateToken, authorizeRole('admin'), vehicleController.deleteVehicle);

export default router;