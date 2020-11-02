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
    "Update Employee Roles",
    "Remove Employees",
    "Remove Departments",
    "Remove Roles",
    "View Departments Total Utilized Budget",
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
      case "View Departments Total Utilized Budget":
        departmentsTotalUtilizedBudget()
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

function updateEmployeeRoles() {
  const depArray = [];
  const depArrayId = [];
  const roleTitle = [];
  const roleChangeQ = [
    {
      type: "input",
      name: "firstName",
      message:
        "What is the first name of the employee you want to update the role for?",
    },
    {
      type: "input",
      name: "lastName",
      message:
        "What is the last name of the employee you want to update the role for?",
    },
    {
      type: "number",
      name: "empId",
      message: "What is the employee's Id?",
    },
  ];
  connection.query(`SELECT DISTINCT(title)FROM roles`, function (err, data) {
    if (err) throw new Error(err);
    data.forEach((element) => {
      roleTitle.push(element.title);
    });
    const currentlq = {
      type: "list",
      name: "currentRole",
      message: "What is the current role of the employee",
      choices: roleTitle,
    };
    const newroleq = {
      type: "list",
      name: "newRole",
      message: "What is the new role of the employee",
      choices: roleTitle,
    };
    connection.query(`SELECT * FROM departments`, function (err, data) {
      if (err) throw new Error(err);
      data.forEach((element) => {
        depArray.push(element.name);
        depArrayId.push(element.id);
      });
      const depQ = {
        type: "list",
        name: "Dpt",
        message: "What is the employee's Dept?",
        choices: depArray,
      };
      roleChangeQ.push(depQ, currentlq, newroleq);
      inquirer.prompt(roleChangeQ).then(function (res) {
        // code here
        console.log(res);
        const depId = depArrayId[depArray.indexOf(res.Dpt)];

        connection.query(
          `SELECT * FROM employees WHERE id = ? AND first_name = ? AND last_name=?`,
          [res.empId, res.firstName, res.lastName],
          function (err, data) {
            if (err) throw new Error(err);
            if (!data.length) {
              console.log(
                "Record can't be found with the specified information."
              );
              start();
            } else {
              // employee identified. Then check for the existance of the role
              connection.query(
                `SELECT * FROM roles WHERE department_id = ? AND title = ?`,
                [depId, res.newRole],
                function (err, data) {
                  if (err) throw new Error(err);
                  if (!data.length) {
                    console.log(
                      "No role is found with the specified information. Please create the role first."
                    );
                    start();
                  } else {
                    const roleID = data[0].id;
                    connection.query(
                      `UPDATE employees SET ? WHERE ?`,
                      [
                        {
                          role_id: roleID,
                        },
                        {
                          id: res.empId,
                        },
                      ],
                      function (err, resp) {
                        if (err) throw new Error(err);
                        //  additional code here
                        console.log(resp.affectedRows + " employee updated!\n");
                        start();
                      }
                    );
                  }
                }
              );
            }
          }
        );
      });
    });
  });
}

/* function updateEmployeeManager() {
  const updateEmployeeQ = [
    {
      type: "input",
      message: "What is the first name of the employee?",
      name:"empFirstName"
    },
    {
      type: "input",
      message: "What is the first name of the employee?",
      name:"empLastName"
    },
    {
      type: "number",
      message: "What is the id of the employee?",
      name:"empFirstName"
    },
    {
      type: "input",
      message: "What is first name of the new manager?",
      name:"empFirstName"
    },
    {
      type: "input",
      message: "What is first name of the new manager?",
      name:"empFirstName"
    }
  ]
  inquirer.prompt()
} */

// Select functions
function viewAllEmployees() {
  const allEmp = [];
  connection.query(
    `SELECT employees.first_name AS 'First Name', employees.last_name AS 'Last Name', roles.title AS Role FROM employees LEFT JOIN roles ON employees.role_id = roles.id`,
    function (err, data) {
      if (err) throw new Error(err);
      console.log(cTable.getTable(data));
      start();
    }
  );
}

