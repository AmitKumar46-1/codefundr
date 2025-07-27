import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        unique: true,
        required: true,
    },
    phone: {
        type: String,
        unique: true,
    },
    profilePic: {
        type: String, // Cloudinary URL
    },
    profilePicPublicId: {
        type: String, // Cloudinary public_id for deletion
    },
    razorpayId: {
        type: String,
    },
    razorpaySecret: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Update the updatedAt field before saving
UserSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});




export default mongoose.models.User || mongoose.model('User', UserSchema);