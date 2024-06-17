
const express = require('express');
const app = express();
app.use(express.json({ limit: '50mb' }));
const port = 8000;
const sqlite3 = require('sqlite3').verbose();
const dotenv = require('dotenv').config();
const db = new sqlite3.Database(process.env.DB_PATH);
const { generateToken, authenticateToken } = require('./auth');

// Allow CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.post('/login', (req, res) => {
    // The user data is actually hardcoded
    const user = {
        username: process.env.FAKE_LOGIN_USERNAME,
        password: process.env.FAKE_LOGIN_PASSWORD
    }
    // Check if it match
    if(req.body.username === user.username && req.body.password === user.password) {
        const token = generateToken(user);
        let response = {
            token: token
        }
        res.send(response);
    }else{
        res.status(403).send('Invalid credentials');
    }
})

app.get('/api/cars', authenticateToken, async (req, res) => {
    let offset = req.query.offset || 0;
    let limit = req.query.limit || 10;
    let data = [];
    await (()=>new Promise((resolve, reject)=>{
        db.serialize(() => {
            db.each(`
            SELECT
                id,
                brand,
                model,
                registrationNumber,
                notes,
                CASE
                   WHEN document IS NOT NULL AND DOCUMENT != '' THEN 1
                   ELSE 0
                END AS hasDocument,
                CASE
                   WHEN image IS NOT NULL AND image != '' THEN 1
                   ELSE 0
                END AS hasImage
            FROM cars
            LIMIT ${limit} OFFSET ${offset}
        `, (err, row) => {
                if (err) {
                    console.error(err.message);
                }
                data.push(row);
            }, () => {
                resolve(data)
            })
        })
    }))();

    let count = 0;
    await (() => new Promise((resolve, reject) => {
        db.serialize(() => {
            db.each(`
            SELECT COUNT(*) FROM cars
        `, (err, row) => {
                if (err) {
                    console.error(err.message);
                }
                count = row['COUNT(*)'];
            }, () => {
                resolve(count)
            })
        })
    }))();
    console.log("Count : " + count)
    res.send({
        "data": data,
        "count": count
    })

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
    let data = req.body;
    // Sanitize the form data
    let errors = {}
    if (!data.brand) errors.brand = 'Brand is required';
    if (!data.model) errors.model = 'Model is required';
    if (!data.registrationNumber) errors.registrationNumber = 'Registration number is required';
    // If there is any errors, return 422
    if (Object.keys(errors).length > 0) {
        return res.status(422).send(errors);
    }

    db.serialize(() => {
        db.run(`
            INSERT INTO cars (brand, model, registrationNumber, notes, document, image)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [data.brand, data.model, data.registrationNumber, data.notes, data.document, data.image])
    })
    res.send('Car added successfully!');
})

app.put('/api/cars/:id', authenticateToken, (req, res) => {
    let data = req.body;
    // Sanitize the form data
    let errors = {}
    if (!data.brand || data.brand.length === 0) errors.brand = 'Brand is required';
    if (!data.model || data.model.length === 0) errors.model = 'Model is required';
    if (!data.registrationNumber || data.model.length === 0) errors.registrationNumber = 'Registration number is required';
    // If there is any errors, return 422
    if (Object.keys(errors).length > 0) {
        return res.status(422).send(errors);
    }
    let id = req.params.id;
    db.serialize(() => {
        db.run(`
            UPDATE cars
            SET brand = ?, model = ?, registrationNumber = ?, notes = ?, document = ?, image = ?
            WHERE id = ?
        `, [data.brand, data.model, data.registrationNumber, data.notes, data.document, data.image, id])
    })
    res.send('Car updated successfully!');
})

app.delete('/api/cars/:id', authenticateToken, (req, res) => {
    let id = req.params.id;
    db.serialize(() => {
        db.run(`
            DELETE FROM cars
            WHERE id = ?
        `, [id])
    })
    res.send('Car deleted successfully!');
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})