const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  firstName: {type: String,required: true},
  lastName:{type: String,required: true},
  email: {type: String,required: true,unique: true},
  department: {type: String,enum: ["Tech", "Marketing", "Operations"],required: true},
  salary: {type: Number, required: true},
},{__v:false});

const emp_model = mongoose.model("Employee", employeeSchema);

module.exports = emp_model;
