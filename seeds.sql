INSERT INTO departments (name)
VALUES ("Sales"),
("Accounting"),
("Purchasing");

INSERT INTO roles (title, salary, department_id)
VALUES ("Vice President of Sales",150000.00,1),
("Sales Associate",60000.00,1),
("Vice President of Finance",200000.00,2),
("Accountant",100000.00,2),
("Purchasing Manager",115000.00,3),
("Inventory Associate",50000.00,3);

INSERT INTO employees (firstName, lastName, role_id, manager_id)
VALUES ("Joe","Schmo",1,null),
("Bob","Taylor",2,1),
("John", "Schmidt",3,null),
("Idena","Johnson",4,3),
("Christina","Thomas",5,null),
("Katie","Lawrence",6,5);