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
    			p.punch_type
		FROM
    			cs470_Employee_Punchin p
		JOIN
    			cs470_Employee e ON p.employee_id = e.employee_id
		ORDER BY
			p.punchin
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

const allRequests = async (ctx) => {
    return new Promise((resolve, reject) => {

        let query = `SELECT CONCAT(e.first_name, ' ', e.last_name) AS name, t.start_time, t.end_time, t.reason
			FROM cs470_Employee_Timeoff t
			JOIN cs470_Employee e ON t.employee_id = e.employee_id
			ORDER BY t.start_time;
			`;

        dbConnection.query({
            sql: query
        }, (error, tuples) => {
            if (error) {
                console.log("Connection error in EmployeesController::allRequests", error);
                ctx.body = [];
                ctx.status = 200;
                return reject(error);
            }
            ctx.body = tuples;
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in allRequests.", err);
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
                        AND ava.day_of_week = DAYNAME(start_time)
                        AND TIME(ava.start_time) <= (SELECT TIME(start_time) FROM cs470_Shift WHERE shift_id = ?)
                        AND TIME(ava.end_time) >= (SELECT TIME(end_time) FROM cs470_Shift WHERE shift_id = ?)
                    )
                    `;
        dbConnection.query({
            sql: query,
            values: [ctx.params.shift_id, ctx.params.shift_id, ctx.params.shift_id, ctx.params.shift_id]
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
                    employee_id,
                    SUM((TIMESTAMPDIFF(MINUTE, start_time, end_time) - TIMESTAMPDIFF(MINUTE, meal_start, meal_end)) / 60) AS total_hours
                    FROM cs470_Shift
                    WHERE 
                        start_time >= ?
                        AND end_time <= ?
                    GROUP BY employee_id
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
                    employee_id,
                    COUNT(department) as count
                    FROM cs470_Shift
                    WHERE 
                        start_time >= '2024-04-01'
                        AND end_time <= '2024-06-30'
                        AND employee_id IS NOT NULL
                    GROUP BY employee_id
                    ORDER BY count
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

module.exports = {
    allEmployees,
    allPunches,
    allRequests,
    timeOffRequestByID,
    addTimeOffRequest,
    removeTimeOffRequest,
    availabilityRequestsByID,
    updateEmployee,
    employeesTrainedInShift,
    employeesAvailableForShift,
    employeeHoursInRange,
    employeeShiftsInRange
};
