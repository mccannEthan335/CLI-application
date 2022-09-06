DROP DATABASE employee_trackerDB;

CREATE DATABASE employee_trackerDB;

USE DATABASE employee_trackerDB;

CREATE TABLE department (
  id INT NOT NULL,
  name VARCHAR(30)
);

CREATE TABLE role (
  id INT NOT NULL,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employees (
  id INT NOT NULL,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  manager_id INT,
  role_id INT,
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employees(manager_id)
);

INSERT INTO department (name) VALUE ("Sales");
INSERT INTO department (name) VALUE ("Engineering");
INSERT INTO department (name) VALUE ("Finance");
INSERT INTO department (name) VALUE ("Legal");
INSERT INTO department (name) VALUE ("Management");

INSERT INTO role (title, salary, department_id) VALUE ("Salesperson", 80000.00, 1);
INSERT INTO role (title, salary, department_id) VALUE ("Lead Engineer", 150000.00, 5);
INSERT INTO role (title, salary, department_id) VALUE ("Software Engineer", 120000.00, 2);
INSERT INTO role (title, salary, department_id) VALUE ("Account Manager", 160000.00, 5);
INSERT INTO role (title, salary, department_id) VALUE ("Accountant", 125000.00, 3);
INSERT INTO role (title, salary, department_id) VALUE ("Legal Team Lead", 250000.00, 5);
INSERT INTO role (title, salary, department_id) VALUE ("Lawyer", 190000.00, 4);

INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Mike", "Chan", 1, 1);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Ashley", "Rodriguez", null , 5 );
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Kevin", "Tupik", 2 , 2 );
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Kunal", "Singh",null , 5 );
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Malia", "Brown", 4, 3);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Sarah", "Lourd", null, 5);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Tom", "Allen", 6, 4);

SELECT FROM department;
SELECT FROM role;
SELECT FROM EMPLOYEES;
