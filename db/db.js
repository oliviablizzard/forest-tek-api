import knex from 'knex';
import knexConfig from '../knex.js';

const db = knex(knexConfig);

export default db;