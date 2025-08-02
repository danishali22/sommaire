import { getCurrentAppUser } from "@/lib/auth/getUser";
import { currentUser } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
    pdfUploader: f({ pdf: { maxFileSize: '32GB' } })
        .middleware(async ({ req }) => {
            try {
                try {
                    const clerkUser = await currentUser();

                    if (clerkUser) {
                        return { userId: clerkUser.id };
                    }

                    const appUser = await getCurrentAppUser();

                    if (!appUser?._id) {
                        console.log("No Clerk user or app user found");
                        throw new UploadThingError("Unauthorized");
                    }

                    return { userId: appUser._id.toString() };
                } catch (error) {
                    console.error("Middleware error:", error);
                    throw new UploadThingError("Authentication failed");
                }
            } catch (error) {
                console.error('Middleware error:', error);
                throw new UploadThingError('Authentication failed');
            }
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log('upload completed for user id', metadata.userId);
            console.log("file url", file.ufsUrl);
            return { userId: metadata.userId, file: file }
        })
} satisfies FileRouter;
export type OurFileRouter = typeof ourFileRouter;