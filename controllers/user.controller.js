//register user with postam controller
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/db');

exports.createUser = async (req, res) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'Endpoint to register a new admin user'
    try {
        const {
            email,
            password,
            names,
            reEnterPassword
        } = req.body;
        //validate if all fields are provided
        if (!email || !password || !names || !reEnterPassword) {
            return res.status(400).json({
                message: 'Please provide all fields'
            });
        }
        // Check if password and reEnterPassword match
        if (password !== reEnterPassword) {
            return res.status(400).json({
                message: 'Passwords do not match'
            });
        }
        //validating email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            return res.status(400).json({
                message: 'Invalid email'
            });
        }
        // Check if user already exists in the database
        const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save the user to the database
        await db.query('INSERT INTO users (email, password,names) VALUES ($1, $2,$3)', [email, hashedPassword, names]);

        res.status(201).json({
            message: 'User created successfully'
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            message: 'An error occurred while creating the user'
        });
    }
};

//login
exports.login = async (req, res) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'Endpoint to login an admin'
    try {
        const {
            email,
            password
        } = req.body;

        // Check if user exists in the database
        const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordMatch = await bcrypt.compare(password, user.rows[0].password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

        // Generate a JWT token
        const token = jwt.sign({
            userId: user.rows[0].id
        }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.status(200).json({
            message: 'Login successful',
            token
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({
            message: 'An error occurred while logging in'
        });
    }
};