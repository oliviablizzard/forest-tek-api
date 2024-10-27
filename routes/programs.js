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

router.get('/', async (req, res) => {
    const location = req.query.location;
    if (!location) {
        return handleError(res, new Error('Location parameter is required.'), 400);
    }

    try {
        const programs = await knex('programs').where('location', 'like', `%${location}%`);
        if (programs.length === 0) {
            return res.status(404).json({
                message: 'No programs found.',
                suggestions: alternativeSuggestions
            });
        }
        res.json(programs);
    } catch (error) {
        handleError(res, error);
    }
});

export default router;