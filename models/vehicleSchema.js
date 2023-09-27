import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({

    seller_userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    vehicle_name: {
        type: String,
        required: true
    },
    vehicle_image: {
        type: String,
        required: true
    },
    vehicle_number: {
        type: String,
        required: true
    },
    vehicle_owner_name:{
        type: String,
        required: true
    },
    vehicle_buy_date:{
        type: String,
        required: true
    },
    purchase_state:{
        type: String,
        required: true
    },
    vehicle_price:{
        type: Number,
        required: true
    },
    vehicle_sold:{
        type: Boolean,
        default: false
    }


}, { timestamps: true });

export default mongoose.model('Vehicle', vehicleSchema);