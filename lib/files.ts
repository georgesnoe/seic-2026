import { v2 as cloudinary } from "cloudinary";

export const uploadToCloudinary = async (file: File, folder: string) => {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder: folder, resource_type: "auto" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result?.secure_url);
        },
      )
      .end(buffer);
  });
};
