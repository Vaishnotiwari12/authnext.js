import jwt from "jsonwebtoken";
 // Adjust the relative path

export function verifyToken(token: string): { id: string; username: string; email: string } | null {
    try {
        if (!process.env.TOKEN_SECRET) {
            throw new Error("TOKEN_SECRET is not defined in the environment variables");
        }

        const decoded = jwt.verify(token, process.env.TOKEN_SECRET) as {
            id: string;
            username: string;
            email: string;
        };

        return decoded;
    } catch (error) {
        if (error instanceof Error) {
            console.error("Invalid token:", error.message);
        } else {
            console.error("Invalid token:", error);
        }
        return null;
    }
}