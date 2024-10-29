import express from 'express';
import knex from '../junk/knex.js';

const router = express.Router();

// Route to get programs filtered by province and search query
router.get('/', async (req, res, next) => {
    const { province, query } = req.query; // Destructure query parameters

    try {
        // Start building the query
        let queryBuilder = knex('programs').select('id', 'institution_name', 'program_name', 'program_level', 'url', 'province');

        // Filter by province if provided
        if (province) {
            queryBuilder = queryBuilder.where('province', province);
        }

        // Filter by program name if a search query is provided
        if (query) {
            queryBuilder = queryBuilder.where('program_name', 'like', `%${query}%`);
        }

        // Execute the query
        const programs = await queryBuilder;

        // Return the results
        res.status(200).json(programs);
    } catch (error) {
        console.error('Error fetching programs:', error);
        next(error); // Pass error to centralized error handler
    }
});

// Route to get 5 random programs
router.get('/random', async (req, res, next) => {
    try {
        const programs = await knex('programs')
            .select('id', 'program_name', 'institution_name', 'program_level', 'province')
            .orderByRaw('RAND()')
            .limit(5);
        
        if (!programs.length) {
            return res.status(404).json({ message: 'No programs found' });
        }

        res.status(200).json(programs);
    } catch (error) {
        console.error('Error fetching random programs:', error);
        next(error);
    }
});

export default router;



// import express from 'express';
// import knex from '../knex.js';
// import { ERROR_IMAGES } from '../constants.js';

// const router = express.Router();

// // Reusable error handler function
// const handleError = (res, error, statusCode = 500) => {
//     console.error(error);
//     res.status(statusCode).json({ 
//         error: 'An error occurred', 
//         details: error.message,
//         image: ERROR_IMAGES[statusCode] || ERROR_IMAGES.UNKNOWN 
//     });
// };

// // Route to get programs based on location
// router.get('/', async (req, res) => {
//     const { location } = req.query;
//     if (!location) {
//         return handleError(res, new Error('Location parameter is required'), 400);
//     }

//     try {
//         const programs = await knex('programs').where('location', 'like', `%${location}%`);
//         if (programs.length === 0) {
//             return res.status(404).json({
//                 message: 'No programs found for the specified location.'
//             });
//         }
//         res.status(200).json(programs);
//     } catch (error) {
//         handleError(res, error);
//     }
// });

// // Route to get 5 random programs
// router.get('/random', async (req, res) => {
//     try {
//         const programs = await knex('programs').orderByRaw('RAND()').limit(5); // Use RAND() for MySQL
//         if (programs.length === 0) {
//             return res.status(404).json({
//                 message: 'No random programs found.'
//             });
//         }
//         res.status(200).json(programs);
//     } catch (error) {
//         handleError(res, error);
//     }
// });

// // Route to get programs for the dashboard
// router.get('/dashboard', async (req, res) => {
//     try {
//         const programs = await knex('programs').orderByRaw('RANDOM()').limit(5); // Fetch 5 random programs
//         if (programs.length === 0) {
//             return res.status(404).json({
//                 message: 'No programs found.'
//             });
//         }
//         res.status(200).json(programs);
//     } catch (error) {
//         handleError(res, error);
//     }
// });

// // Route to add a new program
// router.post('/', async (req, res) => {
//     const { name, description, location, contact, website } = req.body;

//     if (!name || !description || !location || !contact || !website) {
//         return handleError(res, new Error('All fields are required'), 400);
//     }

//     try {
//         const [id] = await knex('programs').insert({ name, description, location, contact, website });
//         res.status(201).json({ message: 'Program added successfully', id });
//     } catch (error) {
//         handleError(res, error);
//     }
// });

// // Route to update a program by ID
// router.put('/:id', async (req, res) => {
//     const { id } = req.params;
//     const { name, description, location, contact, website } = req.body;

//     if (!name || !description || !location || !contact || !website) {
//         return handleError(res, new Error('All fields are required'), 400);
//     }

//     try {
//         const updated = await knex('programs').where({ id }).update({ name, description, location, contact, website });
//         if (updated) {
//             res.status(200).json({ message: 'Program updated successfully' });
//         } else {
//             handleError(res, new Error('Program not found'), 404);
//         }
//     } catch (error) {
//         handleError(res, error);
//     }
// });

// // Route to delete a program by ID
// router.delete('/:id', async (req, res) => {
//     const { id } = req.params;

//     try {
//         const deleted = await knex('programs').where({ id }).del();
//         if (deleted) {
//             res.status(200).json({ message: 'Program deleted successfully' });
//         } else {
//             handleError(res, new Error('Program not found'), 404);
//         }
//     } catch (error) {
//         handleError(res, error);
//     }
// });

// export default router;