import React from "react";
import { redirect } from "next/navigation"; // used for redirecting
import connectDb from "@/db/connectDb";
import User from "@/models/User";
import Username from "@/components/Username";
import NotFoundPage from "@/components/NotFoundPage";

const page = async ({ params }) => {
  await connectDb();

  const identifier = decodeURIComponent(params.username); // decode the URL part
  console.log("Identifier from URL:", identifier);

  // Try to find the user by username (exact match)
  const userByUsername = await User.findOne({ username: identifier }).lean();

  if (userByUsername) {
    return <Username />;
  }

  // If not found by username, try finding by name (case-insensitive)
  const userByName = await User.findOne({
    name: { $regex: `^${identifier}$`, $options: "i" },
  }).lean();

  if (userByName && userByName.username) {
    // Redirect to the proper username-based route
    return redirect(`/${userByName.username}`);
  }

  // If no user found at all
  return <NotFoundPage username={identifier} />;
};

export default page;
