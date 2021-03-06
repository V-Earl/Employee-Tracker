const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "employee_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    // afterConnection();
});

function afterConnection(queryString, object) {
    connection.query(queryString, object, function (err, res) {
        if (err) throw err;
        console.log(res);
        connection.end();
    });
}

// starting questions...
let questions = [{
    name: "action",
    type: "list",
    message: "What would you like to do with this employee?",
    choices: ['Add', 'Update', 'View']
},
{
    name: "table",
    type: "list",
    message: "Please a table:",
    choices: ['Employee', 'Role', 'Department']
}
]

// allows the user to view the table (employees must be added first in order to view that table)
inquirer.prompt(questions)
    .then(answers => {
        const { table, action } = answers;
        if (action === 'View') {
            connection.query(`SELECT * FROM ${table.toLowerCase()}`, function (err, res) {
                if (err) throw err;
                console.log(res);
                connection.end();
            });
        }

        // allows the user to add a new employee
        else if (action === 'Add') {

            let additionalQuestions = []
            switch (table) {
                case 'Employee':
                    additionalQuestions = [
                        {
                            name: "employeeRole",
                            type: "input",
                            message: "Please enter the employee role ID:",
                        },
                        {
                            name: "firstName",
                            type: "input",
                            message: "What is the employee's first name?",
                        },
                        {
                            name: "lastName",
                            type: "input",
                            message: "What is the employee's last name?",
                        },
                        {
                            name: "managerId",
                            type: "input",
                            message: "What is the manager's ID?",
                        },
                    ]
                    inquirer.prompt(additionalQuestions)
                        .then(response => {
                            connection.query(`INSERT INTO ${table.toLowerCase()} SET ? `,
                                {
                                    first_name: response.firstName,
                                    last_name: response.lastName,
                                    manager_id: response.manager_id || null,
                                    role_id: response.employeeRole
                                },
                                function (err, res) {
                                    if (err) throw err;
                                    console.log(res);
                                    connection.end();
                                });
                        })
                    break;
                // allows user to add a new department
                case 'Department':
                    inquirer.prompt({
                        name: "departmentName",
                        type: "input",
                        message: "What is the department name?"
                    })
                        .then(response => {
                            connection.query(`INSERT INTO ${table.toLowerCase()} SET ? `,
                                {
                                    dept_name: response.departmentName
                                },
                                function (err, res) {
                                    if (err) throw err;
                                    console.log(res);
                                    connection.end();
                                });
                        })
                    break;

                // allows the user to add a new role to the database
                default:
                    inquirer.prompt([
                        {
                            name: "roleTitle",
                            type: "input",
                            message: "What is the employee's title?"
                        },
                        {
                            name: "salary",
                            type: "input",
                            message: "What is the employee's salary?"
                        },
                        {
                            name: "deptId",
                            type: "input",
                            message: "What is the employee's department ID?"
                        }

                    ])
                        .then(response => {
                            connection.query(`INSERT INTO ${table.toLowerCase()} SET ? `,
                                {
                                    title: response.roleTitle,
                                    salary: response.salary,
                                    department_id: response.deptId
                                },
                                function (err, res) {
                                    if (err) throw err;
                                    console.log(res);
                                    connection.end();
                                });
                        })

                    break;
            }

            // make updates
        } else {
            switch (table) {
                case 'Employee':
                    inquirer.prompt([
                        {
                            name: "employeeToUpdate",
                            type: "input",
                            message: "Please enter the employee ID that you would like to update."
                        },
                        {
                            name: "columnToUpdate",
                            type: "list",
                            message: "What would you like to update?",
                            choices: ['first_name', 'last_name', 'role_id', 'manager_id']
                        },
                        {
                            name: "newValue",
                            type: "input",
                            message: "What would you like the new value to be?",
                        }
                    ]).then(response => {
                        connection.query(`UPDATE ${table.toLowerCase()} SET ${response.columnToUpdate} = ? WHERE id = ? `,
                            [
                                response.newValue,
                                response.employeeToUpdate
                            ],
                            function (err, res) {
                                if (err) throw err;
                                console.log(res);
                                connection.end();
                            });
                    })
                    break;

                default:
                    inquirer.prompt([
                        {
                            name: "roleToUpdate",
                            type: "input",
                            message: "Please enter the role ID that you would like to update."
                        },
                        {
                            name: "columnToUpdate",
                            type: "list",
                            message: "What would you like to update?",
                            choices: ['title', 'salary', 'department_id']
                        },
                        {
                            name: "newValue",
                            type: "input",
                            message: "What would you like the new value to be?",
                        }
                    ]).then(response => {
                        connection.query(`UPDATE ${table.toLowerCase()} SET ${response.columnToUpdate} = ? WHERE id = ? `,
                            [
                                response.newValue,
                                response.roleToUpdate
                            ],
                            function (err, res) {
                                if (err) throw err;
                                console.log(res);
                                connection.end();
                            });
                    })
                    break;
            }
        }
    })