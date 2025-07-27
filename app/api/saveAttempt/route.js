import { NextResponse } from "next/server";
import connectDb from "@/db/connectDb";
import Payment from "@/models/Payment";

export async function POST(req) {
  try {
    await connectDb();
    const data = await req.json();

    // Validate at least username and amount
    if (!data.username || !data.amount) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // Save attempt without signature verification
    const attempt = await Payment.create({
      name: data.name || "Guest User",
      message: data.message || "",
      amount: parseInt(data.amount),
      to_user: data.username,
      oid: data.razorpay_order_id || "N/A",
      payment_status: data.status || "pending", // pending or cancelled
      done: false,
      verified: false,
      created_at: new Date(),
    });

    return NextResponse.json({ success: true, attemptId: attempt._id });
  } catch (error) {
    console.error("Error saving payment attempt:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
