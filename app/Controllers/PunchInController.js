const dbConnection = require('../../database/mySQLconnect');
const setAccessToken = require('../../config/setAccessToken');


require('dotenv').config();

const addStartShift = async (ctx) => {
    return new Promise((resolve, reject) => {

        let query = `
            INSERT INTO cs470_Employee_Punchin 
            (employee_id, punchin, approved, pending, punch_type) 
            VALUES (?, NOW(), ?, ?, 'Start Shift');
            `;

        dbConnection.query({
            sql: query,
            values: [Number(ctx.params.employee_id), Boolean(ctx.params.approved) ? 1 : 0, !Boolean(ctx.params.approved) ? 1 : 0]
        }, (error, result) => {
            if (error) {
                console.log("Connection error in PunchInController::addStartShift", error);
                ctx.status = 500;
                return reject(error);
            }
            console.log("Punch added successfully!");
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in addStartShift.", err);
        ctx.status = 500;
    });
}

const addEndShift = async (ctx) => {
    return new Promise((resolve, reject) => {

        let query = `
            INSERT INTO cs470_Employee_Punchin 
            (employee_id, punchin, approved, pending, punch_type) 
            VALUES (?, NOW(), ?, ?, 'End Shift');
            `;

        dbConnection.query({
            sql: query,
            values: [Number(ctx.params.employee_id), Boolean(ctx.params.approved) ? 1 : 0, !Boolean(ctx.params.approved) ? 1 : 0]
        }, (error, result) => {
            if (error) {
                console.log("Connection error in PunchInController::addEndShift", error);
                ctx.status = 500;
                return reject(error);
            }
            console.log("Punch added successfully!");
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in addEndShift.", err);
        ctx.status = 500;
    });
}

const addStartMeal = async (ctx) => {
    return new Promise((resolve, reject) => {

        let query = `
            INSERT INTO cs470_Employee_Punchin 
            (employee_id, punchin, approved, pending, punch_type) 
            VALUES (?, NOW(), ?, ?, 'Start Meal');
            `;

        dbConnection.query({
            sql: query,
            values: [Number(ctx.params.employee_id), Boolean(ctx.params.approved) ? 1 : 0, !Boolean(ctx.params.approved) ? 1 : 0]
        }, (error, result) => {
            if (error) {
                console.log("Connection error in PunchInController::addStartMeal", error);
                ctx.status = 500;
                return reject(error);
            }
            console.log("Punch added successfully!");
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in addStartMeal.", err);
        ctx.status = 500;
    });
}

const addEndMeal = async (ctx) => {
    return new Promise((resolve, reject) => {

        let query = `
            INSERT INTO cs470_Employee_Punchin 
            (employee_id, punchin, approved, pending, punch_type) 
            VALUES (?, NOW(), ?, ?, 'End Meal');
            `;

        dbConnection.query({
            sql: query,
            values: [Number(ctx.params.employee_id), Boolean(ctx.params.approved) ? 1 : 0, !Boolean(ctx.params.approved) ? 1 : 0]
        }, (error, result) => {
            if (error) {
                console.log("Connection error in PunchInController::addEndMeal", error);
                ctx.status = 500;
                return reject(error);
            }
            console.log("Punch added successfully!");
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in addEndMeal.", err);
        ctx.status = 500;
    });
}

const setPunchApproved = async (ctx) => {
    return new Promise((resolve, reject) => {

        let query = `
            UPDATE cs470_Employee_Punchin
            SET approved = TRUE, pending = FALSE
            WHERE employee_id = ? AND punchin = ?;
            `;

        dbConnection.query({
            sql: query,
            values: [Number(ctx.params.employee_id), ctx.params.punchin]
        }, (error, result) => {
            if (error) {
                console.log("Connection error in PunchInController::setPunchApproved", error);
                ctx.status = 500;
                return reject(error);
            }
            console.log("Punch approved successfully!");
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in setPunchApproved.", err);
        ctx.status = 500;
    });
}

const setPunchDenied = async (ctx) => {
    return new Promise((resolve, reject) => {

        let query = `
            UPDATE cs470_Employee_Punchin
            SET approved = FALSE, pending = FALSE
            WHERE employee_id = ? AND punchin = ?;
            `;

        dbConnection.query({
            sql: query,
            values: [Number(ctx.params.employee_id), ctx.params.punchin]
        }, (error, result) => {
            if (error) {
                console.log("Connection error in PunchInController::setPunchDenied", error);
                ctx.status = 500;
                return reject(error);
            }
            console.log("Punch denied successfully!");
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in setPunchDenied.", err);
        ctx.status = 500;
    });
}

module.exports = {
    addStartShift: addStartShift,
    addEndShift: addEndShift,
    addStartMeal: addStartMeal,
    addEndMeal: addEndMeal,
    setPunchApproved: setPunchApproved,
    setPunchDenied: setPunchDenied
};