import express from 'express';
import { getPrograms } from '../controllers/programController.js';

const router = express.Router();

// Route to get programs, with optional province filter
router.get('/', getPrograms);

export default router;