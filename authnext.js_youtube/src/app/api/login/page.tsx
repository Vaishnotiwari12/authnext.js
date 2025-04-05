"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function LoginPage() {
    const router = useRouter();
    const [user, setUser] = React.useState({
        email: "",
        password: "",
    });
    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const onLogin = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/users/login", user);
            console.log("Login success", response.data);
            toast.success("Login success");
            router.push("/profile");
        } catch (error: any) {
            console.log("Login failed", error.message);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user.email.length > 0 && user.password.length > 0) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user]);

    return (
        <div
            className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600"
        >
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6">
                    {loading ? "Processing..." : "Login"}
                </h1>
                <hr className="mb-6" />
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                    Email
                </label>
                <input
                    className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-blue-500"
                    id="email"
                    type="text"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    placeholder="Enter your email"
                />
                <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                    Password
                </label>
                <input
                    className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-blue-500"
                    id="password"
                    type="password"
                    value={user.password}
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                    placeholder="Enter your password"
                />
                <button
                    onClick={onLogin}
                    disabled={buttonDisabled || loading}
                    className={`w-full p-2 rounded-lg text-white font-medium ${
                        buttonDisabled || loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-500 hover:bg-blue-600"
                    }`}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
                <p className="text-center mt-4 text-gray-600">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-blue-500 hover:underline">
                        Sign up here
                    </Link>
                </p>
            </div>
        </div>
    );
}