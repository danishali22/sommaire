import { auth } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/db";
import {IUser, User} from "@/models/User";

export async function getCurrentAppUser() {
    const { userId } = await auth();

    if (!userId) return null;

    await connectToDatabase();

    const user = await User.findOne({ clerkUserId: userId });

    return user ? (user.toObject() as IUser) : null;
}
