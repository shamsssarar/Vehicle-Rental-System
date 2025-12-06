import { Request, Response } from 'express';
import * as vehicleService from './vehicles.service';
import { sendResponse, sendError } from '../../utils/response';

export const addVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { vehicle_name, type, registration_number, daily_rent_price } = req.body;
    
    // Basic Validation
    if (!vehicle_name || !type || !registration_number || !daily_rent_price) {
      return sendError(res, 400, 'All fields are required');
    }

    const newVehicle = await vehicleService.createVehicle({
      ...req.body,
      availability_status: 'available' 
    });
    
    sendResponse(res, 201, true, 'Vehicle created successfully', newVehicle);
  } catch (error: any) {
    if (error.code === '23505') { 
        return sendError(res, 400, 'Registration number already exists');
    }
    sendError(res, 500, 'Internal server error', error.message);
  }
};

export const getVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await vehicleService.getAllVehicles();
    
    if (!vehicles || vehicles.length === 0) {
        return sendResponse(res, 200, true, 'No vehicles found', []);
    }
    
    sendResponse(res, 200, true, 'Vehicles retrieved successfully', vehicles);
  } catch (error: any) {
    sendError(res, 500, 'Internal server error', error.message);
  }
};

export const getVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.vehicleId!);
    const vehicle = await vehicleService.getVehicleById(id);
    
    if (!vehicle) {
      return sendError(res, 404, 'Vehicle not found');
    }
    sendResponse(res, 200, true, 'Vehicle retrieved successfully', vehicle);
  } catch (error: any) {
    sendError(res, 500, 'Internal server error', error.message);
  }
};

export const updateVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.vehicleId!);
    
    // Check if vehicle exists first
    const existingVehicle = await vehicleService.getVehicleById(id);
    if (!existingVehicle) {
      return sendError(res, 404, 'Vehicle not found');
    }

    const updatedVehicle = await vehicleService.updateVehicle(id, req.body);
    sendResponse(res, 200, true, 'Vehicle updated successfully', updatedVehicle);
  } catch (error: any) {
    sendError(res, 500, 'Internal server error', error.message);
  }
};

export const deleteVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.vehicleId!);

    const hasActiveBookings = await vehicleService.checkActiveBookings(id);
    if (hasActiveBookings) {
      return sendError(res, 400, 'Cannot delete vehicle with active bookings');
    }

    const success = await vehicleService.deleteVehicle(id);
    if (!success) {
      return sendError(res, 404, 'Vehicle not found');
    }

    sendResponse(res, 200, true, 'Vehicle deleted successfully');
  } catch (error: any) {
    sendError(res, 500, 'Internal server error', error.message);
  }
};