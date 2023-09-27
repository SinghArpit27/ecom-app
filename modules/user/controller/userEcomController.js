import Wallet from '../../../models/walletSchema.js';
import User from '../../../models/userSchema.js';
import httpResponse from '../../../helper/httpResponse.js';
import { responseMessage, responseStatus, statusCode } from '../../../core/constant.js';
import Vehicle from '../../../models/vehicleSchema.js';


// Activate User Wallet Controller
export const createWalletController = async(req,res) => {
    try{

        const userData = await User.findOne({ _id: req.userId });
        if(userData){
            const checkWallet = await Wallet.findOne({ userId: req.userId});
            if(!checkWallet){

                // Activate wallet
                const newWallet = new Wallet({
                    userId: req.userId
                });
                const walletData = await newWallet.save();
                httpResponse(res, statusCode.OK, responseStatus.SUCCESS, responseMessage.WALLET_ACTIVATED);

            }else{
                httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.ALREADY_ACTIVATED);
            }
        }else{
            httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.UNAUTHORIZED);
        }

    }catch(error){
        httpResponse(res, statusCode.INTERNAL_SERVER_ERROR, responseStatus.FAILURE, responseMessage.INTERNAL_SERVER_ERROR);
    }
}

// Add Money into Wallet Controller
export const addMoneyController = async(req,res) => {
    try {

        const userData = await User.findOne({ _id: req.userId });
        if(userData){
            if(userData.user_role === 2){

                const checkWallet = await Wallet.findOne({ userId: req.userId});
                if(checkWallet){

                    const newAmount = checkWallet.wallet_amount += req.body.amount;

                    const updatedWallet = await Wallet.findByIdAndUpdate(
                        { _id: checkWallet._id },
                        { $set: { wallet_amount: newAmount }}
                    );
                    // console.log(updatedWallet);
                    httpResponse(res, statusCode.OK, responseStatus.SUCCESS, responseMessage.AMOUNT_ADDED_SUCCESS);

                }else{
                    httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.ALERT_ACTIVATE_WALLET);
                }
            }else{
                httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.UNAUTHORIZED);
            }
        }else{
            httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.UNAUTHORIZED);
        }
        
    } catch (error) {
        httpResponse(res, statusCode.INTERNAL_SERVER_ERROR, responseStatus.FAILURE, responseMessage.INTERNAL_SERVER_ERROR);
    }
}

// Check Wallet Amount Controller
export const checkWalletBalance = async(req,res) => {
    try {
        
        const userData = await User.findOne({ _id: req.userId });
        if(userData){
            const walletData = await Wallet.findOne({ userId: req.userId});
            if(walletData){

                httpResponse(res, statusCode.OK, responseStatus.SUCCESS, responseMessage.SUCCESS, walletData);

            }else{
                httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.ALERT_ACTIVATE_WALLET);
            }
        }else{
            httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.UNAUTHORIZED);
        }

    } catch (error) {
        httpResponse(res, statusCode.INTERNAL_SERVER_ERROR, responseStatus.FAILURE, responseMessage.INTERNAL_SERVER_ERROR, error.message);
    }
}

// Add Vehicle Controller
export const addVehicleController = async(req,res) => {
    try {
        
        const userData = await User.findOne({ _id: req.userId });
        if(userData){
            const walletData = await Wallet.findOne({ userId: req.userId});
            if(walletData){

                const newvehicle = new Vehicle({
                    seller_userId: req.userId,
                    vehicle_name: req.body.vehicle_name,
                    vehicle_image: req.file.filename,
                    vehicle_number: req.body.vehicle_number,
                    vehicle_owner_name: userData.name,
                    vehicle_buy_date: req.body.vehicle_buy_date,
                    purchase_state: req.body.purchase_state,
                    vehicle_price: req.body.vehicle_price
                });
                const vehicleData = newvehicle.save();
                httpResponse(res, statusCode.OK, responseStatus.SUCCESS, responseMessage.VEHICLE_ADDEDD_SUCCESS);

            }else{
                httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.ALERT_ACTIVATE_WALLET);
            }
        }else{
            httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.UNAUTHORIZED);
        }

    } catch (error) {
        httpResponse(res, statusCode.INTERNAL_SERVER_ERROR, responseStatus.FAILURE, responseMessage.INTERNAL_SERVER_ERROR);
    }
}

