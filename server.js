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
};
function start() {
  inquirer.prompt(questions).then(function (res) {
    console.log(res);
    switch (res.action) {
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

function addRoles() {
  connection.query("SELECT * FROM departments", function (err, data) {
    if (err) throw new Error(err);
    const dep = [];
    const depId = [];
    data.forEach((element) => {
      dep.push(element.name);
      depId.push(element.id);
    });
    inquirer
      .prompt([
        {
          type: "input",
          message: "What is the title of this new role?",
          name: "title",
        },
        {
          type: "number",
          message: "What is the salary of this new role?",
          name: "salary",
        },
        {
          type: "list",
          message: "What department is this new role for?",
          name: "department",
          choices: dep,
        },
      ])
      .then(function (resp) {
        const departmentId = depId[dep.indexOf(resp.department)];
        console.log(departmentId);
        connection.query(
          "INSERT INTO roles SET?",
          {
            title: resp.title.toLowerCase(),
            salary: resp.salary,
            department_id: departmentId,
          },
          function (err) {
            if (err) throw new Error(err);
            inquirer
            .prompt({
              type: "list",
              message: `Would you like to continue adding roles?`,
              name: "confirm",
              choices: ["Yes", "No"],
            })
            .then(function (response) {      
              const respond = response.confirm;
              if (respond === "Yes") {
                addDepartments();
              } else {
                start();
              }
            });
          }
        );
      });
  });
}

function addDepartments() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "depName",
        message: "What is the name of the department?",
      },
    ])
    .then(function (res) {
      const { depName } = res;
      connection.query(
        `INSERT INTO departments SET ?`,
        {
          name: depName.toLowerCase(),
        },
        function (err) {
          if (err) throw new Error(err);
          inquirer
          .prompt({
            type: "list",
            message: `Would you like to continue adding departments?`,
            name: "confirm",
            choices: ["Yes", "No"],
          })
          .then(function (response) {      
            const respond = response.confirm;
            if (respond === "Yes") {
              addDepartments();
            } else {
              start();
            }
          });

        }
      );
    });
}

// Update functions

function updateEmployeeRoles() {}

function updateEmployeeManager() {}

// Select functions
function viewAllEmployees() {}

function viewAllEmployeeByManager() {}

function viewAllRoles() {}

function viewAllDepartments() {}

// function viewAllEmployeeByDepertment() {}

// Delete functions

function removeEmployee() {}

function removeDepartment() {}

function removeRole() {}

function promting(input) {

}
//  function to to end database connection
function exit() {
  connection.end();
}
