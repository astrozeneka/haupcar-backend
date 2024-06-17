
const sqlite3 = require('sqlite3').verbose();
const dotenv = require('dotenv').config();
const db = new sqlite3.Database(process.env.DB_PATH);

db.serialize(() => {
    /** Create the database and data structures if they don't exist */
    db.run(`
        CREATE TABLE IF NOT EXISTS cars (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            brand TEXT,
            model TEXT,
            registrationNumber TEXT,
            notes TEXT,
            document TEXT,
            image TEXT
        )
    `)
})

console.log("Database initialized successfully!")