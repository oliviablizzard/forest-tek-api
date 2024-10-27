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

// Route to get all organizations
router.get('/', async (req, res) => {
    try {
        const organizations = await knex('organizations').select('*');
        res.status(200).json(organizations);
    } catch (error) {
        handleError(res, error);
    }
});

// Route to add a new organization
router.post('/', async (req, res) => {
    const { organization, acronym, contactTitle, contactNumber, contactEmail, webLink, logo, area } = req.body;

    // Validate all required fields
    if (!organization || !acronym || !contactTitle || !contactNumber || !contactEmail || !webLink || !logo || !area) {
        return handleError(res, new Error('All fields are required'), 400);
    }

    try {
        const [id] = await knex('organizations').insert({ organization, acronym, contactTitle, contactNumber, contactEmail, webLink, logo, area });
        res.status(201).json({ message: 'Organization added successfully', id });
    } catch (error) {
        handleError(res, error);
    }
});

// Route to update an organization by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { organization, acronym, contactTitle, contactNumber, contactEmail, webLink, logo, area } = req.body;

    if (!organization || !acronym || !contactTitle || !contactNumber || !contactEmail || !webLink || !logo || !area) {
        return handleError(res, new Error('All fields are required'), 400);
    }

    try {
        const updated = await knex('organizations').where({ id }).update({ organization, acronym, contactTitle, contactNumber, contactEmail, webLink, logo, area });
        if (updated) {
            res.status(200).json({ message: 'Organization updated successfully' });
        } else {
            handleError(res, new Error('Organization not found'), 404);
        }
    } catch (error) {
        handleError(res, error);
    }
});

// Route to delete an organization by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await knex('organizations').where({ id }).del();
        if (deleted) {
            res.status(200).json({ message: 'Organization deleted successfully' });
        } else {
            handleError(res, new Error('Organization not found'), 404);
        }
    } catch (error) {
        handleError(res, error);
    }
});

export default router;