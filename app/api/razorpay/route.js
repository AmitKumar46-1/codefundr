import { NextResponse } from "next/server";
import crypto from "crypto";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Payment from "@/models/Payment";
import connectDb from "@/db/connectDb";
import User from "@/models/User";

export async function POST(req) {
    console.log("🚀 Payment verification API called");

    try {
        // Parse request data first
        console.log("📦 Parsing request data...");
        const paymentData = await req.json();
        console.log("📋 Payment data received:", paymentData);

        // Extract payment details
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            name,
            message,
            amount,
            username // This is the RECIPIENT's username (who will receive the money)
        } = paymentData;

        // Validate required fields
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !username) {
            console.error("❌ Missing required payment fields");
            return NextResponse.json({
                success: false,
                message: 'Missing payment verification data or recipient username'
            }, { status: 400 });
        }

        // Test database connection
        console.log("📡 Connecting to database...");
        await connectDb();
        console.log("✅ Database connected successfully");

        // FIXED: Get the RECIPIENT user (not the logged-in user) for verification
        console.log("🔍 Fetching RECIPIENT user by username:", username);
        const recipientUser = await User.findOne({
            $or: [
                { username: username },
                { name: username }
            ]
        });
        
        if (!recipientUser) {
            console.error("❌ Recipient user not found:", username);
            return NextResponse.json({
                success: false,
                message: 'Recipient user not found. Please check the username.'
            }, { status: 404 });
        }

        console.log("✅ Recipient user found:", recipientUser.username || recipientUser.name);

        // FIXED: Use RECIPIENT's Razorpay secret (not logged-in user's)
        const key_secret = recipientUser.razorpaySecret;
        
        if (!key_secret) {
            console.error("❌ Razorpay secret not configured for recipient:", recipientUser.username);
            return NextResponse.json({
                success: false,
                message: `Payment gateway not configured for ${username}. Please ask them to set up Razorpay credentials.`
            }, { status: 500 });
        }

        console.log("🔑 Using recipient's Razorpay secret for verification");

        // Create signature verification using RECIPIENT's secret
        console.log("🔐 Verifying payment signature...");
        const hmac = crypto.createHmac('sha256', key_secret);
        hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
        const generated_signature = hmac.digest('hex');

        console.log("🔍 Signature comparison:", {
            received: razorpay_signature,
            generated: generated_signature,
            match: generated_signature === razorpay_signature
        });

        // Get payer information (optional - can be guest)
        const session = await getServerSession(authOptions);
        const payerEmail = session?.user?.email || 'guest@example.com';
        
        console.log("👤 Payer info:", { email: payerEmail, isGuest: !session });

        // Save payment if signature matches
        if (generated_signature === razorpay_signature) {
            console.log("✅ Payment signature verified, saving payment...");

            const newPayment = await Payment.create({
                name: name || 'Anonymous',
                message: message || '',
                amount: parseInt(amount),
                to_user: recipientUser.username || recipientUser.name, // RECIPIENT's identifier
                from_email: payerEmail, // Payer's email (can be guest)
                razorpay_payment_id,
                razorpay_order_id,
                razorpay_signature,
                payment_status: 'completed',
                done: true,
                verified: true,
                created_at: new Date()
            });

            console.log("💾 Payment saved successfully:", newPayment._id);
            
            return NextResponse.json({
                success: true,
                verified: true,
                paymentId: newPayment._id,
                message: 'Payment verified and saved successfully'
            });

        } else {
            console.error("❌ Payment signature verification failed");
            
            // Save failed payment for audit trail
            const failedPayment = await Payment.create({
                name: name || 'Anonymous',
                message: message || '',
                amount: parseInt(amount),
                to_user: recipientUser.username || recipientUser.name,
                from_email: payerEmail,
                razorpay_payment_id,
                razorpay_order_id,
                razorpay_signature,
                payment_status: 'failed',
                done: false,
                verified: false,
                failure_reason: 'Signature verification failed',
                created_at: new Date()
            });

            console.log("❌ Failed payment logged:", failedPayment._id);
            
            return NextResponse.json({
                success: false,
                done: false,
                message: 'Payment verification failed. Please try again or contact support.'
            }, { status: 400 });
        }

    } catch (error) {
        console.error('💥 Payment verification error:', error);
        
        return NextResponse.json({
            success: false,
            message: `Server error: ${error.message}`
        }, { status: 500 });
    }
}