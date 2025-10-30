import express from 'express';
import { imageController } from '../controllers/imageController.js';
import { authMiddleware } from '../middleware/auth.js'; // Assuming you have authentication middleware

const router = express.Router();

// Get all unique categories (public route)
router.get('/categories', imageController.getCategories);

// Get images by category (public route)
router.get('/', imageController.getImagesByCategory);

// Upload new image (protected route)
router.post('/upload', 
    authMiddleware.protect,  // Ensure user is authenticated
    imageController.uploadImage
);

export default router;