import express from 'express';
import knex from '../knex.js';
import { ERROR_IMAGES } from '../constants.js';

const router = express.Router();

const handleError = (res, error, statusCode = 500) => {
    console.error(error);
    const imageUrl = ERROR_IMAGES[statusCode] || 'https://http.dog/unknown.jpg';
    res.status(statusCode).json({ 
        error: 'An error occurred', 
        details: error.message,
        image: imageUrl 
    });
};

router.post('/', async (req, res) => {
    const { programName, institutionName, location, message } = req.body;

    if (!programName || !institutionName || !location || !message) {
        return handleError(res, new Error('All fields are required'), 400);
    }

    try {
        await knex('suggestions').insert({ program_name: programName, institution_name: institutionName, location, message });
        res.status(201).json({ message: 'Suggestion submitted successfully' });
    } catch (error) {
        handleError(res, error);
    }
});

router.get('/', async (req, res) => {
    try {
        const suggestions = await knex('suggestions').select('*');
        res.status(200).json(suggestions);
    } catch (error) {
        handleError(res, error);
    }
});

export default router;