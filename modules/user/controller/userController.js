import { responseMessage, responseStatus, statusCode } from '../../../core/constant.js';
import httpResponse from '../../../helper/httpResponse.js';
import { createAccessToken, createRefreshToken } from '../../../middleware/userAuthentication.js';
import User from '../../../models/userSchema.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


// User Registration API
export const registerController = async (req,res) => {
    try {
        
        const userEmail = await User.findOne({ email: req.body.email });
        if(!userEmail){

            const userPhone = await User.findOne({ phone: req.body.phone });
            if(!userPhone){

                const hashPassword = await bcrypt.hash(req.body.password, 10);
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    phone: req.body.phone,
                    password: hashPassword
                });
                const userData = await newUser.save();

                console.log(userData);

                httpResponse(res, statusCode.CREATED, responseStatus.SUCCESS, responseMessage.USER_CREATED_SUCCESS, userData);

            }else{
                httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.PHONE_ALREADY_EXIST);
            }
        }else{
            httpResponse(res, statusCode.BAD_REQUEST, statusCode.FAILURE, responseMessage.EMAIL_ALREADY_EXIST);
        }
        
    } catch (error) {
        httpResponse(res, statusCode.INTERNAL_SERVER_ERROR, responseStatus.FAILURE, responseMessage.INTERNAL_SERVER_ERROR);
    }
}

// User Login API
export const loginController = async (req,res) => {
    try {

        const userData = await User.findOne({ email: req.body.email });
        if(userData){
            const passwordMatch = await bcrypt.compare(req.body.password, userData.password);
            if(passwordMatch){
                if(userData.isDeleted == false){

                    // JWT Authentication logic
                    const token = {
                        accessToken: await createAccessToken(userData._id),
                        refreshToken: await createRefreshToken(userData._id)
                    }
                    httpResponse(res, statusCode.OK, responseStatus.SUCCESS, responseMessage.LOGIN_SUCCESS, token);

                }else{
                    httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.USER_DELETED_ALERT);
                }
            }else{
                httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.INCORRECT_CREDENTIALS);
            }
        }else{
            httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.INCORRECT_CREDENTIALS);
        }
    } catch (error) {
        httpResponse(res, statusCode.INTERNAL_SERVER_ERROR, responseStatus.FAILURE, responseMessage.INTERNAL_SERVER_ERROR);
    }
}

// Re-generate Access Token Token API
export const renewAccessTokenController = async (req,res) => {
    try {
        
        const refreshToken = req.body.token;
        if (refreshToken) {
            // Verify Refresh Token
            jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET, async (err, decoded) => {
                if (!err) {

                    const user = decoded; // The user data decoded from the token
                    const userData = await User.findById({ _id: user._id });
                    // Create New Acces token
                    const accessToken = await createAccessToken(userData._id);
                    httpResponse(res, statusCode.OK, responseStatus.SUCCESS, responseMessage.SUCCESS, accessToken);

                } else {
                    // console.log("Not Verified refresh token")
                    httpResponse(res, statusCode.UNAUTHORIZED, responseStatus.FAILURE, responseMessage.UNAUTHORIZED);
                }
            });
        }else{
            httpResponse(res, statusCode.UNAUTHORIZED, responseStatus.FAILURE, responseMessage.UNAUTHORIZED);
        }

    } catch (error) {
        httpResponse(res, statusCode.INTERNAL_SERVER_ERROR, responseStatus.FAILURE, responseMessage.INTERNAL_SERVER_ERROR, error.message);
    }
}

// Forget password API
export const forgetPasswordController = async (req,res) => {
    try {

        const userData = await User.findOne({ email: req.body.email });
        if(userData){

            const hashPassword = await bcrypt.hash(req.body.password, 10);
            const updatedData = await User.findByIdAndUpdate({ _id: userData._id }, {$set: { password: hashPassword }});

            httpResponse(res, statusCode.OK, responseStatus.SUCCESS, responseMessage.FORGET_PASSWORD_SUCCESS);

        }else{
            httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.USER_NOT_FOUND);
        }

    } catch (error) {
        httpResponse(res, statusCode.INTERNAL_SERVER_ERROR, responseStatus.FAILURE, responseMessage.INTERNAL_SERVER_ERROR, error.message);
    }
}

// Change password API
export const changePasswordController = async (req,res) => {
    try {
        
        const userId = req.userId;
        const newPassword = await bcrypt.hash(req.body.password, 10);

        const userData = await User.findByIdAndUpdate(
            { _id: userId },
            { $set: { password: newPassword }}
        );

        if (!userData) {
            httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.USER_NOT_FOUND);
        }else{
            httpResponse(res, statusCode.OK, responseStatus.SUCCESS, responseMessage.PASSWORD_CHANGE_SUCCESS);
        }
    } catch (error) {
        httpResponse(res, statusCode.INTERNAL_SERVER_ERROR, responseStatus.FAILURE, responseMessage.INTERNAL_SERVER_ERROR, error.message);
    }
}

// Update User Profile API
export const updateUserProfileController = async (req,res) => {
    try {
        const userId = req.userId;
        const checkExistingEmail = await User.findOne( { _id: {$ne: userId}, email: req.body.email } );
        if (!checkExistingEmail) {
            const checkExistingPhone = await User.findOne( { _id: {$ne: userId}, phone: req.body.phone } );
            if(!checkExistingPhone){

                const userData = await User.findByIdAndUpdate(
                    { _id: userId },
                    { $set: { name: req.body.name, email: req.body.email, phone: req.body.phone } }
                );
                if (userData) {
                    httpResponse(res, statusCode.OK, responseStatus.SUCCESS, responseMessage.PROFILE_UPDATE);
                }else{
                    httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.UNAUTHORIZED);
                }

            }else{
                httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.PHONE_ALREADY_EXIST);
            }
        } else {
            httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.EMAIL_ALREADY_EXIST);
        }
    } catch (error) {
        httpResponse(res, statusCode.INTERNAL_SERVER_ERROR, responseStatus.FAILURE, responseMessage.INTERNAL_SERVER_ERROR, error.message);
    }
}
