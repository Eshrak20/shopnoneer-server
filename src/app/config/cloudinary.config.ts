/* eslint-disable @typescript-eslint/no-explicit-any */

// Frontedn -> Form Data with Image File -> Multer -> Form data -> Req (Body + File)

import { v2 as cloudinary } from "cloudinary";
import AppError from "../errorHelpers/AppError";
import { envVars } from "./env";

// Amader folder -> image -> form data -> File -> Multer -> Amader project / pc te Nijer ekta folder(temporary) -> Req.file

//req.file -> cloudinary(req.file) -> url -> mongoose -> mongodb


cloudinary.config({
    cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
    api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
    api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET
})

export const deleteImageFromCLoudinary = async (url: string) => {
    try {
        const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;
        const match = url.match(regex);

        if (match && match[1]) {
            const public_id = match[1];
            await cloudinary.uploader.destroy(public_id)
            // eslint-disable-next-line no-console
            console.log(`File ${public_id} is deleted from cloudinary`);

        }
    } catch (error: any) {
        throw new AppError(401, "Cloudinary image deletion failed", error.message)
    }
}


export const cleanupCloudinaryImages = async (urls: string[]) => {
  if (!urls || urls.length === 0) return;

  await Promise.all(
    urls.map(async url => {
      try {
        const publicId = url.split("/").pop()?.split(".")[0];
        if (publicId) await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error("Cloudinary cleanup failed:", err);
      }
    })
  );
};



export const cloudinaryUpload = cloudinary