function viewAllEmployeeByManager() {
  connection.query(
    `SELECT id, (first_name) AS 'First Name', (last_name) AS 'Last Name', (manager_id) AS ManagerId, 
    (SELECT first_name FROM employees WHERE id = ManagerId) AS Manager FROM employees ORDER BY Manager DESC`,
    function (err, data) {
      if (err) throw new Error(err);
      console.log(cTable.getTable(data));
      start();
    }
  );
}

function viewAllRoles() {
  connection.query(
    `SELECT roles.id, (roles.title) AS Role, (departments.name) AS Department FROM roles
  LEFT JOIN departments ON departments.id = roles.department_id
  `,
    function (err, data) {
      if (err) throw new Error(err);
      console.log(cTable.getTable(data));
      start();
    }
  );
}

function viewAllDepartments() {
  connection.query(`SELECT id, (name) AS Name FROM departments`, function (
    err,
    data
  ) {
    if (err) throw new Error(err);
    console.log(cTable.getTable(data));
    start();
  });
}

// function viewAllEmployeeByDepertment() {}

// Delete functions

function removeEmployee() {
  const empTobeDeletedInfo = [
    {
      type: "number",
      message:
        "What is the id of the employee you want to remove from the database?",
      name: "empID",
    },
    {
      type: "input",
      message: "What is the first name of the employee?",
      name: "empFirstName",
    },
    {
      type: "input",
      message: "What is the last name of the employee?",
      name: "empLastName",
    },
  ];
  inquirer.prompt(empTobeDeletedInfo).then(function (res) {
    // check the correct employee
    connection.query(
      `SELECT * FROM employees WHERE id = ? AND first_name = ? AND last_name = ? `,
      [res.empID, res.empFirstName, res.empLastName],
      function (err, data) {
        if (err) throw new Error(err);
        if (!res.affectedRows) {
          console.log("Employee with the provided information doesn't exist!");
          start();
        } else {
          connection.query(
            "DELETE FROM employees WHERE ?",
            {
              id: res.empID,
            },
            function (err, res) {
              if (err) throw err;
              console.log(res.affectedRows + " employee deleted!\n");
              start();
            }
          );
        }
      }
    );
  });
}

function removeDepartment() {
  inquirer
    .prompt({
      type: "input",
      message: "Provide the name of the department you want to remove!",
      name: "depToReove",
    })
    .then(function (res) {
      connection.query(
        `DELETE FROM departments WHERE ?`,
        {
          name: res.depToReove,
        },
        function (err, resp) {
          if (err) throw new Error(err);
          console.log(resp.affectedRows + " department deleted!\n");
          start();
        }
      );
    });
}

function removeRole() {
  const depT = [];
  const depID = [];
  connection.query(`SELECT * FROM departments`, function (err, data) {
    if (err) throw new Error(err);
    data.forEach((element) => {
      depT.push(element.name);
      depID.push(element.id);
    });
    inquirer
      .prompt([
        {
          type: "input",
          message: "What role you would like to remove?",
          name: "roleToRemove",
        },
        {
          type: "list",
          message: "What department this role for?",
          name: "depOfRole",
          choices: depT,
        },
      ])
      .then(function (res) {
        connection.query(
          `DELETE FROM roles WHERE title = ? AND department_id = ?`,
          [res.roleToRemove, depID[depT.indexOf(res.depOfRole)]],
          function (err, resp) {
            if (err) throw new Error(err);
            console.log(resp.affectedRows + " role deleted!\n");
            start();
          }
        );
      });
  });
}
// function to find department budget
function departmentsTotalUtilizedBudget(){
connection.query("SELECT (id) AS Dep_Id, (name) AS 'Department Name', (SELECT SUM(salary) FROM roles WHERE department_id = Dep_Id) AS 'Total Utilized Budget' FROM departments", 
function(err, data){
if(err) throw new Error(err);
console.log(cTable.getTable(data));
start();
});
}
//  function to to end database connection
function exit() {
  connection.end();
}
