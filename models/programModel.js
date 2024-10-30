import db from '../db/db.js';

// fetch default list of programs 
const getDefaultPrograms = (limit = 10) => {
    return db('programs')
        .select('id', 'url', 'program_name', 'institution_name', 'province')
        .limit(limit);
};

// fetch programs filtered by province
const getProgramsByProvince = (province) => {
    return db('programs')
        .select('id', 'url', 'program_name', 'institution_name', 'province')
        .where('province', province);
};

export default {
    getDefaultPrograms,
    getProgramsByProvince,
};