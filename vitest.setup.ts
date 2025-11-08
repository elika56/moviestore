import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env file from project root with explicit path
const envPath = resolve(process.cwd(), '.env');
const result = config({ path: envPath });

if (result.error) {
    console.warn('Error loading .env file:', result.error);
} else {
    console.log('Loaded .env file from:', envPath);
    console.log('Environment variables loaded:', Object.keys(result.parsed || {}).length);
}

