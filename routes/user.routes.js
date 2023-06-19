const express = require('express');
const Router = express.Router();
const {
    createUser,
    login
} = require('../controllers/user.controller');
Router.post('/user/register', createUser);
Router.post('/user/login', login);
module.exports.userRoute = Router;