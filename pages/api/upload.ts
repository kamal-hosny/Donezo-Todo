import { v2 as cloudinary } from "cloudinary";
import { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm } from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

// ضبط Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const form = new IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing form data:", err);
        return res.status(500).json({ message: "Error parsing form data" });
      }

      console.log("Received files:", files); // تحقق من الملفات المستلمة

      const file = files.file?.[0]; // تأكد أن الاسم متطابق مع FormData
      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const result = await cloudinary.uploader.upload(file.filepath, {
        folder: "uploads",
        resource_type: "image",
      });

      return res.status(200).json({
        url: result.secure_url,
        publicId: result.public_id,
      });
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ message: "Upload failed" });
  }
}
