import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv'


dotenv.config();

cloudinary.config({
    cloude_name: "dkmamqd9b",
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

export default cloudinary