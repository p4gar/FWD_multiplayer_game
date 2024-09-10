const express = require('express');
const app = express();
const path = require('path');
const { createPool } = require('mysql');
const bcrypt = require('bcrypt');
const { Server } = require('socket.io');
const http = require('http');

const server = http.createServer(app);

const io = new Server(server);

// Configure MySQL connection pool
const pool = createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'python-memory-card-game',
    connectionLimit: 10
});

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set views and template engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Routes
app.get('/login', (req, res) => {
    const success = req.query.success === 'true'; // Check if registration was successful
    const message = req.query.message === 'true';

    res.render('login', { success, message });
});

app.get('/register', (req, res) => {
    res.render('register');
});

// Login Route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Query the database to find the user by username
    pool.query('SELECT * FROM accounts WHERE username = ?', [username], (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return res.status(500).send('Server error');
        }

        if (results.length === 0) {
            // If no user is found, render the login page with an error message
            return res.redirect('/login?message=Invalid credentials');
        }

        const user = results[0];

        // Compare the entered password with the hashed password in the database
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Bcrypt compare error:', err);
                return res.status(500).send('Server error');
            }

            if (isMatch) {
                res.render('index');
            } else {
                // Render the login page with an error message for invalid credentials
                res.redirect(`/login?message=true`);
            }
        });
    });
});


// Register Route
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    // Proceed with hashing the password and inserting into the database
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.error('Bcrypt hash error:', err);
            return res.status(500).send('Server error');
        }

        pool.query('INSERT INTO accounts (username, password) VALUES (?, ?)', [username, hashedPassword], (error) => {
            if (error) {
                console.error('Database insert error:', error);
                return res.status(500).send('Server error');
            }

            res.redirect('/login?success=true');
        });
    });
});

// Start the server
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
    console.log('type localhost:3000 to access!');
});
