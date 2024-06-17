
const express = require('express');
const app = express();
app.use(express.json());
const port = 8000;
const sqlite3 = require('sqlite3').verbose();
const dotenv = require('dotenv').config();
const db = new sqlite3.Database(process.env.DB_PATH);
const { generateToken, authenticateToken } = require('./auth');

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.get('/login', (req, res) => {
    // The user data is actually hardcoded
    const user = {
        username: process.env.FAKE_LOGIN_USERNAME,
        password: process.env.FAKE_LOGIN_PASSWORD
    }
    // Check if it match
    if(req.body.username === user.username && req.body.password === user.password) {
        const token = generateToken(user);
        res.send(token);
    }else{
        res.status(403).send('Invalid credentials');
    }
})

app.get('/api/cars', authenticateToken, (req, res) => {
    let offset = req.query.offset || 0;
    let limit = req.query.limit || 10;
    let data = [];
    db.serialize(() => {
        db.each(`
            SELECT * FROM cars
            LIMIT ${limit} OFFSET ${offset}
        `, (err, row) => {
            if (err) {
                console.error(err.message);
            }
            data.push(row);
        }, () => {
            res.send(data);
        })
    })
    let count = 0;
    db.serialize(() => {
        db.each(`
            SELECT COUNT(*) FROM cars
        `, (err, row) => {
            if (err) {
                console.error(err.message);
            }
            count = row['COUNT(*)'];
        }, () => {
            console.log(`Total number of cars: ${count}`);
        })
    })
    return {
        "data": data,
        "count": count
    }

})

app.get('/api/cars/:id', authenticateToken, (req, res) => {
    let id = req.params.id;
    let data = {};
    db.serialize(() => {
        db.each(`
            SELECT * FROM cars
            WHERE id = ${id}
        `, (err, row) => {
            if (err) {
                console.error(err.message);
            }
            data = row;
        }, () => {
            res.send(data);
        })
    })
    return data;
})

app.post('/api/cars', authenticateToken, (req, res) => {
    // The data is JSON encoded
    let data = req.body;
    db.serialize(() => {
        db.run(`
            INSERT INTO cars (brand, model, registrationNumber, notes, document, image)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [data.brand, data.model, data.registrationNumber, data.notes, data.document, data.image])
    })
    res.send('Car added successfully!');
    /** Example data =
     *
     */
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})