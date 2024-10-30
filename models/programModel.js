const db = require('../db/db');

const getAllPrograms = () => db('programs').select('*');
const getProgramById = (id) => db('programs').where({ id }).first();

module.exports = { getAllPrograms, getProgramById };