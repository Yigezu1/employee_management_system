const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "employee_db",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  start();
});

const questions = {
  type: "list",
  message: "What would you like to do next?",
  name: "action",
  choices: [
    "Add Employees",
    "Add Departments",
    "Add Roles",
    "View All Employees",
    "View All Departments",
    "View All Roles",
    "View Employee by Managers",
    "Update Employee Managers",
    "Update Employee Roles",
    "Remove Employees",
    "Remove Departments",
    "Remove Roles",
    "Exit",
  ],
}
function start() {
  inquirer
    .prompt(questions)
    .then(function (res) {
      switch (res) {
        case "Add Employees":
          addEmployees();
          break;
        case "Add Departments":
          addDepartments();
          break;

        case "Add Roles":
          addRoles();
          break;
        case "View All Employees":
          viewAllEmployees();
          break;
        case "View Employee by Managers":
          viewAllEmployeeByManager();
          break;
        case "View All Departments":
          viewAllDepartments();
          break;
        case "View All Roles":
          viewAllRoles();
          break;
        case "Update Employee Managers":
          updateEmployeeManager();
          break;
        case "Update Employee Roles":
          updateEmployeeRoles();
          break;

        case "Remove Employees":
          removeEmployee();
          break;
        case "Remove Departments":
          removeDepartment();
          break;
        case "Remove Roles":
          removeRole();
          break;
        case "Exit":
          exit();
          break;
      }
    });
}
// Add functions
function addEmployees() {}

function addRoles() {}

function addDepartments() {}

// Update functions

function updateEmployeeRoles() {}

function updateEmployeeManager() {}

// Select functions
function viewAllEmployees() {}

function viewAllEmployeeByManager() {}

function viewAllRoles() {}

function viewAllDepartments(){}

// function viewAllEmployeeByDepertment() {}


// Delete functions

function removeEmployee() {}

function removeDepartment() {}

function removeRole() {}

//  function to to end database connection
function exit() {
  connection.end();
}
