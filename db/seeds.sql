-- add departments
INSERT INTO departments (name) values ("computer science");
INSERT INTO departments (name) values ("physics");
INSERT INTO departments (name) values ("chemistry");

-- This will insert into roles table

INSERT INTO roles (title, salary, department_id) values ("lead", 100000, 1);
INSERT INTO roles (title, salary, department_id) values ("head", 120000,1);
INSERT INTO roles (title, salary, department_id) values ("admin associate", 60000,1);

INSERT INTO roles (title, salary, department_id) values ("lead", 100000, 2);
INSERT INTO roles (title, salary, department_id) values ("head", 120000,2);
INSERT INTO roles (title, salary, department_id) values ("admin", 70000,2);

INSERT INTO roles (title, salary, department_id) values ("lead", 100000, 3);
INSERT INTO roles (title, salary, department_id) values ("head", 120000,3);
INSERT INTO roles (title, salary, department_id) values ("senior admin", 80000,3);

-- add employees to the employee table

INSERT INTO employees (first_name, last_name, role_id) values ("yigezu", "birhane", 2);
INSERT INTO employees (first_name, last_name, role_id) values ("hana", "aklilu", 5);
INSERT INTO employees (first_name, last_name, role_id) values ("naod", "yigezu", 8);

INSERT INTO employees (first_name, last_name, role_id, manager_id) values ("haset", "yigezu", 1, 1);
INSERT INTO employees (first_name, last_name, role_id, manager_id) values ("saba", "joe", 3, 4);
INSERT INTO employees (first_name, last_name, role_id, manager_id) values ("tigist", "adinew", 3, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id) values ("helen", "melese", 4, 2);
INSERT INTO employees (first_name, last_name, role_id, manager_id) values ("deme", "aklilu", 6, 7);
INSERT INTO employees (first_name, last_name, role_id, manager_id) values ("alem", "ashagre", 6, 7);

INSERT INTO employees (first_name, last_name, role_id, manager_id) values ("john", "chris", 7, 3);
INSERT INTO employees (first_name, last_name, role_id, manager_id) values ("suzzie", "tomson", 9, 10);
INSERT INTO employees (first_name, last_name, role_id, manager_id) values ("faith", "john", 9, 10);
