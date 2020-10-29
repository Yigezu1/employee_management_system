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

function start() {
  inquirer
    .prompt({
      type: "list",
      message: "What would you like to do?",
      name: "action",
      choices: [
        "Add Employee",
        "Remove Employee",
        "Update Employee",
        "Update Depertment",
        "Update Role",
      ],
    })
    .then(function (ans) {
      switch (ans) {
        case "Add Employee":
          addEmployee();
          break;
        case "Remove Employee":
        case "Update Employee":
        case "Update Depertment":
        case "Update Role":
      }
    });
}

function addEmployee() {}

function addRoles() {}

function addDepartments() {}

function removeEmployee() {}

function viewAllEmployee() {}

function updateEmployeeRole() {}

function updateEmployeeManager() {}

function viewAllEmployeeByManager() {}

function viewAllEmployeeByDepertment() {}

function viewAllRoles(){}

function removeDepartment() {}

function removeRole() {}

function exit() {
  connection.end();
}
