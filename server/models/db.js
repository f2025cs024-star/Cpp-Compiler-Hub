const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '../database.sqlite');
const db = new Database(dbPath);

// Initialize database with schema
const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');
db.exec(schema);

console.log('✅ SQLite Database initialized.');

module.exports = db;
