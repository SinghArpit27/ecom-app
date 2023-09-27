import mongoose from 'mongoose';

const emiSchema = new mongoose.Schema({
    buyerUserId: {
        type: mongoose.Schema.Types.ObjectId, // Assuming buyerUserId is a reference to the User model
        ref: 'User', // Replace with the actual name of your User model
        required: true,
    },
    sellerUserId: {
        type: mongoose.Schema.Types.ObjectId, // Assuming sellerUserId is a reference to the User model
        ref: 'User', // Replace with the actual name of your User model
        required: true,
    },
    vehicleId: {
        type: mongoose.Schema.Types.ObjectId, // Assuming vehicleId is a reference to the Vehicle model
        ref: 'Vehicle', // Replace with the actual name of your Vehicle model
        required: true,
    },
    emiTerm: {
        type: Number,
        required: true,
    },
    emiAmount: {
        type: Number,
        required: true,
    },
    dueDate: {
        type: Date,
        required: true,
    },
}, { timestamps: true });
export default mongoose.model('EMI', emiSchema);
