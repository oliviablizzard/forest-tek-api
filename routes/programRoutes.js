import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
    res.send('List of programs');
});

export default router;