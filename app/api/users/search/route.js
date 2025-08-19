import { NextResponse } from "next/server";
import connectDb from "@/db/connectDb";
import User from "@/models/User";

export async function GET(req) {
  try {
    // Get search query from URL parameters
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    // Validate query
    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      }, { status: 400 });
    }

    // Connect to database
    await connectDb();

    // Create case-insensitive search regex
    const searchRegex = new RegExp(query.trim(), 'i');

    // Search users with multiple field matching
    const users = await User.find({
      $or: [
        { username: searchRegex },
        { name: searchRegex },
        { email: searchRegex }
      ],
      // Only return users who have usernames (can receive payments)
      username: { $exists: true, $ne: null, $ne: '' }
    })
    .select('username name email profilePic createdAt') // Only return necessary fields
    .limit(10) // Limit results for performance
    .lean(); // Return plain objects for better performance

    // Clean and format results
    const cleanResults = users.map(user => ({
      username: user.username,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic || null,
      createdAt: user.createdAt
    }));

    console.log(`🔍 User search for "${query}" returned ${cleanResults.length} results`);

    return NextResponse.json({
      success: true,
      users: cleanResults,
      count: cleanResults.length
    });

  } catch (error) {
    console.error('❌ User search error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Search failed. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

// Optional: Add POST method for more complex search queries
export async function POST(req) {
  try {
    const body = await req.json();
    const { query, filters = {}, limit = 10 } = body;

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      }, { status: 400 });
    }

    await connectDb();

    const searchRegex = new RegExp(query.trim(), 'i');
    
    // Build search criteria
    let searchCriteria = {
      $or: [
        { username: searchRegex },
        { name: searchRegex },
        { email: searchRegex }
      ],
      username: { $exists: true, $ne: null, $ne: '' }
    };

    // Add additional filters if provided
    if (filters.hasRazorpay) {
      searchCriteria.razorpayId = { $exists: true, $ne: null, $ne: '' };
    }

    if (filters.hasProfilePic) {
      searchCriteria.profilePic = { $exists: true, $ne: null, $ne: '' };
    }

    const users = await User.find(searchCriteria)
      .select('username name email profilePic createdAt razorpayId')
      .limit(Math.min(limit, 20)) // Cap at 20 results max
      .sort({ createdAt: -1 }) // Most recent users first
      .lean();

    const cleanResults = users.map(user => ({
      username: user.username,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic || null,
      createdAt: user.createdAt,
      canReceivePayments: !!(user.razorpayId)
    }));

    return NextResponse.json({
      success: true,
      users: cleanResults,
      count: cleanResults.length,
      query: query.trim()
    });

  } catch (error) {
    console.error('❌ Advanced user search error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Search failed. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}