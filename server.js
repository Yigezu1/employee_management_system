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
function addEmployees() {
  const deptT = [];
  const deptId = [];
  const rolesT = [];
  const emplFn = [];
  const emplFirstN = [];
  const emplLastN = [];

  connection.query("SELECT * FROM departments", function (err, data) {
    if (err) throw new Error(err);
    data.forEach((element) => {
      deptT.push(element.name);
      deptId.push(element.id);
    });
    rolesQuery();
  });
  function rolesQuery() {
    connection.query("SELECT DISTINCT(title) FROM roles", function (err, data) {
      if (err) throw new Error(err);
      data.forEach((element) => {
        rolesT.push(element.title);
      });
      employeeQuery();
    });
  }

  function employeeQuery() {
    connection.query(
      `SELECT DISTINCT(concat(first_name ,' ',last_name)) manager, id, first_name, last_name FROM employees;`,
      function (err, data) {
        if (err) throw new Error(err);
        data.forEach((element) => {
          emplFn.push(element.manager);
          emplFirstN.push(element.first_name);
          emplLastN.push(element.last_name);
        });
        emplFn.push("None");
        addNewEmp();
      }
    );
  }

  function addNewEmp() {
    inquirer
      .prompt([
        {
          type: "input",
          name: "first_name",
          message: "What is the first name of the employee?",
          validate: function (value) {
            if (value.trim() === "") {
              return false;
            }
            return true;
          },
        },
        {
          type: "input",
          name: "last_name",
          message: "What is the last name of the employee?",
          validate: function (value) {
            if (value.trim() === "") {
              return false;
            }
            return true;
          },
        },

        {
          type: "list",
          message: "What is the department of the new employee?",
          name: "department",
          choices: deptT,
        },
        {
          type: "list",
          message: "What is the role of the new employee?",
          name: "role",
          choices: rolesT,
        },
        {
          type: "list",
          message: "Who is the manager of this new employee?",
          name: "manager",
          choices: emplFn,
        },
      ])
      .then(function (resp) {
        //  andd code here
        const fname = resp.first_name.trim();
        const lname = resp.last_name.trim();
        const deprtId = deptId[deptT.indexOf(resp.department)];
        const role = resp.role;
        const empManager = resp.manager;
        let manIndex = emplFn.indexOf(empManager);
        let managerID = "";

        connection.query(
          `SELECT * FROM roles WHERE title = ? AND department_id = ?`,
          [role, deprtId],
          // {
          //   title: role,
          //   department_id: deprtId,
          // },
          function (err, data) {
            if (err) throw new Error(err);
            const roleId = data[0].id;
            if (manIndex === emplFirstN.length) {
              connection.query(
                `INSERT INTO employees SET?`,
                {
                  first_name: fname,
                  last_name: lname,
                  role_id: roleId,
                },
                function (err) {
                  if (err) throw new Error(err);
                  // some code here
                  console.log("Employee successfully added!");
                  whatNext();
                }
              );
            } else {
              const managerFirstName = emplFirstN[manIndex];
              const managerLastName = emplLastN[manIndex];

              connection.query(
                "SELECT id FROM employees WHERE first_name = ? AND last_name = ? AND role_id = ?",
                [managerFirstName, managerLastName, roleId],
                // {
                //   first_name: managerFirstName,
                //   last_name: managerLastName,
                //   role_id: roleId,
                // },
                function (err, data) {
                  if (err) throw new Error(err);
                  if (data.length === 1) {
                    managerID = data[0].id;
                    connection.query(
                      `INSERT INTO employees SET?`,
                      {
                        first_name: fname,
                        last_name: lname,
                        role_id: roleId,
                        manager_id: managerID,
                      },
                      function (err) {
                        if (err) throw new Error(err);
                        // some code here
                        console.log("Employee successfully added!");
                        whatNext();
                      }
                    );
                  } else if (data.length > 1) {
                    //  code here if there are more than one manager with that information
                    const managerIdArray = [];
                    data.forEach((element) => {
                      managerIdArray.push(element.id);
                    });
                    inquirer
                      .prompt({
                        type: "list",
                        name: "man_id",
                        message:
                          "What is the id of the manager for this new employee?",
                        choices: managerIdArray,
                      })
                      .then(function (res) {
                        managerID = res.man_id;
                        connection.query(
                          "INSERT INTO employees SET?",
                          {
                            first_name: fname,
                            last_name: lname,
                            role_id: roleId,
                            manager_id: managerID,
                          },
                          function (err) {
                            if (err) throw new Error(err);
                            // code here after finishing adding employee
                            console.log("Employee successfully added!");
                            whatNext();
                          }
                        );
                      });
                  } else {
                    // if manager removed during the process handles here
                    console.log(
                      new Error(
                        "Manager couldn't be found with the provided information!"
                      )
                    );
                    whatNext();
                  }
                }
              );
            }
          }
        );
      });
    // after finising adding the employee what next?
    function whatNext() {
      inquirer
        .prompt({
          type: "list",
          message: `Would you like to continue adding employees?`,
          name: "confirm",
          choices: ["Yes", "No"],
        })
        .then(function (response) {
          const respond = response.confirm;
          if (respond === "Yes") {
            addEmployees();
          } else {
            start();
          }
        });
    }
  }
}

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
function viewAllEmployees() {
  const allEmp = [];
  connection.query(
    `SELECT employees.first_name AS 'First Name', employees.last_name AS 'Last Name', roles.title AS Role FROM employees LEFT JOIN roles ON employees.role_id = roles.id`,
    function (err, data) {
      if(err) throw new Error(err);
     console.log(cTable.getTable(data));
      start();
    }
  );
}

function viewAllEmployeeByManager() {}

function viewAllRoles() {
  connection.query(`SELECT roles.id, (roles.title) AS Role, (departments.name) AS Department FROM roles
  LEFT JOIN departments ON departments.id = roles.department_id
  `,
  function(err, data){
    if(err) throw new Error(err);
    console.log(cTable.getTable(data));
    start();
  })
}

function viewAllDepartments() {}

// function viewAllEmployeeByDepertment() {}

// Delete functions

function removeEmployee() {}

function removeDepartment() {}

function removeRole() {}

function promting(input) {}
//  function to to end database connection
function exit() {
  connection.end();
}
