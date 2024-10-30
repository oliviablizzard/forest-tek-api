const express = require('express');
const programController = require('../controllers/programController');

const router = express.Router();

router.get('/', programController.getAllPrograms);
router.get('/:id', programController.getProgramById);

module.exports = router;