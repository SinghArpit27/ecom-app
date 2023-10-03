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

// Create an index on the email and phone fields
// userSchema.index({ email: 1, phone: 1 }, { unique: true });

export default mongoose.model("User", userSchema);