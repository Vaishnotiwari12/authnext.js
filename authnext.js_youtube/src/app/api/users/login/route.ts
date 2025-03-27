import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel"; // Ensure this is uncommented and correctly imported
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifyToken } from "@/utils/verifyToken";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { email, password } = reqBody;
        console.log(reqBody);

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "User does not exist" }, { status: 400 });
        }
        console.log("User exists");

        // Check if password is correct
        const validPassword = await bcryptjs.compare(password, user.password);
        if (!validPassword) {
            return NextResponse.json({ error: "Invalid password" }, { status: 400 });
        }
        console.log("Password is valid");

        // Ensure TOKEN_SECRET is defined
        if (!process.env.TOKEN_SECRET) {
            throw new Error("TOKEN_SECRET is not defined in the environment variables");
        }

        // Create token data
        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email,
        };

        // Create token
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, { expiresIn: "1d" });

        // Create response
        const response = NextResponse.json({
            message: "Login successful",
            success: true,
        });

        // Set token in cookies
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60, // 1 day
        });

        return response;
    } catch (error: any) {
        console.error("Error in login route:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        // Get the token from cookies or headers
        const token = request.cookies.get("token")?.value || request.headers.get("Authorization")?.split(" ")[1];

        if (!token) {
            return NextResponse.json({ error: "Token is missing" }, { status: 401 });
        }

        // Verify the token
        const userData = verifyToken(token);

        if (!userData) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
        }

        // Token is valid, proceed with the request
        return NextResponse.json({ message: "Token is valid", user: userData });
    } catch (error: any) {
        console.error("Error verifying token:", error.message);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

const token = jwt.sign(
    { id: "123", username: "testuser", email: "test@example.com" },
    process.env.TOKEN_SECRET!,
    { expiresIn: "1d" }
);

console.log("Generated Token:", token);

const decoded = {
    "id": "123",
    "username": "testuser",
    "email": "test@example.com",
    "iat": 1234567890,
    "exp": 1234567890
};
console.log("Decoded Token:", decoded);