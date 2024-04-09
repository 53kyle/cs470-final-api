const dbConnection = require('../../database/mySQLconnect');
const setAccessToken = require('../../config/setAccessToken');


require('dotenv').config();

const shiftsInRange = async (ctx) => {
    return new Promise((resolve, reject) => {

        let query = `SELECT *, 
            DATE(s.start_time) AS 'date', 
            (SELECT first_name FROM cs470_Employee WHERE employee_id = s.employee_id) AS 'employee_fname', 
            (SELECT last_name FROM cs470_Employee WHERE employee_id = s.employee_id) AS 'employee_lname' 
            FROM cs470_Shift s
            WHERE DATE(s.start_time) >= DATE(?) 
            AND DATE(s.start_time) <= DATE(?) 
            ORDER BY s.start_time;`;

        dbConnection.query({
            sql: query,
            values: [ctx.params.start_date, ctx.params.end_date]
        }, (error, tuples) => {
            if (error) {
                console.log("Connection error in ShiftsController::shiftsInRange", error);
                ctx.body = [];
                ctx.status = 200;
                return reject(error);
            }
            ctx.body = tuples;
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in shiftsInRange.", err);
        ctx.body = [];
        ctx.status = 500;
    });
}

const shiftsForEmployeeInRange = async (ctx) => {
    return new Promise((resolve, reject) => {

        let query = `SELECT *, 
            DATE(s.start_time) AS 'date', 
            (SELECT first_name FROM cs470_Employee WHERE employee_id = s.employee_id) AS 'employee_fname', 
            (SELECT last_name FROM cs470_Employee WHERE employee_id = s.employee_id) AS 'employee_lname' 
            FROM cs470_Shift s
            WHERE DATE(s.start_time) >= DATE(?) 
            AND DATE(s.start_time) <= DATE(?) 
            AND employee_id = ?
            ORDER BY s.start_time;`;

        dbConnection.query({
            sql: query,
            values: [ctx.params.start_date, ctx.params.end_date, Number(ctx.params.employee_id)]
        }, (error, tuples) => {
            if (error) {
                console.log("Connection error in ShiftsController::shiftsForEmployeeInRange", error);
                ctx.body = [];
                ctx.status = 200;
                return reject(error);
            }
            ctx.body = tuples;
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in shiftsForEmployeeInRange.", err);
        ctx.body = [];
        ctx.status = 500;
    });
}

const nextShiftForEmployee = async (ctx) => {
    return new Promise((resolve, reject) => {

        let query = `
            SELECT * FROM cs470_Shift 
            WHERE employee_id = ? 
            AND end_time > NOW() 
            ORDER BY end_time LIMIT 1`;

        dbConnection.query({
            sql: query,
            values: [Number(ctx.params.employee_id)]
        }, (error, tuples) => {
            if (error) {
                console.log("Connection error in ShiftsController::nextShiftForEmployee", error);
                ctx.body = [];
                ctx.status = 200;
                return reject(error);
            }
            ctx.body = tuples;
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in nextShiftForEmployee.", err);
        ctx.body = [];
        ctx.status = 500;
    });
}

module.exports = {
    shiftsInRange,
    shiftsForEmployeeInRange,
    nextShiftForEmployee
};
