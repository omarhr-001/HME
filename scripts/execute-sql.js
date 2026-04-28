import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSQLScripts() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('✓ Connected to PostgreSQL');

    // Read and execute schema script
    const schemaPath = path.join(__dirname, '01-init-schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('\nExecuting schema creation...');
    await client.query(schemaSQL);
    console.log('✓ Schema created successfully');

    // Read and execute seed script
    const seedPath = path.join(__dirname, '02-seed-data.sql');
    const seedSQL = fs.readFileSync(seedPath, 'utf8');
    
    console.log('\nExecuting seed data...');
    await client.query(seedSQL);
    console.log('✓ Seed data inserted successfully');

    console.log('\n✅ Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runSQLScripts();
