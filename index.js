const inquirer = require("inquirer");
const consoleTable = require("console.table");
const mySQL = require("mysql");
const connection = mySQL.createConnection( {
  host: 'localhost',
  port: 3001,
  user: 'root',
  password: '',
  database: 'employee_trackerDB'
});

connection.connect(function(err) {
  if (err) throw err
  console.log("Connected" + connection.threadId)
  startCliQuestions();
});

function startCliQuestions() {
  inquirer.prompt(
    [
      {type: 'list', message: 'select an option to continue', 
      name: 'option', options: [
        'View Departments',
        'View Employees',
        'View Roles',
        'add Employee',
        'update Employee',
        'add/change role',
        'add/change department'
      ] }
    ]).then(function(val) {
      switch (val.choice) {
          
          case "View all Emplyees By Deparments":
            viewDepartments();
          break;
          
          case "View All Employees?":
            viewEmployees();
          break;
  
          case "View All Employee's By Roles?":
            viewRoles();
          break;
         
          case "Add Employee?":
              addEmployee();
            break;

          case "Update Employee":
              updateEmployee();
            break;
    
          case "Add Role?":
              addRole();
            break;
    
          case "Add Department?":
              addDepartment();
            break;
      }
    });
    
};

function viewDepartments() {
  connection.query("SELECT employees.first_name, employees.last_name, department.name AS Department FROM employees JOIN role ON employees.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employees.id;", 
  function(err, res) {
    if (err) throw err
    consoleTable(res)
    startPrompt()
  })
}

function viewEmployees() {
  connection.query("SELECT employees.first_name, employees.last_name, role.title, role.salary, department.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employees INNER JOIN role on role.id = employees.role_id INNER JOIN department on department.id = role.department_id left join employees e on employees.manager_id = e.id;", 
  function(err, res) {
    if (err) throw err
    consoleTable(res)
    startPrompt()
})
}

function viewRoles() {
  connection.query("SELECT employees.first_name, employees.last_name, role.title AS Title FROM employee JOIN role ON employees.role_id = role.id;", 
  function(err, res) {
  if (err) throw err
  consoleTable(res)
  startPrompt()
  })
}

var roleArr = [];
function selectRole() {
  connection.query("SELECT * FROM role", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      roleArr.push(res[i].title);
    }

  })
  return roleArr;
}
// Select Role Quieries The Managers for Add Employee Prompt 
var managersArr = [];
function selectManager() {
  connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      managersArr.push(res[i].first_name);
    }

  })
  return managersArr;
}
//Add Employee 
function addEmployee() { 
    inquirer.prompt([
        {
          name: "firstname",
          type: "input",
          message: "Enter their first name "
        },
        {
          name: "lastname",
          type: "input",
          message: "Enter their last name "
        },
        {
          name: "role",
          type: "list",
          message: "Enterir role? ",
          choices: selectRole()
        },
        {
            name: "choice",
            type: "rawlist",
            message: "Whats their managers name?",
            choices: selectManager()
        }
    ]).then(function (val) {
      var roleId = selectRole().indexOf(val.role) + 1
      var managerId = selectManager().indexOf(val.choice) + 1
      connection.query("INSERT INTO employee SET ?", 
      {
          first_name: val.firstName,
          last_name: val.lastName,
          manager_id: managerId,
          role_id: roleId
          
      }, function(err){
          if (err) throw err
          consoleTable(val)
          startPrompt()
      })

  })
};

//Update Employee 
function updateEmployee() {
  connection.query("SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;", function(err, res) {
  // console.log(res)
   if (err) throw err
   console.log(res)
  inquirer.prompt([
        {
          name: "lastName",
          type: "rawlist",
          choices: function() {
            var lastName = [];
            for (var i = 0; i < res.length; i++) {
              lastName.push(res[i].last_name);
            }
            return lastName;
          },
          message: "Enter Employee's last name? ",
        },
        {
          name: "role",
          type: "rawlist",
          message: "Enter Employees new title? ",
          choices: selectRole()
        },
    ]).then(function(val) {
      var roleId = selectRole().indexOf(val.role) + 1
      connection.query("UPDATE employee SET WHERE?", 
      {
        last_name: val.lastName        
      }, 
      {
        role_id: roleId         
      }, 
      function(err){
          if (err) throw err
          consoleTable(val)
          startPrompt()
      })

  });
});

}
//Add Employee Role
function addRole() { 
connection.query("SELECT role.title AS Title, role.salary AS Salary FROM role",   function(err, res) {
  inquirer.prompt([
      {
        name: "Title",
        type: "input",
        message: "Enter roles Title?"
      },
      {
        name: "Salary",
        type: "input",
        message: "Enter Salary?"

      } 
  ]).then(function(res) {
      connection.query(
          "INSERT INTO role SET?",
          {
            title: res.Title,
            salary: res.Salary,
          },
          function(err) {
              if (err) throw err
              consoleTable(res);
              startPrompt();
          }
      )

  });
});
}
//Add Department
function addDepartment() { 

  inquirer.prompt([
      {
        name: "name",
        type: "input",
        message: "What Department would you like to add?"
      }
  ]).then(function(res) {
      var query = connection.query(
          "INSERT INTO department SET?",
          {
            name: res.name
          
          },
          function(err) {
              if (err) throw err
              consoleTable(res);
              startPrompt();
          }
      )
  })
}

