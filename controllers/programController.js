import programModel from '../models/programModel.js';

export const getPrograms = async (req, res) => {
    try {
        const { province } = req.query;

        let programs;
        if (province) {
            programs = await programModel.getProgramsByProvince(province);
        } else {
            programs = await programModel.getDefaultPrograms();
        };

        res.status(200).json(programs);
    } catch (error) {
        console.error("Error fetching programs:", error);
        res.status(500).json({ message: "Error fetching programs" });
    }
};