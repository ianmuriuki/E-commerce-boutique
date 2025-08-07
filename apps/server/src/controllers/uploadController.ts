import { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadImage = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError('Please upload an image', 400);
  }

  // Convert buffer to base64
  const b64 = Buffer.from(req.file.buffer).toString('base64');
  const dataURI = `data:${req.file.mimetype};base64,${b64}`;

  // Upload to Cloudinary
  const result = await cloudinary.uploader.upload(dataURI, {
    folder: 'luxora',
    resource_type: 'auto',
  });

  res.status(200).json({
    success: true,
    url: result.secure_url,
    publicId: result.public_id,
  });
});

export const deleteImage = catchAsync(async (req: Request, res: Response) => {
  const { publicId } = req.params;

  if (!publicId) {
    throw new AppError('No image ID provided', 400);
  }

  // Delete from Cloudinary
  await cloudinary.uploader.destroy(publicId);

  res.status(200).json({
    success: true,
    message: 'Image deleted successfully',
  });
});
