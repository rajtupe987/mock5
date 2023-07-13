const express = require("express");

const emp_model = require("../models/addemp.model");

const employeeRouter = express.Router()



//http://localhost:7600/Dashboard/employees?page=1
employeeRouter.get('/employees', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const skip = (page - 1) * limit;

        const employees = await emp_model.find().skip(skip).limit(limit);

        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve employee data' });
    }
});



//http://localhost:7600/Dashboard/employees
employeeRouter.post('/employees', async (req, res) => {
    try {
        const { firstName, lastName, email, department, salary } = req.body;


        const newEmployee = new emp_model({
            firstName,
            lastName,
            email,
            department,
            salary,
        });


        await newEmployee.save();

        res.status(200).json({ message: "Employee added successfully " });
    } catch (error) {
        res.status(500).json({ error: "Failed to add employee" });
    }
});


// Update Employee - PUT route

//http://localhost:7600/Dashboard/;id
employeeRouter.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, department, salary } = req.body;

        const employee = await emp_model.findById(id);

        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        employee.firstName = firstName;
        employee.lastName = lastName;
        employee.email = email;
        employee.department = department;
        employee.salary = salary;


        await employee.save();

        res.status(200).json({ message: "Employee updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to update employee " });
    }
});

// Delete Employee - DELETE route

//http://localhost:7600/Dashboard/;id
employeeRouter.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const employee = await emp_model.findByIdAndDelete(id);

        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        res.status(200).json({ message: "Employee deleted successfully " });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete employee" });
    }
});




//filtering part

employeeRouter.get("/employees/filter", async (req, res) => {
    try {
        const { department } = req.query;

        const employees = await emp_model.find({ department });

        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ error: "Failed to filter employees by department" });
    }
});


//http://localhost:7600/Dashboard/employees/sort?order=desc
employeeRouter.get("/employees/sort", async (req, res) => {
    try {
        const { order } = req.query;
        const page=Number(req.query.page) || 1;
        const limit = 5;
        const skip = (page - 1) * limit;

        const sortOption = order === 'desc' ? -1 : 1;

        const employees = await emp_model.find().sort({ salary:sortOption }).skip(skip).limit(limit);

        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ error: 'Failed to sort employees by salary' });
    }
});




//http://localhost:7600/Dashboard/employees/search?firstName=lila
employeeRouter.get("/employees/search", async (req, res) => {
    try {
      const {firstName} = req.query;
  
      const employees = await emp_model.find({
        firstName: { $regex: new RegExp(firstName, 'i') },
      });
  
      res.status(200).json(employees);
    } catch (error) {
      res.status(500).json({ error:"Failed to search employees by first name"});
    }
  });
  



module.exports = { employeeRouter }