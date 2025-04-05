import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { email, password, username } = reqBody;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        // Hash the password
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Create the user
        const newUser = new User({
            email,
            password: hashedPassword,
            username,
        });
        await newUser.save();

        return NextResponse.json({ message: "Signup successful", success: true });
    } catch (error: any) {
        console.error("Error in signup route:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}




