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
    try {

        let employeeRoles = await dbConnection.query("SELECT * FROM roles");
        let rolesArray = employeeRoles.map((roles)=> {
            return { 
                name: roles.title, 
                value: roles.id
            }
        });

        let department = await dbConnection.query("SELECT * FROM department");
        let deptArray = department.map((department) =>{
            return {
                name: department.departName, 
                value: department.id
            }
        });

        let managers = await dbConnection.query("SELECT * FROM employee");
        let managerArray = managers.map((employee) =>{
            return {
                name: employee.firstName + " " + employee.lastName, 
                value: employee.id
            }
        });

        let response = await inquirer.prompt([
            { 
                name: "firstName", 
                type: "input", 
                message: "Enter First Name of Employee"
            },
            { 
                name: "lastName", 
                type: "input", 
                message: "Enter Last Name of Employee"
            },
            { 
                name: "rolesId",
                type: "list",
                choices: rolesArray,
                message: "Choose Employee's Role"
            },
            { 
                name: "departmentId",
                type: "list",
                choices: deptArray,
                message: "Choose Employee's Department"
            },
            { 
                name: "managerId",
                type: "list",
                choices: managerArray,
                message: "Choose Employee's Manager"
            }
        ])

        var employeeData = dbConnection.query("INSERT INTO employee SET ?", {
            firstName: response.firstName,
            lastName: response.lastName,
            rolesId: response.rolesId,
            managerId: response.managerId
        });

        console.log(`\nSuccess!!! \n ${response.firstName} ${response.lastName} has been added!\n`);
        initProgram();
    } catch (err) {
        console.log(err);
        initProgram();
    }
}

var addRole = async () => {
    try {
        let depart = await dbConnection.query("SELECT * FROM department");
        let departArray = depart.map((departID)=>{
            return{
                name: departID.departName,
                value: departID.id
            }
        });

        var response = await inquirer.prompt ([
            {
                name: "title",
                type: "input",
                message: "Enter Title of Role"
            },
            {
                name: "salary",
                type: "input",
                message: "Enter Salary for Role"
            },
            {
                name: "departId",
                type: "list",
                choices: departArray,
                message: "Select Department"
            }
        ])

        var rolesData = dbConnection.query("INSERT INTO roles SET ?", {
            title: response.title,
            salary: response.salary,
            departId: response.departId
        });
    
        console.log(`\nSuccess!!! \n ${response.title} has been added!\n`);
        initProgram();
    } catch (err) {
        console.log(err);
        initProgram();
    }
}

var addDepartment = async () => {
    try{
        var response = await inquirer.prompt([
            {
                name: "departName",
                type: "input",
                message: "Enter Department Name"
            }
        ]);
        var departData = dbConnection.query("INSERT INTO department SET ?", {
            departName: response.departName
        });

        console.log(`\nSuccess!!! \n ${response.departName} has been added!\n`);
        initProgram();
    } catch (err) {
        console.log(err);
        initProgram();
    }
}

var viewEmployees = async () => {
    try {
        let employeesQuery = "SELECT * FROM employee";
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
        let rolesQuery = "SELECT * FROM roles";
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
        let deptQuery = "SELECT * FROM department";
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