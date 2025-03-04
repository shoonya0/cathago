const sqlite3 = require('sqlite3').verbose();

// const db = new sqlite3.Database('database.sqlite', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
//     if (err) {
//         console.error('Error opening database: ' + err.message);
//     } else {
//         console.log('Connected to the database.');
//     }
// });

const db = new sqlite3.Database('database.sqlite');

db.serialize(() => {
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT CHECK(role IN ('regular', 'admin')) NOT NULL DEFAULT 'regular',
    credits INTEGER NOT NULL DEFAULT 20,
    last_credit_reset DATE NOT NULL DEFAULT CURRENT_DATE
)`);
});

module.exports = db;