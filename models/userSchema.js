import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({

    name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    user_role: {
        type: Number,
        required: true,
        default: 2
    },
    isDeleted: {
        type: Boolean,
        default: false
    },

},
{ timestamps: true });

export default mongoose.model("User", userSchema);