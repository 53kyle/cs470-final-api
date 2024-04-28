const dbConnection = require('../../database/mySQLconnect');
const setAccessToken = require('../../config/setAccessToken');


require('dotenv').config();

const allEmployees = async (ctx) => {
    return new Promise((resolve, reject) => {

        let query = `SELECT * FROM cs470_Employee ORDER BY first_name`;

        dbConnection.query({
            sql: query
        }, (error, tuples) => {
            if (error) {
                console.log("Connection error in EmployeesController::allEmployees", error);
                ctx.body = [];
                ctx.status = 200;
                return reject(error);
            }
            ctx.body = tuples;
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in allEmployees.", err);
        ctx.body = [];
        ctx.status = 500;
    });
}


const allPunches = async (ctx) => {
    return new Promise((resolve, reject) => {

        let query = `
		SELECT
    			CONCAT(e.first_name, ' ', e.last_name) AS name,
    			e.last_name AS employee_last_name,
    			p.punchin,
    			p.approved,
    			p.pending,
    			p.punch_type,
			p.employee_id
		FROM
    			cs470_Employee_Punchin p
		JOIN
    			cs470_Employee e ON p.employee_id = e.employee_id
		ORDER BY
			p.pending DESC, p.punchin
		     `;

        dbConnection.query({
            sql: query
        }, (error, tuples) => {
            if (error) {
                console.log("Connection error in EmployeesController::allPunches", error);
                ctx.body = [];
                ctx.status = 200;
                return reject(error);
            }
            ctx.body = tuples;
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in allPunches.", err);
        ctx.body = [];
        ctx.status = 500;
    });
}

const allTimeoffRequests = async (ctx) => {
    return new Promise((resolve, reject) => {

        let query = `SELECT CONCAT(e.first_name, ' ', e.last_name) AS name, t.start_time, t.end_time, t.reason, t.status, t.employee_id
			FROM cs470_Employee_Timeoff t
			JOIN cs470_Employee e ON t.employee_id = e.employee_id
			ORDER BY t.status DESC, t.start_time;
			`;

        dbConnection.query({
            sql: query
        }, (error, tuples) => {
            if (error) {
                console.log("Connection error in EmployeesController::allTimeoffRequests", error);
                ctx.body = [];
                ctx.status = 200;
                return reject(error);
            }
            ctx.body = tuples;
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in allTimeoffRequests.", err);
        ctx.body = [];
        ctx.status = 500;
    });
}

const allAvailabilityRequests = async (ctx) => {
    return new Promise((resolve, reject) => {

        let query = `SELECT CONCAT(e.first_name, ' ', e.last_name) AS name, t.start_time, t.end_time, t.day_of_week, t.status, t.employee_id                        FROM cs470_Employee_Availability_Requests t
                        JOIN cs470_Employee e ON t.employee_id = e.employee_id
                        ORDER BY t.status DESC, t.start_time;
                        `;

        dbConnection.query({
            sql: query
        }, (error, tuples) => {
            if (error) {
                console.log("Connection error in EmployeesController::allAvailabilityRequests", error);
                ctx.body = [];
                ctx.status = 200;
                return reject(error);
            }
            ctx.body = tuples;
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in allAvailabilityRequests.", err);
        ctx.body = [];
        ctx.status = 500;
    });
}

const timeOffRequestByID = async (ctx) => {
    return new Promise((resolve, reject) => {
        const query = `
                        SELECT * 
                        FROM cs470_Employee_Timeoff
                        WHERE employee_id = ? 
                        ORDER BY start_time;        
                    `;
        dbConnection.query({
            sql: query,
            values: [ctx.params.employee_id]
        }, (error, tuples) => {
            if (error) {
                console.log("Connection error in EmployeesController::timeOffRequestByID", error);
                ctx.body = [];
                ctx.status = 200;
                return reject(error);
            }
            ctx.body = tuples;
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in timeOffRequestByID.", err);
        // The UI side will have to look for the value of status and
        // if it is not 200, act appropriately.
        ctx.body = [];
        ctx.status = 500;
    });
}

const addTimeOffRequest = async (ctx) => {
    return new Promise((resolve, reject) => {

        let query = `
            INSERT INTO cs470_Employee_Timeoff 
            (employee_id, start_time, end_time, reason, status) 
            VALUES (?, ?, ?, ?, 'Pending');
            `;

        dbConnection.query({
            sql: query,
            values: [Number(ctx.params.employee_id), ctx.params.start_time, ctx.params.end_time, ctx.params.reason]
        }, (error, result) => {
            if (error) {
                console.log("Connection error in EmployeesController::addTimeOffRequest", error);
                ctx.status = 500;
                return reject(error);
            }
            console.log("Time off request added successfully!");
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in addTimeOffRequest.", err);
        ctx.status = 500;
    });
}

const removeTimeOffRequest = async (ctx) => {
    return new Promise((resolve, reject) => {

        let query = `
            DELETE FROM cs470_Employee_Timeoff 
            WHERE employee_id = ? 
            AND start_time = ? 
            AND end_time = ? 
            AND reason = ?;
            `;

        dbConnection.query({
            sql: query,
            values: [Number(ctx.params.employee_id), ctx.params.start_time, ctx.params.end_time, ctx.params.reason]
        }, (error, result) => {
            if (error) {
                console.log("Connection error in EmployeesController::removeTimeOffRequest", error);
                ctx.status = 500;
                return reject(error);
            }
            console.log("Time off request removed successfully!");
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in removeTimeOffRequest.", err);
        ctx.status = 500;
    });
}

const addAvailabilityRequest = async (ctx) => {
    return new Promise((resolve, reject) => {

        let query = `
            INSERT INTO cs470_Employee_Availability_Requests 
            (employee_id, day_of_week, start_time, end_time, status) 
            VALUES (?, ?, ?, ?, "Pending")
            ON DUPLICATE KEY UPDATE start_time = ?, end_time = ?, status = "Pending";
            `;

        dbConnection.query({
            sql: query,
            values: [Number(ctx.params.employee_id), ctx.params.day_of_week, ctx.params.start_time, ctx.params.end_time, ctx.start_time, ctx.end_time]
        }, (error, result) => {
            if (error) {
                console.log("Connection error in EmployeesController::addTimeOffRequest", error);
                ctx.status = 500;
                return reject(error);
            }
            console.log("Time off request added successfully!");
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in addTimeOffRequest.", err);
        ctx.status = 500;
    });
}

const availabilityRequestsByID= async (ctx) => {
    return new Promise((resolve, reject) => {
        const query = `
                        SELECT * 
                        FROM cs470_Employee_Availability_Requests
                        WHERE employee_id = ? 
                        ORDER BY start_time;        
                    `;
        dbConnection.query({
            sql: query,
            values: [ctx.params.employee_id]
        }, (error, tuples) => {
            if (error) {
                console.log("Connection error in EmployeesController::availabilityRequestsByID", error);
                ctx.body = [];
                ctx.status = 200;
                return reject(error);
            }
            ctx.body = tuples;
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in availabilityRequestsByID.", err);
        // The UI side will have to look for the value of status and
        // if it is not 200, act appropriately.
        ctx.body = [];
        ctx.status = 500;
    });
}


const employeesTrainedInShift = async (ctx) => {
    return new Promise((resolve, reject) => {
        const query = `
                    SELECT DISTINCT e.employee_id
                    FROM cs470_Employee e
                    JOIN cs470_Employee_Trained t ON e.employee_id = t.employee_id
                    WHERE t.department = (
                        SELECT department 
                        FROM cs470_Shift 
                        WHERE shift_id = ?
                    )        
                    `;
        dbConnection.query({
            sql: query,
            values: [ctx.params.shift_id]
        }, (error, tuples) => {
            if (error) {
                console.log("Connection error in EmployeesController::employeesTrainedInShift", error);
                ctx.body = [];
                ctx.status = 200;
                return reject(error);
            }
            ctx.body = tuples;
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in employeesTrainedInShift.", err);
        // The UI side will have to look for the value of status and
        // if it is not 200, act appropriately.
        ctx.body = [];
        ctx.status = 500;
    });
}


const employeesAvailableForShift = async (ctx) => {
    return new Promise((resolve, reject) => {
        const query = `
                    SELECT e.employee_id
                    FROM cs470_Employee e 
                    WHERE NOT EXISTS (
                        SELECT 1
                        FROM cs470_Employee_Timeoff toff
                        WHERE e.employee_id = toff.employee_id
                        AND TIME(toff.start_time) <= (SELECT TIME(start_time) FROM cs470_Shift WHERE shift_id = ?)
                        AND TIME(toff.end_time) >= (SELECT TIME(end_time) FROM cs470_Shift WHERE shift_id = ?)
                        AND toff.status != 'Pending'
                    )
                    AND EXISTS (
                        SELECT 1
                        FROM cs470_Employee_Availability ava
                        WHERE e.employee_id = ava.employee_id
                        AND ava.day_of_week = (SELECT DAYNAME(start_time) FROM cs470_Shift WHERE shift_id = ?)
                        AND TIME(ava.start_time) <= (SELECT TIME(start_time) FROM cs470_Shift WHERE shift_id = ?)
                        AND TIME(ava.end_time) >= (SELECT TIME(end_time) FROM cs470_Shift WHERE shift_id = ?)
                    )
                    `;
        dbConnection.query({
            sql: query,
            values: [ctx.params.shift_id, ctx.params.shift_id, ctx.params.shift_id, ctx.params.shift_id, ctx.params.shift_id]
        }, (error, tuples) => {
            if (error) {
                console.log("Connection error in EmployeesController::employeesAvailableForShift", error);
                ctx.body = [];
                ctx.status = 200;
                return reject(error);
            }
            ctx.body = tuples;
            ctx.status = 200;
            return resolve();
        }); 
    }).catch(err => {
        console.log("Database connection error in employeesAvailableForShift.", err);
        // The UI side will have to look for the value of status and
        // if it is not 200, act appropriately.
        ctx.body = [];
        ctx.status = 500;
    });
}

const conflictingEmployeeForShift = async (ctx) => {
    return new Promise((resolve, reject) => {
        const query = `
                    SELECT e.employee_id
                    FROM cs470_Employee e
                    WHERE NOT EXISTS (
                        SELECT 1
                        FROM cs470_Shift s
                        WHERE e.employee_id = s.employee_id
                        AND DATE(s.start_time) = DATE((SELECT start_time FROM cs470_Shift WHERE shift_id = ?))
                    )
        
                    `;
        dbConnection.query({
            sql: query,
            values: [ctx.params.shift_id]
        }, (error, tuples) => {
            if (error) {
                console.log("Connection error in EmployeesController::conflictingEmployeeForShift", error);
                ctx.body = [];
                ctx.status = 200;
                return reject(error);
            }
            ctx.body = tuples;
            ctx.status = 200;
            return resolve();
        }); 
    }).catch(err => {
        console.log("Database connection error in conflictingEmployeeForShift.", err);
        // The UI side will have to look for the value of status and
        // if it is not 200, act appropriately.
        ctx.body = [];
        ctx.status = 500;
    });
}

const updateEmployee = async (ctx) => {
    return new Promise((resolve, reject) => {
	let valuesFromUpdate = JSON.parse(JSON.stringify(ctx.request.body)); //Deep copy for passed object

	const { first_name, middle_name, last_name, max_hours, employee_id } = valuesFromUpdate;

        const query = `
            UPDATE cs470_Employee
            SET first_name = ?, middle_name = ?, last_name = ?, max_hours = ?
            WHERE employee_id = ?;
        `;

        dbConnection.query({
            sql: query,
            values: [first_name, middle_name, last_name, Number(max_hours), Number(employee_id)]
        }, (error, result) => {
            if (error) {
                console.log("Connection error in EmployeesController::updateEmployee", error);
                ctx.status = 500;
                return reject(error);
            }
            console.log("Employee updated successfully!");
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in updateEmployee.", err);
        ctx.status = 500;
    });
}

const employeeHoursInRange = async (ctx) => {
    return new Promise((resolve, reject) => {
        const query = `
                    SELECT 
                    e.employee_id,
                    COALESCE(SUM((TIMESTAMPDIFF(MINUTE, s.start_time, s.end_time) - TIMESTAMPDIFF(MINUTE, s.meal_start, s.meal_end)) / 60), 0) AS total_hours
                    FROM cs470_Employee e
                    LEFT JOIN 
                    cs470_Shift s ON e.employee_id = s.employee_id 
                    AND s.start_time >= ?
                    AND s.end_time <= ?
                    GROUP BY e.employee_id
                    ORDER BY total_hours;
                    `;
        dbConnection.query({
            sql: query,
            values: [ctx.params.start_date, ctx.params.end_date]
        }, (error, tuples) => {
            if (error) {
                console.log("Connection error in EmployeesController::employeeHoursInRange", error);
                ctx.body = [];
                ctx.status = 200;
                return reject(error);
            }
            ctx.body = tuples;
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in employeeHoursInRange.", err);
        // The UI side will have to look for the value of status and
        // if it is not 200, act appropriately.
        ctx.body = [];
        ctx.status = 500;
    });
}


const employeeShiftsInRange = async (ctx) => {
    return new Promise((resolve, reject) => {
        const query = `
                    SELECT 
                    e.employee_id,
                    COUNT(s.department) AS count
                    FROM cs470_Employee e
                    LEFT JOIN 
                    cs470_Shift s ON e.employee_id = s.employee_id 
                    AND s.start_time >= ? 
                    AND s.end_time <= ?
                    GROUP BY e.employee_id
                    ORDER BY count;
                    `;
        dbConnection.query({
            sql: query,
            values: [ctx.params.start_date, ctx.params.end_date]
        }, (error, tuples) => {
            if (error) {
                console.log("Connection error in EmployeesController::employeeShiftsInRange", error);
                ctx.body = [];
                ctx.status = 200;
                return reject(error);
            }
            ctx.body = tuples;
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in employeeShiftsInRange.", err);
        // The UI side will have to look for the value of status and
        // if it is not 200, act appropriately.
        ctx.body = [];
        ctx.status = 500;
    });
}

const deleteEmployee = async (ctx) => {
    return new Promise((resolve, reject) => {
        const query = `
                        DELETE FROM cs470_Employee
                        WHERE employee_id = ?
                    `;
        dbConnection.query({
            sql: query,
            values: [ctx.params.employee_id]
        }, (error, tuples) => {
            if (error) {
                console.log("Connection error in EmployeesController::deleteEmployee", error);
                ctx.body = [];
                ctx.status = 200;
                return reject(error);
            }
            ctx.body = tuples;
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in deleteEmployee.", err);
        // The UI side will have to look for the value of status and
        // if it is not 200, act appropriately.
        ctx.body = [];
        ctx.status = 500;
    });
}

const fetchAvailabilityByID= async (ctx) => {
    return new Promise((resolve, reject) => {
        const query = `
                        SELECT *
                        FROM cs470_Employee_Availability
                        WHERE employee_id = ?
                    `;
        dbConnection.query({
            sql: query,
            values: [ctx.params.employee_id]
        }, (error, tuples) => {
            if (error) {
                console.log("Connection error in EmployeesController::fetchAvailabilityByID", error);
                ctx.body = [];
                ctx.status = 200;
                return reject(error);
            }
            ctx.body = tuples;
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in fetchAvailabilityByID.", err);
        // The UI side will have to look for the value of status and
        // if it is not 200, act appropriately.
        ctx.body = [];
        ctx.status = 500;
    });
}

const updateTimeoff = async (ctx) => {
    return new Promise((resolve, reject) => {

        let valuesFromUpdate = JSON.parse(JSON.stringify(ctx.request.body)); //Deep copy for passed object

        const { employee_id, start_time, status} = valuesFromUpdate;

        let query = `
            UPDATE cs470_Employee_Timeoff
            SET status = ?
            WHERE employee_id = ? AND start_time = ?;
            `;

        dbConnection.query({
            sql: query,
            values: [status, employee_id, start_time]
        }, (error, result) => {
            if (error) {
                console.log("Connection error in EmployeeController::updateTimeoff", error);
                ctx.status = 500;
                return reject(error);
            }
            console.log("Timeoff updated successfully!");
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in updateTimeoff.", err);
        ctx.status = 500;
    });
}

const updateAvailabilityRequest = async (ctx) => {
    return new Promise((resolve, reject) => {

        let valuesFromUpdate = JSON.parse(JSON.stringify(ctx.request.body)); //Deep copy for passed object

        const { employee_id, start_time, status, day_of_week} = valuesFromUpdate;

        let query = `
            UPDATE cs470_Employee_Availability_Requests
            SET status = ?
            WHERE employee_id = ? AND start_time = ? AND day_of_week = ?;
            `;

        dbConnection.query({
            sql: query,
            values: [status, employee_id, start_time, day_of_week]
        }, (error, result) => {
            if (error) {
                console.log("Connection error in EmployeeController::updateAvailabilityRequest", error);
                ctx.status = 500;
                return reject(error);
            }
            console.log("Availability request updated successfully!");
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in updateAvailabilityRequest.", err);
        ctx.status = 500;
    });
}

module.exports = {
    allEmployees,
    allPunches,
    allTimeoffRequests,
    allAvailabilityRequests,
    timeOffRequestByID,
    addTimeOffRequest,
    removeTimeOffRequest,
    addAvailabilityRequest,
    availabilityRequestsByID,
    updateEmployee,
    employeesTrainedInShift,
    employeesAvailableForShift,
    employeeHoursInRange,
    employeeShiftsInRange,
    deleteEmployee,
    fetchAvailabilityByID,
    updateTimeoff,
    updateAvailabilityRequest,
    conflictingEmployeeForShift
};
