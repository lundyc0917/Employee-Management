// Setup dependencies
const mysql = require('mysql');
const inquirer = require('inquirer');
const util = require('util');
const consoleTable = require('console.table');

var dbConnection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "employeeDB"
});


dbConnection.query = util.promisify(dbConnection.query);


dbConnection.connect(function(err){
    if(err) throw err;
    console.log ("Connectedt as "+ dbConnection.threadID + "\n");

    initProgram();

});

// initialize the program
var initProgram = async () => {
    try { 
        var response = await inquirer.prompt({
            name: "function",
            type: "list",
            message: "Select which function you would like to perform.",
            choices: 
                [
                    "Add New Employee",
                    "Add New Role",
                    "Add New Department",
                    "View All Employees",
                    "View All Roles",
                    "View All Departments",
                    "Exit"
                ],
        });

        switch (response.function) {
            case "Add New Employee": addEmployee();
            break;

            case "Add New Role": addRole();
            break;

            case "Add New Department": addDepartment();
            break;

            case "View All Employees": viewEmployees();
            break;

            case "View All Roles": viewRoles();
            break;

            case "View All Departments": viewDepartments();
            break;

            case "Exit": connection.end();

            default: connection.end();
        }
    } catch (err) {
        console.log(err);
    }
}

var addEmployee = async () => {

}

var addRole = async () => {

}

var addDepartment = async () => {

}

var viewEmployees = async () => {

}

var viewRoles = async () => {

}

var viewDepartments = async () => {

}