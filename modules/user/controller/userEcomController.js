import Wallet from '../../../models/walletSchema.js';
import User from '../../../models/userSchema.js';
import httpResponse from '../../../helper/httpResponse.js';
import { responseMessage, responseStatus, statusCode } from '../../../core/constant.js';
import Vehicle from '../../../models/vehicleSchema.js';
import Transaction from '../../../models/transactionSchema.js';
import schedule from 'node-schedule';
import EMI from '../../../models/emiSchema.js';


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


                            const newTransaction = new Transaction({
                                seller_userId: vehicleData.seller_userId,
                                buyer_userId: req.userId,
                                vehicle_id: req.params.id,
                                vehicle_price: vehicleData.vehicle_price,
                                paid_amount: vehicleData.vehicle_price
                            });
                            await newTransaction.save();
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

// EMI Payment Function

export const buyVehicleWithEMI = async (req, res) => {
    try {
        const vehicleId = req.params.id;
        const userId = req.userId;
        const emiTerm = req.body.emiTerm;

        const userData = await User.findOne({ _id: userId });
        if (userData) {
            const walletData = await Wallet.findOne({ userId: req.userId });
            if (walletData) {
                const vehicleData = await Vehicle.findOne({ _id: vehicleId });
                if (!vehicleData.vehicle_sold) {
                    const sellerUserId = vehicleData.seller_userId;
                    if (sellerUserId.toString() !== req.userId) {

                        // EMI Calculation
                        const interestRate = 0.1; // 10% annual interest
                        const principalAmount = vehicleData.vehicle_price;
                        // const emiAmount = (principalAmount * interestRate) / 12 / (1 - Math.pow(1 + interestRate / 12, -emiTerm));
                        const emiAmount = principalAmount / emiTerm;

                        if (walletData.wallet_amount >= emiAmount) {
                            // Wallet update (buyer, seller, admin)



                            // JOB Schedule
                            schedule.scheduleJob('*/5 * * * * *', () => {

                                

                            });












                            
                            // Add EMI to the seller's wallet
                            const sellerWallet = await Wallet.findOne({ userId: sellerUserId });
                            const updatedSellerWalletAmount = sellerWallet.wallet_amount + emiAmount;
                            await Wallet.findByIdAndUpdate(sellerWallet._id, { $set: { wallet_amount: updatedSellerWalletAmount } });

                            // Calculate and add interest to the admin's wallet
                            const interestAmount = emiAmount * interestRate;
                            const adminWallet = await Wallet.findById('6513e92916bb7f8755a473b4'); // Replace with your admin's wallet ID
                            const updatedAdminWalletAmount = adminWallet.wallet_amount + interestAmount;
                            await Wallet.findByIdAndUpdate(adminWallet._id, { $set: { wallet_amount: updatedAdminWalletAmount } });


                            // Deduct the first EMI amount from the buyer's wallet
                            const sellerTotalEMI = emiAmount + interestAmount
                            const updatedWalletAmount = walletData.wallet_amount - sellerTotalEMI;
                            await Wallet.findByIdAndUpdate(walletData._id, { $set: { wallet_amount: updatedWalletAmount } });



                            const transactionData = await Transaction.findOne({ vehicle_id: vehicleId  });
                            if(transactionData){
                                const updatedSellerEMI = transactionData.paid_amount += sellerTotalEMI;
                                await Transaction.findByIdAndUpdate(
                                    { _id: transactionData._id },
                                    {$set: { paid_amount: updatedSellerEMI }}
                                );
                            }else{
                                // Create a transaction record
                                const transaction = new Transaction({
                                    seller_userId: sellerUserId,
                                    buyer_userId: userId,
                                    vehicle_id: vehicleId,
                                    vehicle_price: principalAmount,
                                    paid_amount: sellerTotalEMI
                                });
                                const newTransactionData = await transaction.save();
                            }

                            const emiData = await EMI.findOne({ vehicleId: vehicleId  });
                            if(emiData){

                                const updatedSellerEmiInstallment = emiData.received_emi + 1;
                                await EMI.findByIdAndUpdate(
                                    { _id: emiData._id },
                                    {$set: { received_emi: updatedSellerEmiInstallment }}
                                );
                            }else{
                                // Update the EMI record in the database
                                const emiRecord = new EMI({
                                    buyerUserId: userId,
                                    sellerUserId: sellerUserId,
                                    vehicleId: vehicleId,
                                    emiTerm: emiTerm,
                                    emiAmount: emiAmount
                                });
                                const newEmiData = await emiRecord.save();
                            }

                            httpResponse(res, statusCode.OK, responseStatus.SUCCESS, responseMessage.SUCCESS);

                        } else {
                            httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.INSUFFICIENT_AMOUNT);
                        }
                    } else {
                        httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.NOT_ELIGIBLE_TO_BUY_VEHICLE);
                    }
                } else {
                    httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.ALREADY_SOLD);
                }
            } else {
                httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.ALERT_ACTIVATE_WALLET);
            }
        } else {
            httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.UNAUTHORIZED);
        }
    } catch (error) {
        httpResponse(res, statusCode.INTERNAL_SERVER_ERROR, responseStatus.FAILURE, responseMessage.INTERNAL_SERVER_ERROR, error.message);
    }
}


























