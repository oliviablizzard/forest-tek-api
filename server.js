import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import knex from './knex.js';

const { PORT } = process.env;
const app = express();

app.use(cors());
app.use(express.json());

// Error image mappings
const errorImages = {
    400: 'https://http.dog/400.jpg',
    404: 'https://http.dog/404.jpg',
    500: 'https://http.dog/500.jpg',
};

const handleError = (res, error, statusCode = 500) => {
    console.error(error);
    const imageUrl = errorImages[statusCode] || 'https://http.dog/unknown.jpg';
    res.status(statusCode).json({ 
        error: 'An error occurred', 
        details: error.message,
        image: imageUrl 
    });
};

app.get('/organizations', async (req, res) => {
    try {
        const rows = await knex('organizations').select('*');
        res.status(200).json(rows);
    } catch (error) {
        handleError(res, error);
    }
});

app.get('/programs', async (req, res) => {
    const location = req.query.location;
    if (!location) {
        return handleError(res, new Error('Location parameter is required.'), 400);
    }

    try {
        const programs = await knex('programs').where('location', 'like', `%${location}%`);
        if (programs.length === 0) {
            return handleError(res, new Error('No programs found.'), 404);
        }
        res.json(programs);
    } catch (error) {
        handleError(res, error);
    }
});

app.put('/organizations', async (req, res) => {
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

app.post('/api/suggestions', async (req, res) => {
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

app.get('/api/suggestions', async (req, res) => {
    try {
        const suggestions = await knex('suggestions').select('*');
        res.status(200).json(suggestions);
    } catch (error) {
        handleError(res, error);
    }
});

app.listen(PORT, () => {
    console.log(`Server listening at PORT ${PORT}`);
});