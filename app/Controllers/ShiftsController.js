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
            AND posted = 1
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

const todaysShiftForEmployee = async (ctx) => {
    return new Promise((resolve, reject) => {

        let query = `
            SELECT * FROM cs470_Shift 
            WHERE employee_id = ? 
            AND DATE(start_time) = DATE(NOW()) 
            LIMIT 1`;

        dbConnection.query({
            sql: query,
            values: [Number(ctx.params.employee_id)]
        }, (error, tuples) => {
            if (error) {
                console.log("Connection error in ShiftsController::todaysShiftForEmployee", error);
                ctx.body = [];
                ctx.status = 200;
                return reject(error);
            }
            ctx.body = tuples;
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in todaysShiftForEmployee.", err);
        ctx.body = [];
        ctx.status = 500;
    });
}

const employeeCountByShift = async (ctx) => {
    return new Promise((resolve, reject) => {

        let query = `
        SELECT 
        s.shift_id,
        s.employee_id,
        s.department,
        s.start_time,
        s.end_time,
        (
        (TIMESTAMPDIFF(MINUTE, s.start_time, s.end_time) - 
        CASE
            WHEN s.meal_end IS NOT NULL AND s.meal_start IS NOT NULL THEN TIMESTAMPDIFF(MINUTE, s.meal_end, s.meal_start)
            ELSE 0
        END) / 60
        ) AS length,
    
        COUNT(e.employee_id) AS num_employees_available
    FROM 
        cs470_Shift s
    LEFT JOIN 
        cs470_Employee_Trained t ON s.department = t.department
    LEFT JOIN 
        cs470_Employee e ON t.employee_id = e.employee_id
        AND NOT EXISTS (
            SELECT 1
            FROM 
                cs470_Employee_Timeoff toff
            WHERE 
                e.employee_id = toff.employee_id
            AND 
                TIME(toff.start_time) <= TIME(s.start_time)
            AND 
                TIME(toff.end_time) >= TIME(s.end_time)
            AND 
                toff.status != 'Pending'
        )
        AND EXISTS (
            SELECT 1
            FROM 
                cs470_Employee_Availability ava
            WHERE 
                e.employee_id = ava.employee_id
            AND 
                ava.day_of_week = DAYNAME(s.start_time)
            AND 
                TIME(ava.start_time) <= TIME(s.start_time)
            AND 
                TIME(ava.end_time) >= TIME(s.end_time)
        )
    WHERE
        s.start_time >= ? AND s.end_time <= ?
    GROUP BY 
        s.shift_id
    ORDER BY num_employees_available;
    
            `;

        dbConnection.query({
            sql: query,
            values: [ctx.params.start_date, ctx.params.end_date]
        }, (error, tuples) => {
            if (error) {
                console.log("Connection error in ShiftsController::EmployeeCountByShift", error);
                ctx.body = [];
                ctx.status = 200;
                return reject(error);
            }
            ctx.body = tuples;
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in EmployeeCountByShift.", err);
        ctx.body = [];
        ctx.status = 500;
    });
}


const updateShift = async (ctx) => {
    const { employee_id, shift_id } = ctx.params;
    return new Promise((resolve, reject) => {

        const query = `
            UPDATE cs470_Shift
            SET employee_id = ?
            WHERE shift_id = ?;
        `;


        dbConnection.query({
            sql: query,
            values: [employee_id, shift_id]
        }, (error, result) => {
            if (error) {
                console.log("Connection error in ShiftController::updateShift", error);
                ctx.status = 500;
                return reject(error);
            }
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in updateShift.", err);
        ctx.status = 500;
    });
}

const postShift = async (ctx) => {
    const { shift_id } = ctx.params;
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE cs470_Shift
            SET posted = TRUE
            WHERE shift_id = ? AND employee_id IS NOT NULL;
        `;

        dbConnection.query({
            sql: query,
            values: [shift_id]
        }, (error, result) => {
            if (error) {
                console.log("Connection error in ShiftController::postShift", error);
                ctx.status = 500;
                return reject(error);
            }
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in postShift.", err);
        ctx.status = 500;
    });
}

const addShift = async (ctx) => {
    return new Promise((resolve, reject) => {
        let valuesFromUpdate = JSON.parse(JSON.stringify(ctx.request.body)); //Deep copy for passed object

        const { department, employee_id, start_time, end_time, meal, meal_start, meal_end, posted } = valuesFromUpdate;
        let query = `
            INSERT INTO cs470_Shift 
            (department, employee_id, start_time, end_time, meal, meal_start, meal_end, posted) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);
            `;

        dbConnection.query({
            sql: query,
            values: [department, Number(employee_id) || null, start_time, end_time, meal, meal_start, meal_end, posted]
        }, (error, result) => {
            if (error) {
                console.log("Connection error in ShiftController::addShift", error);
                ctx.status = 500;
                return reject(error);
            }
            console.log("Shift added successfully!");
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in addShift.", err);
        ctx.status = 500;
    });
}

const editShift = async (ctx) => {
    return new Promise((resolve, reject) => {
        let valuesFromUpdate = JSON.parse(JSON.stringify(ctx.request.body)); //Deep copy for passed object

        const { department, employee_id, start_time, end_time, meal, meal_start, meal_end, posted, shift_id } = valuesFromUpdate;
        let query = `
            UPDATE cs470_Shift 
            SET department = ?, employee_id = ?, start_time = ?, end_time = ?, meal = ?, meal_start = ?, meal_end = ?, posted = ?
            WHERE shift_id = ?
            `;

        dbConnection.query({
            sql: query,
            values: [department, Number(employee_id) || null, start_time, end_time, meal, meal_start, meal_end, posted, Number(shift_id)]
        }, (error, result) => {
            if (error) {
                console.log("Connection error in ShiftController::editShift", error);
                ctx.status = 500;
                return reject(error);
            }
            console.log("Shift edited successfully!");
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in editShift.", err);
        ctx.status = 500;
    });
}

const deleteShift = async (ctx) => {
    return new Promise((resolve, reject) => {

        let query = `
            DELETE FROM cs470_Shift 
            WHERE shift_id = ?;
            `;

        dbConnection.query({
            sql: query,
            values: [Number(ctx.params.shift_id)]
        }, (error, result) => {
            if (error) {
                console.log("Connection error in ShiftController::deleteShift", error);
                ctx.status = 500;
                return reject(error);
            }
            console.log("Shift removed successfully!");
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in deleteShift.", err);
        ctx.status = 500;
    });
}

const allTrained = async (ctx) => {
    return new Promise((resolve, reject) => {

        let query = `
            SELECT * FROM cs470_Employee_Trained 
            GROUP BY department 
            ORDER BY department;`;

        dbConnection.query({
            sql: query
        }, (error, tuples) => {
            if (error) {
                console.log("Connection error in ShiftsController::allTrained", error);
                ctx.body = [];
                ctx.status = 200;
                return reject(error);
            }
            ctx.body = tuples;
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in allTrained.", err);
        ctx.body = [];
        ctx.status = 500;
    });
}

module.exports = {
    shiftsInRange,
    shiftsForEmployeeInRange,
    nextShiftForEmployee,
    todaysShiftForEmployee,
    updateShift,
    employeeCountByShift,
    postShift,
    addShift,
    editShift,
    deleteShift,
    allTrained
};
