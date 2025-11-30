import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath: string) => {
  try {
    if (!localFilePath) return null;
    console.log('Attempting to upload file:', localFilePath);

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
    });
    console.log('Cloudinary upload response:', response);

    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export const deleteFromCloudinary = async (publicId: string) => {
  console.log(publicId);
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image',
    });
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
  }
};
