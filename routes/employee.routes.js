const express = require('express');
const {
    addEmployee,
    getAllEmployees
} = require('../controllers/employees.controller');
const {
    protect
} = require('../middleware/protect');
const Router = express.Router();
Router.post('/employee/register', protect, addEmployee);
Router.get('/employee/all', protect, getAllEmployees)
module.exports.employee = Router