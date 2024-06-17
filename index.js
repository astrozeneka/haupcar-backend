
const express = require('express');
const app = express();
const port = 3000;
const sqlite3 = require('sqlite3').verbose();
const dotenv = require('dotenv').config();
const db = new sqlite3.Database(process.env.DB_PATH);


app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})