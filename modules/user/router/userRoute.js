import express from 'express';
import { loginValidation, passwordValidation, registerValidation, updateProfileValidation } from '../../../middleware/userValidation.js';
import { expressValidationResult } from '../../../helper/validationError.js';
import { changePasswordController, forgetPasswordController, loginController, registerController, renewAccessTokenController, updateUserProfileController } from '../controller/userController.js';
import { authenticateToken } from '../../../middleware/jwtAuthorization.js';

const userRoute = express.Router();


// Routes Definition

// Create User Route POST Request
userRoute.post('/register', registerValidation, expressValidationResult, registerController);

// Login User Route POST Request
userRoute.post('/login', loginValidation, expressValidationResult, loginController);

// Renew Access Token Route POST Request
userRoute.post('/renewAccessToken', renewAccessTokenController);

// Forget Password Route POST Request
userRoute.post('/forgetPassword', loginValidation, expressValidationResult, forgetPasswordController);

// Change Password Route POST Request
userRoute.post('/changePassword', passwordValidation, expressValidationResult, authenticateToken, changePasswordController);

// Change User Profile Route POST Request
userRoute.post('/updateProfile', updateProfileValidation, expressValidationResult, authenticateToken, updateUserProfileController);

export default userRoute;