// export const buyVehicleWithEMI = async(req, res) => {
//     try {

//         const vehicleId = req.params.id;
//         const userId = req.userId;
//         const emiTerm = req.body.emiTerm;

//         const userData = await User.findOne({ _id: userId });
//         if(userData){
//             const walletData = await Wallet.findOne({ userId: req.userId});
//             if(walletData){
//                 const vehicleData = await Vehicle.findOne({ _id: vehicleId});
//                 if(vehicleData.vehicle_sold == false){
//                     const sellerUserId = vehicleData.seller_userId;
//                     if(sellerUserId.toString() !== req.userId){

//                         // EMI Calculation
//                         const interestRate = 0.1; // 10% annual interest
//                         const principalAmount = vehicleData.vehicle_price;
//                         const emiAmount = (principalAmount * interestRate) / 12 / (1 - Math.pow(1 + interestRate / 12, -emiTerm));

//                         if(walletData.wallet_amount >= emiAmount){
//                             // Wallet update (buyer, seller, admin)
//                             // Deduct the first EMI amount from the buyer's wallet
//                             const updatedWalletAmount = walletData.wallet_amount - emiAmount;
//                             await Wallet.findByIdAndUpdate(walletData._id, { $set: { wallet_amount: updatedWalletAmount } });

//                             // Add EMI to the seller's wallet
//                             const sellerWallet = await Wallet.findOne({ userId: vehicleData.seller_userId });
//                             const updatedSellerWalletAmount = sellerWallet.wallet_amount + emiAmount;
//                             await Wallet.findByIdAndUpdate(sellerWallet._id, { $set: { wallet_amount: updatedSellerWalletAmount } });


//                             // Calculate and add interest to the admin's wallet
//                             const interestAmount = emiAmount * (interestRate / 12);
//                             const adminWallet = await Wallet.findById('6513e92916bb7f8755a473b4');
//                             const updatedAdminWalletAmount = adminWallet.wallet_amount + interestAmount;
//                             await Wallet.findByIdAndUpdate(adminWallet._id, { $set: { wallet_amount: updatedAdminWalletAmount } });


//                             // Update the EMI record in the database
//                             const emiRecord = new EMI({
//                                 buyerUserId: req.userId,
//                                 sellerUserId: vehicleData.seller_userId,
//                                 vehicleId: vehicleId,
//                                 emiTerm: emiTerm,
//                                 emiAmount: emiAmount,
//                                 // dueDate: dueDate,
//                             });
//                             const emiData = await emiRecord.save();

//                             httpResponse(res, statusCode.OK, responseStatus.SUCCESS, responseMessage.SUCCESS, emiData);


//                         }else{
//                             httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.INSUFFICIENT_AMOUNT);
//                         }
//                     }else{
//                         httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.NOT_ELIGIBLE_TO_BUY_VEHICLE);
//                     }
//                 }else{
//                     httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.ALREADY_SOLD);
//                 }
//             }else{
//                 httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.ALERT_ACTIVATE_WALLET);
//             }
//         }else{
//             httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.UNAUTHORIZED);
//         }
        
//     } catch (error) {
//         httpResponse(res, statusCode.INTERNAL_SERVER_ERROR, responseStatus.FAILURE, responseMessage.INTERNAL_SERVER_ERROR, error.message);
//     }
// }







