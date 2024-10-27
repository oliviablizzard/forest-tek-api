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
        image: ERROR_IMAGES[statusCode] || ERROR_IMAGES.UNKNOWN,
    });
};

// Route to get all tools
router.get('/', async (req, res) => {
    try {
        const tools = await knex('tools').select('*');
        res.status(200).json(tools);
    } catch (error) {
        handleError(res, error);
    }
});

// Route to get tools by keyword, type, or level
router.get('/search', async (req, res) => {
    const { keyword, type, level } = req.query;
    try {
        let query = knex('tools').select('*');

        if (keyword) {
            query = query.whereRaw('keywords @> ?', [[keyword]]);
        }
        if (type) {
            query = query.andWhere('type', type);
        }
        if (level) {
            query = query.andWhere('level', level);
        }

        const tools = await query;
        if (tools.length === 0) {
            return res.status(404).json({ message: 'No tools found matching the criteria.' });
        }
        res.status(200).json(tools);
    } catch (error) {
        handleError(res, error);
    }
});

// Route to add a new tool
router.post('/', async (req, res) => {
    const { toolName, keywords, link, type, level } = req.body;

    if (!toolName || !Array.isArray(keywords) || !link || !type || !level) {
        return handleError(res, new Error('All fields are required, and keywords must be an array'), 400);
    }

    try {
        const [id] = await knex('tools').insert({ toolName, keywords, link, type, level });
        res.status(201).json({ message: 'Tool added successfully', id });
    } catch (error) {
        handleError(res, error);
    }
});

// Route to update a tool by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { toolName, keywords, link, type, level } = req.body;

    if (!toolName || !Array.isArray(keywords) || !link || !type || !level) {
        return handleError(res, new Error('All fields are required, and keywords must be an array'), 400);
    }

    try {
        const updated = await knex('tools').where({ id }).update({ toolName, keywords, link, type, level });
        if (updated) {
            res.status(200).json({ message: 'Tool updated successfully' });
        } else {
            handleError(res, new Error('Tool not found'), 404);
        }
    } catch (error) {
        handleError(res, error);
    }
});

// Route to delete a tool by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await knex('tools').where({ id }).del();
        if (deleted) {
            res.status(200).json({ message: 'Tool deleted successfully' });
        } else {
            handleError(res, new Error('Tool not found'), 404);
        }
    } catch (error) {
        handleError(res, error);
    }
});

export default router;