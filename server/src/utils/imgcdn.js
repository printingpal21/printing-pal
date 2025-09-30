import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

const required = ["CLOUDINARY_CLOUD_NAME","CLOUDINARY_API_KEY","CLOUDINARY_API_SECRET"];
for (const k of required) {
  if (!process.env[k]) console.warn(`[Printing Pal] Missing ${k} in server/.env`);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

export async function uploadToImgCDN(buffer, filename = "upload", mimetype = "application/octet-stream") {
  return new Promise((resolve, reject) => {
    const folder = process.env.CLOUDINARY_FOLDER || "printing-pal";
    const publicId = (filename?.split(".")[0] || "upload") + "-" + Date.now();

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: "auto",
        use_filename: true,
        unique_filename: false,
        overwrite: false,
        context: { source: "printing-pal" },
      },
      (err, result) => {
        if (err) return reject(err);
        resolve(result?.secure_url);
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
}
