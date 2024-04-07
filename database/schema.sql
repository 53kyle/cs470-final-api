USE blang_cs355sp23;

DROP TABLE IF EXISTS cs470_Employee;
DROP TABLE IF EXISTS cs470_Shift;
DROP TABLE IF EXISTS cs470_Employee_Availability;
DROP TABLE IF EXISTS cs470_Employee_Timeoff;
DROP TABLE IF EXISTS cs470_Employee_Trained;
DROP TABLE IF EXISTS cs470_Employee_Punchin;


CREATE TABLE cs470_Employee (
    id varchar(8) UNIQUE,
    first_name varchar(20) NOT NULL,
    last_name varchar(20) NOT NULL,
    permission bool,
    password_hash varchar(100) NOT NULL,
    PRIMARY KEY (id)
);


CREATE TABLE cs470_Shift (
    id varchar(8) UNIQUE,
    department varchar(20),
    employee_id varchar(8),
    start_time datetime,
    end_time datetime,
    PRIMARY KEY (id),
    FOREIGN KEY (employee_id) REFERENCES cs470_Employee(id) ON DELETE SET NULL
);


CREATE TABLE cs470_Employee_Availability (
    id varchar(8),
    day_of_week varchar(10),
    start_time time,
    end_time time,
    FOREIGN KEY (id) REFERENCES cs470_Employee(id) ON DELETE SET NULL
);

CREATE TABLE cs470_Employee_Timeoff (
    id varchar(8),
    start_time datetime,
    end_time datetime,
    FOREIGN KEY (id) REFERENCES cs470_Employee(id) ON DELETE SET NULL
);


CREATE TABLE cs470_Employee_Trained (
    id varchar(8),
    trained varchar(20),
    FOREIGN KEY (id) REFERENCES cs470_Employee(id) ON DELETE SET NULL
);
       
CREATE TABLE cs470_Employee_Punchin (
    id varchar(8),
    punchin datetime,
    FOREIGN KEY (id) REFERENCES cs470_Employee(id) ON DELETE SET NULL
);
