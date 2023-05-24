import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
	user: process.env.USERNAME,
	password: process.env.PASSWORD,
	host: process.env.HOST,
	port: parseInt(process.env.DBPORT || '5432', 10),
	database: 'todo_app'
});

export default pool;
