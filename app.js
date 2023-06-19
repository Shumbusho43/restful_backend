const express = require('express');
const bodyParser = require('body-parser');
const swaggerFile = require('./swagger.json')
const swaggerUi = require("swagger-ui-express");
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 3000;
const db = require('./models/db');
// Routes
const {
    userRoute
} = require('./routes/user.routes');
const {
    employee
} = require('./routes/employee.routes');

// Middlewares
// BodyParser for parsing request body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Cookie parser for parsing cookies
app.use(cookieParser());

// CORS for cross-origin resource sharing
app.use(cors());

// XSS protection
app.use(xss());

// HPP protection
app.use(hpp());

// Registering routes
app.use('/', userRoute); // User routes
app.use('/', employee); // Employee routes
//swagger
app.use("/documentation", swaggerUi.serve, swaggerUi.setup(swaggerFile, false, {
    docExpansion: "none"
}))
// Create server
app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});

// Connect to the PostgreSQL database
db.connect();