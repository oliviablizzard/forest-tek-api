import express from 'express';
import knex from '../knex.js';
import { ERROR_IMAGES } from '../constants.js';

const router = express.Router();

// Reusable error handler function
const handleError = (res, error, statusCode = 500) => {
    console.error(error);
    res.status(statusCode).json({ 
        error: 'An error occurred', 
        details: error.message,
        image: ERROR_IMAGES[statusCode] || ERROR_IMAGES.UNKNOWN 
    });
};

// Route to get programs based on location
router.get('/', async (req, res) => {
    const { location } = req.query;
    if (!location) {
        return handleError(res, new Error('Location parameter is required'), 400);
    }

    try {
        const programs = await knex('programs').where('location', 'like', `%${location}%`);
        if (programs.length === 0) {
            return res.status(404).json({
                message: 'No programs found for the specified location.'
            });
        }
        res.status(200).json(programs);
    } catch (error) {
        handleError(res, error);
    }
});

// Route to add a new program
router.post('/', async (req, res) => {
    const { name, description, location, contact, website } = req.body;

    if (!name || !description || !location || !contact || !website) {
        return handleError(res, new Error('All fields are required'), 400);
    }

    try {
        const [id] = await knex('programs').insert({ name, description, location, contact, website });
        res.status(201).json({ message: 'Program added successfully', id });
    } catch (error) {
        handleError(res, error);
    }
});

// Route to update a program by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, location, contact, website } = req.body;

    if (!name || !description || !location || !contact || !website) {
        return handleError(res, new Error('All fields are required'), 400);
    }

    try {
        const updated = await knex('programs').where({ id }).update({ name, description, location, contact, website });
        if (updated) {
            res.status(200).json({ message: 'Program updated successfully' });
        } else {
            handleError(res, new Error('Program not found'), 404);
        }
    } catch (error) {
        handleError(res, error);
    }
});

// Route to delete a program by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await knex('programs').where({ id }).del();
        if (deleted) {
            res.status(200).json({ message: 'Program deleted successfully' });
        } else {
            handleError(res, new Error('Program not found'), 404);
        }
    } catch (error) {
        handleError(res, error);
    }
});

export default router;