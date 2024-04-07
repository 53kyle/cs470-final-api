USE blang_cs355sp23;

DROP TABLE IF EXISTS cs470_Employee;
DROP TABLE IF EXISTS cs470_Shift;
DROP TABLE IF EXISTS cs470_Employee_Availability;
DROP TABLE IF EXISTS cs470_Employee_Timeoff;
DROP TABLE IF EXISTS cs470_Employee_Trained;
DROP TABLE IF EXISTS cs470_Employee_Punchin;


CREATE TABLE cs470_Employee (
    employee_id int(11) UNIQUE,
    first_name varchar(20) NOT NULL,
    last_name varchar(20) NOT NULL,
    permission bool,
    password_hash varchar(100) NOT NULL,
    PRIMARY KEY (employee_id)
);


CREATE TABLE cs470_Shift (
    shift_id int(11) UNIQUE,
    department varchar(20),
    employee_id int(11),
    start_time datetime,
    end_time datetime,
    meal boolean,
    meal_start datetime,
	meal_end datetime,
    PRIMARY KEY (shift_id),
    FOREIGN KEY (employee_id) REFERENCES cs470_Employee(employee_id) ON DELETE SET NULL
);


CREATE TABLE cs470_Employee_Availability (
    employee_id int(11),
    day_of_week varchar(10),
    start_time time,
    end_time time,
    FOREIGN KEY (employee_id) REFERENCES cs470_Employee(employee_id) ON DELETE SET NULL
);

CREATE TABLE cs470_Employee_Timeoff (
    employee_id int(11),
    start_time datetime,
    end_time datetime,
    FOREIGN KEY (employee_id) REFERENCES cs470_Employee(id) ON DELETE SET NULL
);


CREATE TABLE cs470_Employee_Trained (
    employee_id int(11),
    trained varchar(20),
    FOREIGN KEY (employee_id) REFERENCES cs470_Employee(id) ON DELETE SET NULL
);
       
CREATE TABLE cs470_Employee_Punchin (
    employee_id int(11),
    punchin datetime,
    FOREIGN KEY (employee_id) REFERENCES cs470_Employee(id) ON DELETE SET NULL
);
