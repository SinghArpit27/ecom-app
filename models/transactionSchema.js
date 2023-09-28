import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    
    seller_userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    buyer_userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    vehicle_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true
    },
    vehicle_price:{
        type: Number,
        required: true
    },
    paid_amount:{
        type: Number,
        required: true
    },
    date: { 
        type: Date,
        default: Date.now
    },
}, { timestamps: true });

export default mongoose.model('Transaction', transactionSchema);