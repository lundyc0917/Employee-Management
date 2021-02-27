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


dbConnection.connect(function(error){
    if(error) throw error;
    console.log ("Connected as "+ dbConnection.threadID + "\n");

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

            default: dbConnection.end();
        }
    } catch (error) {
        console.log(error);
        initProgram();
    }
}

var addEmployee = async () => {

}

var addRole = async () => {

}

var addDepartment = async () => {

}

var viewEmployees = async () => {
    try {
        let employeesQuery = 'SELECT * FROM employee';
        dbConnection.query(employeesQuery , function (error, result){
            if (error) throw error;
            let employeeArray=[];
            result.forEach(employee  => employeeArray.push(employee));
            console.table(employeeArray);
            initProgram();
        });
    } catch (error) {
        console.log (error);
        initProgram();
    }
}

var viewRoles = async () => {
    try {
        let rolesQuery = 'SELECT * FROM roles';
        dbConnection.query(rolesQuery, function (error, result){
            if (error) throw error;
            let rolesArray=[];
            result.forEach(roles  => rolesArray.push(roles));
            console.table(rolesArray);
            initProgram();
        });
    } catch (error) {
        console.log (error);
        initProgram();
    }
}

var viewDepartments = async () => {
    try {
        let deptQuery = 'SELECT * FROM department';
        dbConnection.query(deptQuery, function (error, result){
            if (error) throw error;
            let deptArray=[];
            result.forEach(department  => deptArray.push(department));
            console.table(deptArray);
            initProgram();
        });
    } catch (error) {
        console.log (error);
        initProgram();
    }
}