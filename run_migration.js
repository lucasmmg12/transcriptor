const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function main() {
  const client = new Client({
    connectionString: 'postgresql://postgres:07052812Mv.@db.kpfhkmzgrytxbntjazlz.supabase.co:5432/postgres'
  });

  try {
    await client.connect();
    console.log('Connected to DB');
    const sql = fs.readFileSync(path.join(__dirname, 'supabase-growiq.sql'), 'utf-8');
    await client.query(sql);
    console.log('Migration executed successfully');
  } catch (e) {
    console.error('Error executing migration', e);
  } finally {
    await client.end();
  }
}

main();
