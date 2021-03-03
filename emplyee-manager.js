// Setup dependencies
const mysql = require('mysql');
const inquirer = require('inquirer');
const util = require('util');
const consoleTable = require('console.table');


// create connection with mySQL database
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
                    "Update Employee's Role",
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

            case "Update Employee's Role": updateRole();
            break;

            default: dbConnection.end();
        }
    } catch (error) {
        console.log(error);
        initProgram();
    }
}

// function to add employee
var addEmployee = async () => {
    try {
        // pull list items from roles to select from
        // use await to allow information to collect before running the array
        let employeeRoles = await dbConnection.query("SELECT * FROM roles");
        let rolesArray = employeeRoles.map((roles)=> {
            return { 
                name: roles.title, 
                value: roles.id
            }
        });
        // pull list itmes from departments to select from
        // use await to allow information to collect before running the array
        let department = await dbConnection.query("SELECT * FROM department");
        let deptArray = department.map((department) =>{
            return {
                name: department.departName, 
                value: department.id
            }
        });
        // pull list items from employee list to be able to select manager
        // use await to allow information to collect before running the array
        let managers = await dbConnection.query("SELECT * FROM employee");
        let managerArray = managers.map((employee) =>{
            return {
                name: employee.firstName + " " + employee.lastName, 
                value: employee.id
            }
        });
        // prompts for input and responses
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
                // TODO: Allow for Null value to be selected
            }
        ])
        // write the data to mySQL
        let employeeData = dbConnection.query("INSERT INTO employee SET ?", {
            firstName: response.firstName,
            lastName: response.lastName,
            rolesId: response.rolesId,
            managerId: response.managerId
        });
        // conosle log success or error
        console.log(`\nSuccess!!! \n ${response.firstName} ${response.lastName} has been added!\n`);
        initProgram();
    } catch (err) {
        console.log(err);
        initProgram();
    }
}

var addRole = async () => {
    try {
        // pull list itmes from departments to select from
        // use await to allow information to collect before running the array
        let depart = await dbConnection.query("SELECT * FROM department");
        let departArray = depart.map((departID)=>{
            return{
                name: departID.departName,
                value: departID.id
            }
        });
        // prompts for input and responses
        let response = await inquirer.prompt ([
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
        // write data to mySQL database
        let rolesData = dbConnection.query("INSERT INTO roles SET ?", {
            title: response.title,
            salary: response.salary,
            departId: response.departId
        });
        // conosle log success or error
        console.log(`\nSuccess!!! \n ${response.title} has been added!\n`);
        initProgram();
    } catch (err) {
        console.log(err);
        initProgram();
    }
}

var addDepartment = async () => {
    try{
        // prompts for input and responses
        let response = await inquirer.prompt([
            {
                name: "departName",
                type: "input",
                message: "Enter Department Name"
            }
        ]);
        // write data to mySQL database
        let departData = dbConnection.query("INSERT INTO department SET ?", {
            departName: response.departName
        });
        // conosle log success or error
        console.log(`\nSuccess!!! \n ${response.departName} has been added!\n`);
        initProgram();
    } catch (err) {
        console.log(err);
        initProgram();
    }
}
// view employee table
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
//view roles table
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
//view department table
var viewDepartments = async () => {
    try {
        let departQuery = "SELECT * FROM department";
        dbConnection.query(departQuery, function (error, result){
            if (error) throw error;
            let departArray=[];
            result.forEach(department  => departArray.push(department));
            console.table(departArray);
            initProgram();
        });
    } catch (error) {
        console.log (error);
        initProgram();
    }
}

var updateRole = async () => {
    try {
        let employeeList = await dbConnection.query("SELECT * FROM employee");
        let employeeArray = employeeList.map((employee) =>{
            return {
                name: employee.firstName + " " + employee.lastName, 
                value: employee.id
            }
        });
        let employeeSelect = await inquirer.prompt([
            {
                name: "employee",
                type: "list",
                choices: employeeArray,
                message: "Select Employee"
            }
        ]);

        let employeeRoles = await dbConnection.query("SELECT * FROM roles");
        let rolesArray = employeeRoles.map((roles)=> {
            return { 
                name: roles.title, 
                value: roles.id
            }
        });
        let roleSelect = await inquirer.prompt([
            {
                name: "roles",
                type: "list",
                choices: rolesArray,
                message: "Select New Role"
            }
        ]);

        let updateRole = dbConnection.query("UPDATE employee SET ? WHERE ?", [{rolesId: roleSelect.roles}, {id: employeeSelect.employee}]);
        
        console.log(`\nSuccess!!! \n Employee's role has been updated!\n`);
        initProgram();

    } catch (err) {
    console.log(err);
    initProgram();
    }
}