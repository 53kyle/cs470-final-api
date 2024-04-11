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
                    SELECT e.employee_id
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
                        AND ava.day_of_week = ?
                        AND TIME(ava.start_time) <= (SELECT TIME(start_time) FROM cs470_Shift WHERE shift_id = ?)
                        AND TIME(ava.end_time) >= (SELECT TIME(end_time) FROM cs470_Shift WHERE shift_id = ?)
                    )
                    `;
        dbConnection.query({
            sql: query,
            values: [ctx.params.shift_id, ctx.params.shift_id, ctx.params.day, ctx.params.shift_id, ctx.params.shift_id]
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

module.exports = {
    allEmployees,
    allPunches,
    allRequests,
    timeOffRequestByID,
    availabilityRequestsByID,
    updateEmployee,
    employeesTrainedInShift,
    employeesAvailableForShift
};
