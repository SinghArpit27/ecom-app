import express from 'express';
import { authenticateToken } from '../../../middleware/jwtAuthorization.js';
import { addMoneyController, addVehicleController, buyVehicleController, buyVehicleWithEMI, checkWalletBalance, createWalletController, getAllVehicleController } from '../controller/userEcomController.js';
import { expressValidationResult } from '../../../helper/validationError.js';
import { amountValidation } from '../../../middleware/ecomValidation.js';
import upload from '../../../middleware/imageUpload.js';

const route = express.Router();

route.use(authenticateToken);

// Route Definition

// Activate Wallet Route
route.post('/activate-wallet', createWalletController);

// Add Money into Wallet
route.post('/add-money', amountValidation, expressValidationResult, addMoneyController);

// Check Wallet Amount Route
route.get('/check-balance', checkWalletBalance);

// Add Vehicle Route
route.post('/add-vehicle', upload.single('vehicle_image'), addVehicleController);

// Get All Vehicle Route
route.get('/all-vehicle', getAllVehicleController);

// Buy vehicle Route
// route.post('/buy-vehicle/:id', buyVehicleController);
route.post('/buy-vehicle/:id', buyVehicleWithEMI);




export default route;