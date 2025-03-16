import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dtuowfx81',
  api_key: process.env.CLOUDINARY_API_KEY || '512552726913518',
  api_secret: process.env.CLOUDINARY_API_SECRET || '7kWtGh1oNXw8r29aFxIvvMqMhqI'
});

export default cloudinary.v2;
