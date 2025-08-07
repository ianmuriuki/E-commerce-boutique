import express from 'express';
import { uploadImage, deleteImage } from '../controllers/uploadController';
import { protect } from '../middlewares/auth';
import { upload } from '../config/multer';

const router = express.Router();

router.use(protect); // Protect all upload routes

router.post('/', upload.single('image'), uploadImage);
router.delete('/:publicId', deleteImage);

export default router;
