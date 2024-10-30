const programModel = require('../models/programModel');

exports.getAllPrograms = async (req, res) => {
    try {
        const programs = await programModel.getAllPrograms();
        res.status(200).json(programs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching programs' });
    }
};