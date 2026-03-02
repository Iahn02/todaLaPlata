import { router, publicProcedure } from "../trpc";
import { clerkClient } from "@clerk/nextjs/server";

export const authRouter = router({
    // DEV ONLY: Generate a sign-in token for quick mobile login
    devSignInToken: publicProcedure.query(async () => {
        if (process.env.NODE_ENV === "production") {
            throw new Error("Dev login is not available in production.");
        }

        const clerk = await clerkClient();

        // Find the user by email
        const users = await clerk.users.getUserList({
            emailAddress: ["ithanvera423@gmail.com"],
            limit: 1,
        });

        if (users.data.length === 0) {
            throw new Error("User ithanvera423@gmail.com not found in Clerk.");
        }

        const userId = users.data[0].id;

        // Create a sign-in token
        const signInToken = await clerk.signInTokens.createSignInToken({
            userId,
            expiresInSeconds: 300, // 5 minutes
        });

        return {
            token: signInToken.token,
            userId,
        };
    }),
});
