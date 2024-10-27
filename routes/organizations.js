import express from 'express';
import knex from '../knex.js';
import { ERROR_IMAGES } from '../constants.js';

const router = express.Router();

const handleError = (res, error, statusCode = 500) => {
    console.error(error);
    const imageUrl = ERROR_IMAGES[statusCode] || ERROR_IMAGES.UNKNOWN;
    res.status(statusCode).json({ 
        error: 'An error occurred', 
        details: error.message,
        image: imageUrl 
    });
};

router.get('/', async (req, res) => {
    try {
        const rows = await knex('organizations').select('*');
        res.status(200).json(rows);
    } catch (error) {
        handleError(res, error);
    }
});

router.put('/', async (req, res) => {
    const { organization, acronym, contactTitle, contactNumber, contactEmail, webLink, logo, area } = req.body;

    if (!organization || !acronym || !contactTitle || !contactNumber || !contactEmail || !webLink || !logo || !area) {
        return handleError(res, new Error('All fields are required'), 400);
    }

    try {
        await knex('organizations').insert({ organization, acronym, contactTitle, contactNumber, contactEmail, webLink, logo, area });
        res.status(201).json({ message: 'Organization added successfully' });
    } catch (error) {
        handleError(res, error);
    }
});

export default router;