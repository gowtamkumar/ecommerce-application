import { getDBConnection } from './src/config/db';

async function fixSequence() {
  try {
    const connection = await getDBConnection();
    console.log("Connected to DB");
    
    // Check max id
    const result = await connection.query('SELECT MAX(id) as max_id FROM files');
    const maxId = result[0].max_id || 0;
    console.log(`Max ID in files table: ${maxId}`);

    // Reset sequence
    // Note: The sequence name is usually files_id_seq. If TypeORM used a different one, we might need to find it.
    // But files_id_seq is the standard Postgres default for table 'files' column 'id' SERIAL.
    await connection.query(`SELECT setval('files_id_seq', ${maxId})`);
    console.log("Sequence 'files_id_seq' reset successfully");
    
    process.exit(0);
  } catch (error) {
    console.error("Error fixing sequence:", error);
    process.exit(1);
  }
}

fixSequence();
