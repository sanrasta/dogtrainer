import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// The admin user ID from your Clerk dashboard
const ADMIN_USER_ID = process.env.ADMIN_USER_ID;

export async function GET() {
  try {
    const { userId } = await auth();
    
    // Check if user is authenticated and is the admin
    if (!userId || userId !== ADMIN_USER_ID) {
      return NextResponse.json(
        { error: "Unauthorized. Only admin can access this endpoint." },
        { status: 403 }
      );
    }

    // Fetch all users from Clerk
    const users = await fetch("https://api.clerk.com/v1/users", {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    }).then(res => res.json());

    // Extract only name, last name, and email
    const userList = users.map((user: any) => ({
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email_addresses?.[0]?.email_address,
    }));

    return NextResponse.json({ users: userList });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
} 