// // export const buyVehicleWithEMI = async(userId, vehicleId, emiTerm) => {
// export const buyVehicleWithEMI = async(req, res) => {
//     try {


//         const vehicleId = req.params.id;
//         const emiTerm = req.body.emiTerm;
//         const userId = req.userId
//         const userData = await User.findOne({ _id: userId });
//         if(userData){
//             const vehicleData = await Vehicle.findOne({ _id: vehicleId });
//             if(vehicleData){
//                 if(sellerUserId.toString() !== req.userId)
//                 // const walletData = await Wallet.findOne({ userId: userId });
//                 if(walletData){
//                     // EMI Calculation
//                     const interestRate = 0.1; // 10% annual interest
//                     const principalAmount = vehicleData.vehicle_price;
//                     const emiAmount = (principalAmount * interestRate) / 12 / (1 - Math.pow(1 + interestRate / 12, -emiTerm));
//                     if(walletData.wallet_amount >= emiAmount){

//                         // Calculate the due date for the first EMI installment
//                         const currentDate = new Date();
//                         const dueDate = new Date(currentDate);
//                         dueDate.setMonth(currentDate.getMonth() + 1); // First EMI due next month

//                         // Schedule automatic EMI deductions
//                         const job = schedule.scheduleJob(dueDate, async function () {
//                             try {
//                                 // Deduct EMI from the buyer's wallet
//                                 const updatedWalletAmount = walletData.wallet_amount - emiAmount;
//                                 await Wallet.findByIdAndUpdate(walletData._id, { $set: { wallet_amount: updatedWalletAmount } });

//                                 // Add EMI to the seller's wallet
//                                 const sellerWallet = await Wallet.findOne({ userId: vehicleData.seller_userId });
//                                 if (sellerWallet) {

//                                     const updatedSellerWalletAmount = sellerWallet.wallet_amount + emiAmount;
//                                     await Wallet.findByIdAndUpdate(sellerWallet._id, { $set: { wallet_amount: updatedSellerWalletAmount } });
                                    
                                    
//                                     // Calculate and add interest to the admin's wallet
//                                     const interestAmount = emiAmount * (interestRate / 12);
//                                     const adminWallet = await Wallet.findById('6513e92916bb7f8755a473b4');
//                                     if(adminWallet){

//                                         const updatedAdminWalletAmount = adminWallet.wallet_amount + interestAmount;
//                                         await Wallet.findByIdAndUpdate(adminWallet._id, { $set: { wallet_amount: updatedAdminWalletAmount } });


//                                         // Update the EMI record in the database
//                                         const emiRecord = new EMI({
//                                             buyerUserId: req.userId,
//                                             sellerUserId: vehicleData.seller_userId,
//                                             vehicleId: vehicleId,
//                                             emiTerm: emiTerm,
//                                             emiAmount: emiAmount,
//                                             dueDate: dueDate,
//                                         });
//                                         await emiRecord.save();

//                                         // Check if EMI term is completed
//                                         if (emiRecord.emiTerm <= 1) {
//                                             // Mark the vehicle as sold if it's not already
//                                             if (!vehicleData.vehicle_sold) {
//                                                 await Vehicle.findByIdAndUpdate(vehicleId, { $set: { vehicle_sold: true } });
//                                             }
//                                             // Cancel the scheduled job
//                                             job.cancel();
//                                         } else {
//                                             // Calculate due date for the next EMI installment
//                                             dueDate.setMonth(dueDate.getMonth() + 1);
//                                         }
//                                     }else{
//                                         httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.ADMIN_WALLET_NOT_FOUND);
//                                     }
//                                 }else{
//                                     httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.SELLER_WALLET_NOT_FOUND);
//                                 }
//                             } catch (error) {
//                                 console.error('Error processing EMI:', error);
//                                 httpResponse(res, statusCode.INTERNAL_SERVER_ERROR, responseStatus.FAILURE, responseMessage.INTERNAL_SERVER_ERROR);
//                             }
//                         });

//                         // Deduct the first EMI amount from the buyer's wallet
//                         const updatedWalletAmount = walletData.wallet_amount - emiAmount;
//                         await Wallet.findByIdAndUpdate(walletData._id, { $set: { wallet_amount: updatedWalletAmount } });

