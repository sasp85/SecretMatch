import mysql from 'mysql2';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const requiredDbEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missingDbEnvVars = requiredDbEnvVars.filter((key) => !process.env[key]);

if (missingDbEnvVars.length > 0) {
  console.error(
    `Missing required database environment variables: ${missingDbEnvVars.join(', ')}. Check your .env file.`,
  );
  process.exit(1);
}

export const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL');
});
