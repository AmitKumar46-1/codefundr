"use server";

import Razorpay from "razorpay";
import Payment from "@/models/Payment";
import connectDb from "@/db/connectDb";
import crypto from "crypto";
import User from "@/models/User";
import { v2 as cloudinary } from 'cloudinary';





// Simple helper to clean MongoDB data
const cleanData = (data) => {
  if (Array.isArray(data)) return data.map(cleanData);
  if (data && typeof data === 'object') {
    const cleaned = { ...data };
    if (cleaned._id) cleaned._id = cleaned._id.toString();
    return cleaned;
  }
  return data;
};

// Helper function to upload image to Cloudinary
const uploadToCloudinary = async (file, folder = 'profile-pics') => {
  try {
    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const mimeType = file.type;
    const dataURI = `data:${mimeType};base64,${base64}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: folder,
      resource_type: 'auto',
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
        { quality: 'auto', format: 'auto' }
      ]
    });

    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Helper function to delete image from Cloudinary
const deleteFromCloudinary = async (public_id) => {
  try {
    if (!public_id) return { success: true };

    const result = await cloudinary.uploader.destroy(public_id);
    return { success: true, result };
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return { success: false, error: error.message };
  }
};

/// FIXED: 1. Initiate Payment - Now uses recipient's Razorpay credentials
export const initiatePayment = async (amount, recipientUsername) => {
  await connectDb();

  // Find the recipient user (the one receiving money) by username
  let recipientUser = await User.findOne({
    $or: [
      { username: recipientUsername },
      { name: recipientUsername }
    ]
  }).lean();

  console.log("Finding recipient for payment:", recipientUsername);
  console.log("Recipient user found:", recipientUser);

  if (!recipientUser) {
    throw new Error("Recipient user not found");
  }

  if (!recipientUser.razorpayId || !recipientUser.razorpaySecret) {
    throw new Error("Recipient has not set up Razorpay credentials");
  }

  // Use RECIPIENT's Razorpay credentials (not payer's)
  const instance = new Razorpay({
    key_id: recipientUser.razorpayId,
    key_secret: recipientUser.razorpaySecret,
  });

  const options = {
    amount: Number.parseInt(amount),
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  return await instance.orders.create(options);
};

// 2. Verify Payment Signature
// FIXED: 2. Verify Payment Signature - Now uses recipient's Razorpay secret
export const verifyPaymentSignature = async (paymentData) => {
  await connectDb();
  
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, username } = paymentData;
  
  // Find the recipient user to get their Razorpay secret
  const recipientUser = await User.findOne({
    $or: [
      { username: username },
      { name: username }
    ]
  }).lean();

  if (!recipientUser) {
    throw new Error("Recipient user not found for verification");
  }

  if (!recipientUser.razorpaySecret) {
    throw new Error("Recipient's Razorpay secret not found");
  }

  // Use the RECIPIENT's Razorpay secret for verification (same account that created the order)
  const hmac = crypto.createHmac("sha256", recipientUser.razorpaySecret);
  hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const generatedSignature = hmac.digest("hex");
  
  console.log("Generated signature:", generatedSignature);
  console.log("Razorpay signature:", razorpay_signature);
  console.log("Signatures match:", generatedSignature === razorpay_signature);
  
  return generatedSignature === razorpay_signature;
};

// 3. Save Payment
// 3. Save Payment - FIXED to always use username
export const savePayment = async (paymentData, status = "completed") => {
  await connectDb();

  // Get the recipient user using the identifier from URL
  const recipientUser = await User.findOne({
    $or: [
      { username: paymentData.username || paymentData.to_user },
      { name: paymentData.username || paymentData.to_user }
    ]
  }).lean();

  if (!recipientUser) {
    throw new Error("Recipient user not found");
  }

  // ALWAYS use username for payments (must exist)
  if (!recipientUser.username) {
    throw new Error("Recipient user must have a username to receive payments");
  }

  const toUserIdentifier = recipientUser.username; // Always use username

  const payment = await Payment.create({
    name: paymentData.name || "Unknown",
    to_user: toUserIdentifier, // Always username
    oid: paymentData.razorpay_order_id,
    message: paymentData.message || "",
    amount: Number.parseInt(paymentData.amount),
    razorpay_payment_id: paymentData.razorpay_payment_id || "N/A",
    razorpay_order_id: paymentData.razorpay_order_id,
    razorpay_signature: paymentData.razorpay_signature || "N/A",
    payment_status: status,
    verified: status === "completed",
    done: status === "completed",
    created_at: new Date()
  });

  return { success: status === "completed", payment: cleanData(payment.toObject()) };
};
// 4. Fetch User - SIMPLIFIED
export const fetchuser = async (identifier) => {
  await connectDb();

  if (!identifier) return null;

  const user = await User.findOne({
    $or: [
      { email: identifier },
      { username: identifier }
    ]
  }).lean();

  return user ? cleanData(user) : null;
};


// 5. Fetch Payments - FIXED to use username
export const fetchPayments = async (identifier) => {
  await connectDb();

  // Find the user first to get their username
  const user = await User.findOne({
    $or: [
      { email: identifier },
      { username: identifier },
      { name: identifier }
    ]
  }).lean();

  if (!user || !user.username) {
    return []; // Return empty if user not found or no username
  }

  // Always fetch by username
  const payments = await Payment.find({
    to_user: user.username,
    done: true
  })
    .sort({ created_at: -1 })
    .lean();

  return cleanData(payments);
};

// 6. Update Profile with Cloudinary Integration
// 6. Update Profile with Cloudinary Integration
export const updateProfile = async (data, oldusername) => {
  await connectDb();

  try {
    // Extract fields from FormData
    const email = data.get('email');
    const name = data.get('name') || undefined;
    const username = data.get('username') || undefined;
    const phone = data.get('phone') || undefined;
    const razorpayId = data.get('razorpayId') || undefined;
    const razorpaySecret = data.get('razorpaySecret') || undefined;
    const profilePicFile = data.get('profilePic');

    if (!email) return { error: "Email is required" };

    const user = await User.findOne({ email });
    if (!user) return { error: "User not found" };

    let profilePicUrl = null;
    let profilePicPublicId = null;
    let oldProfilePicPublicId = user.profilePicPublicId;

    // Upload new profile picture if provided
    if (profilePicFile && typeof profilePicFile === 'object' && profilePicFile.name) {
      const uploadResult = await uploadToCloudinary(profilePicFile, 'user-profiles');

      if (uploadResult.success) {
        profilePicUrl = uploadResult.url;
        profilePicPublicId = uploadResult.public_id;
      } else {
        return { error: `Image upload failed: ${uploadResult.error}` };
      }
    }

    // Get current identifier used for payments (priority: username > name)
    const currentPaymentIdentifier = user.username || user.name;
    let newPaymentIdentifier = currentPaymentIdentifier;

    // Check if username is being updated
    if (username && username !== user.username) {
      const existing = await User.findOne({ username });
      console.log("Checking for existing username:", username);
      if (existing) {
        if (profilePicPublicId) {
          await deleteFromCloudinary(profilePicPublicId); // cleanup new upload
        }
        return { error: "Username already taken" };
      }

      // Username takes priority as payment identifier
      newPaymentIdentifier = username;
    }

    // If no username update but name is being updated, use name as identifier
    if (!username && name && name !== user.name) {
      // Only update payment identifier if no username exists
      if (!user.username) {
        newPaymentIdentifier = name;
      }
    }

    // Update payments if identifier changed
    if (newPaymentIdentifier !== currentPaymentIdentifier) {
      console.log("Updating payments from", currentPaymentIdentifier, "to", newPaymentIdentifier);

      // Update all payments that match current identifier
      const possibleOldIdentifiers = [
        user.username,
        user.name,
        oldusername // from parameter
      ].filter(Boolean);

      await Payment.updateMany(
        { to_user: { $in: possibleOldIdentifiers } },
        { to_user: newPaymentIdentifier }
      );
    }

    // Build update object
    const updateObj = {
      updatedAt: new Date(),
      ...(name && { name }),
      ...(username && { username }),
      ...(phone && { phone }),
      ...(razorpayId && { razorpayId }),
      ...(razorpaySecret && { razorpaySecret }),
      ...(profilePicUrl && { profilePic: profilePicUrl, profilePicPublicId }),
    };

    const result = await User.updateOne({ email }, { $set: updateObj });

    if (result.modifiedCount > 0) {
      // Delete old image if new one uploaded
      if (profilePicUrl && oldProfilePicPublicId) {
        await deleteFromCloudinary(oldProfilePicPublicId);
      }

      return { success: true, newIdentifier: newPaymentIdentifier };
    } else {
      // Cleanup new upload if nothing changed
      if (profilePicPublicId) {
        await deleteFromCloudinary(profilePicPublicId);
      }

      return { error: "No changes were made" };
    }
  } catch (error) {
    console.error("Update profile error:", error);
    return { error: error.message };
  }
};