// Get All Vehicle Controller
export const getAllVehicleController = async(req,res) => {
    try {
        
        const userData = await User.findOne({ _id: req.userId });
        if(userData){

            const allVehicles = await Vehicle.find({}).sort({ _id: -1 });
            httpResponse(res, statusCode.OK, responseStatus.SUCCESS, responseMessage.SUCCESS, allVehicles);
            
        }else{
            httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.UNAUTHORIZED);
        }

    } catch (error) {
        httpResponse(res, statusCode.INTERNAL_SERVER_ERROR, responseStatus.FAILURE, responseMessage.INTERNAL_SERVER_ERROR);
    }
}

// Buy vehicle Controller
export const buyVehicleController = async(req,res) => {
    try {
        
        const userData = await User.findOne({ _id: req.userId });
        if(userData){
            const walletData = await Wallet.findOne({ userId: req.userId});
            if(walletData){
                const vehicleData = await Vehicle.findOne({ _id: req.params.id });
                if(vehicleData.vehicle_sold == false){
                    const sellerUserId = vehicleData.seller_userId;
                    if(sellerUserId.toString() !== req.userId){
                        if(walletData.wallet_amount >= vehicleData.vehicle_price){

                            // Update Buyer Wallet
                            const updateWalletAmount = walletData.wallet_amount - vehicleData.vehicle_price;
                            const debitAmount = await Wallet.findByIdAndUpdate(
                                { _id: walletData._id },
                                { $set: { wallet_amount: updateWalletAmount } }
                            );

                            // Update PlateForm Charge in Super Admin Wallet
                            const amount = vehicleData.vehicle_price;
                            const plateformPercent = 5;
                            const result = (amount * plateformPercent) / 100;
                            const remainingAmount = amount - result;

                            const superAdminWallet = await Wallet.findById({ _id: '6513e92916bb7f8755a473b4'});
                            const updatedSuperAdminWalletAmount = superAdminWallet.wallet_amount + result;

                            const updatedSuperAdminWallet = await Wallet.findByIdAndUpdate(
                                { _id: '6513e92916bb7f8755a473b4' },
                                { $set: { wallet_amount: updatedSuperAdminWalletAmount } }
                            );

                            // Update Seller Wallet
                            const sellerWallet = await Wallet.findOne({ userId: vehicleData.seller_userId });
                            const updateSellerWalletAmount = sellerWallet.wallet_amount + remainingAmount;
                            const updatedSellerWallet = await Wallet.findByIdAndUpdate(
                                { _id: sellerWallet._id },
                                { $set: { wallet_amount: updateSellerWalletAmount } }
                            );


                            // Update vehicle_sold field
                            const updatedVehicleData = await Vehicle.findByIdAndUpdate(
                                { _id: req.params.id },
                                { $set: { vehicle_sold: true } }
                            );
                            httpResponse(res, statusCode.OK, responseStatus.SUCCESS, responseMessage.VEHICLE_BUY_SUCCESS);
                            
                        }else{
                            httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.INSUFFICIENT_AMOUNT);
                        }
                    }else{
                        httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.NOT_ELIGIBLE_TO_BUY_VEHICLE);
                    }
                }else{
                    httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.ALREADY_SOLD);
                }
            }else{
                httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.ALERT_ACTIVATE_WALLET);
            }
        }else{
            httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.UNAUTHORIZED);
        }

    } catch (error) {
        httpResponse(res, statusCode.INTERNAL_SERVER_ERROR, responseStatus.FAILURE, responseMessage.INTERNAL_SERVER_ERROR, error.message);
    }
}

// EMI Invoice Generate Function