-- Drops the employee_db if it exists currently--
DROP DATABASE IF EXISTS employee_db;
-- Creates the "employee_db" database--
CREATE DATABASE employee_db;
-- Makes it so all of the following code will affect employee_db--
USE employee_db;
-- Creates the table "department" within employee_db--

CREATE TABLE department(
    id INT NOT NULL AUTO_INCREMENT,
    dept_name VARCHAR(30) NOT NULL,
    PRIMARY KEY(id)
);
-- Creates the table "role" within employee_db--
CREATE TABLE role(
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(9, 2) NOT NULL,
    department_id INT,
    FOREIGN KEY(department_id)
        REFERENCES department(id),
    PRIMARY KEY(id)
);
-- Creates the table "role" within employee_db--
CREATE TABLE employee(
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    FOREIGN KEY(role_id)
        REFERENCES role(id),
    manager_id INT,
    FOREIGN KEY(manager_id)
        REFERENCES employee(id),
    PRIMARY KEY(id)
);

INSERT INTO department (dept_name)
VALUES 
    ('Shoes'),
    ('Auto')

INSERT INTO role (title, salary, department_id)
VALUES 
    ('Cashier', 57000, 1),
    ('Cashier', 57000, 2),
    ('Manager', 70000, 1),
    ('Manager', 70000, 2)

