const db = require('../models/db');
const Joi = require('joi');
// Validation schema for adding employees
const employeeSchema = Joi.object({
    firstname: Joi.string().required().min(3).max(30),
    lastname: Joi.string().required().min(3).max(30),
    nationalId: Joi.string().required().min(16).max(16),
    telephone: Joi.string().required().min(10).max(10),
    email: Joi.string().email().required(),
    department: Joi.string().required(),
    position: Joi.string().required(),
    laptopManufacture: Joi.string().required(),
    model: Joi.string().required(),
    serialNumber: Joi.string().required(),
});

// Route for adding an employee
exports.addEmployee = async (req, res) => {
    try {
        // Validate the request body against the schema
        const {
            error,
            value
        } = employeeSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }
        //check if employee already exists in the database
        const existingEmployee = await db.query('SELECT * FROM employees WHERE nationalId = $1 OR email=$2 OR telephone=$3', [value.nationalId, value.email, value.telephone]);
        if (existingEmployee.rows.length > 0) {
            return res.status(400).json({
                message: 'Employee already exists'
            });
        }
        // Insert the employee into the database
        const query = `
      INSERT INTO employees (firstname, lastname, nationalId, telephone, email, department, position, laptopManufacture, model, serialNumber)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `;
        const values = [
            value.firstname,
            value.lastname,
            value.nationalId,
            value.telephone,
            value.email,
            value.department,
            value.position,
            value.laptopManufacture,
            value.model,
            value.serialNumber,
        ];

        await db.query(query, values);
        res.status(201).json({
            message: 'Employee added successfully'
        });
    } catch (error) {
        console.error('Error adding employee:', error);
        res.status(500).json({
            message: 'An error occurred while adding the employee'
        });
    }
};

//getting all employees
exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await db.query('SELECT * FROM employees');
        res.status(200).json({
            data: employees.rows
        });
    } catch (error) {
        console.error('Error getting employees:', error);
        res.status(500).json({
            message: 'An error occurred while getting employees'
        });
    }
}