//                         // Success response
//                         httpResponse(res, statusCode.OK, responseStatus.SUCCESS, responseMessage.VEHICLE_BUY_SUCCESS);

//                     }else{
//                         httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.INSUFFICIENT_AMOUNT);
//                     }
//                 }else{
//                     httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.ALERT_ACTIVATE_WALLET);
//                 }
//             }else{
//                 httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.VEHICLE_NOT_FOUND)
//             }
//         }else{
//             httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.UNAUTHORIZED);
//         }
        
//     } catch (error) {
//         httpResponse(res, statusCode.INTERNAL_SERVER_ERROR, responseStatus.FAILURE, responseMessage.INTERNAL_SERVER_ERROR);
//     }
// }



// export const buyVehicleWithEMI = async (req, res) => {
//     try {
//         const vehicleId = req.params.id;
//         const userId = req.userId;
//         const emiTerm = req.body.emiTerm;

//         const userData = await User.findOne({ _id: userId });
//         if (userData) {
//             const walletData = await Wallet.findOne({ userId: req.userId });
//             if (walletData) {
//                 const vehicleData = await Vehicle.findOne({ _id: vehicleId });
//                 if (!vehicleData.vehicle_sold) {
//                     const sellerUserId = vehicleData.seller_userId;
//                     if (sellerUserId.toString() !== req.userId) {

//                         // EMI Calculation
//                         const interestRate = 0.1; // 10% annual interest
//                         const principalAmount = vehicleData.vehicle_price;
//                         // const emiAmount = (principalAmount * interestRate) / 12 / (1 - Math.pow(1 + interestRate / 12, -emiTerm));
//                         const emiAmount = principalAmount / emiTerm;

//                         if (walletData.wallet_amount >= emiAmount) {
//                             // Wallet update (buyer, seller, admin)
                            
//                             // Add EMI to the seller's wallet
//                             const sellerWallet = await Wallet.findOne({ userId: sellerUserId });
//                             const updatedSellerWalletAmount = sellerWallet.wallet_amount + emiAmount;
//                             await Wallet.findByIdAndUpdate(sellerWallet._id, { $set: { wallet_amount: updatedSellerWalletAmount } });

//                             // Calculate and add interest to the admin's wallet
//                             const interestAmount = emiAmount * interestRate;
//                             const adminWallet = await Wallet.findById('6513e92916bb7f8755a473b4'); // Replace with your admin's wallet ID
//                             const updatedAdminWalletAmount = adminWallet.wallet_amount + interestAmount;
//                             await Wallet.findByIdAndUpdate(adminWallet._id, { $set: { wallet_amount: updatedAdminWalletAmount } });


//                             // Deduct the first EMI amount from the buyer's wallet
//                             const updatedWalletAmount = walletData.wallet_amount - emiAmount;
//                             await Wallet.findByIdAndUpdate(walletData._id, { $set: { wallet_amount: updatedWalletAmount } });

//                             // Create a transaction record
//                             const transaction = new Transaction({
//                                 seller_userId: sellerUserId,
//                                 buyer_userId: userId,
//                                 vehicle_id: vehicleId,
//                                 vehicle_price: principalAmount,
//                             });
//                             const transactionData = await transaction.save();

//                             // Update the EMI record in the database
//                             const emiRecord = new EMI({
//                                 buyerUserId: userId,
//                                 sellerUserId: sellerUserId,
//                                 vehicleId: vehicleId,
//                                 emiTerm: emiTerm,
//                                 emiAmount: emiAmount,
//                             });
//                             const emiData = await emiRecord.save();

//                             httpResponse(res, statusCode.OK, responseStatus.SUCCESS, responseMessage.SUCCESS, emiData);
//                         } else {
//                             httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.INSUFFICIENT_AMOUNT);
//                         }
//                     } else {
//                         httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.NOT_ELIGIBLE_TO_BUY_VEHICLE);
//                     }
//                 } else {
//                     httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.ALREADY_SOLD);
//                 }
//             } else {
//                 httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.ALERT_ACTIVATE_WALLET);
//             }
//         } else {
//             httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.UNAUTHORIZED);
//         }
//     } catch (error) {
//         httpResponse(res, statusCode.INTERNAL_SERVER_ERROR, responseStatus.FAILURE, responseMessage.INTERNAL_SERVER_ERROR, error.message);
//     }
// }
