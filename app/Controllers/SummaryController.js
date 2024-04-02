const dbConnection = require('../../database/mySQLconnect');
const setAccessToken = require('../../config/setAccessToken');


require('dotenv').config();

const mainSummaryWithID = async (ctx) => {
    return new Promise((resolve, reject) => {

        let query = `SELECT
                employee_id,
                first_name,
                middle_name,
                last_name,
                max_hours
            FROM cs470_Employee
            WHERE employee_id = ?;`;
            
        dbConnection.query(
            {
                sql: query,
                values: [Number(ctx.params.employee_id)]
            }, (error, tuples) => {
                if (error) {
                    console.log("Query error.", error);
                    return reject(`Query error. Error msg: error`);
                }
                if (tuples.length === 1) {  // Did we have a matching user record?
                    setAccessToken(ctx, tuples[0]);
                    console.log('From authorizeUser. About to return ', tuples[0]);
                    ctx.body = {
                        status: "OK",
                        user: tuples[0],
                    };
                } else {
                    console.log('Not able to identify the user.');
                    return reject('No such user.');
                }
                return resolve();
            }
        )
    }).catch(err => {
        console.log('mainSummaryWithID in SummaryController threw an exception. Reason...', err);
        ctx.status = 200;
        ctx.body = {
            status: "Failed",
            error: err,
            user: null
        };
    });
}

const trainedSummaryWithID = async (ctx) => {
    return new Promise((resolve, reject) => {

        let query = `SELECT
                *
            FROM cs470_Employee_Trained
            WHERE employee_id = ?;`;

        dbConnection.query({
            sql: query,
            values: [ctx.params.employee_id]
        }, (error, tuples) => {
            if (error) {
                console.log("Connection error in SummaryController::trainedSummaryWithID", error);
                ctx.body = [];
                ctx.status = 200;
                return reject(error);
            }
            ctx.body = tuples;
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in trainedSummaryWithID.", err);
        ctx.body = [];
        ctx.status = 500;
    });
}


const availabilitySummaryWithID = async (ctx) => {
    return new Promise((resolve, reject) => {

        let query = `SELECT
                *
            FROM cs470_Employee_Availability
            WHERE employee_id = ?;`;

        dbConnection.query({
            sql: query,
            values: [ctx.params.employee_id]
        }, (error, tuples) => {
            if (error) {
                console.log("Connection error in SummaryController::availabilitySummaryWithID", error);
                ctx.body = [];
                ctx.status = 200;
                return reject(error);
            }
            ctx.body = tuples;
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in availabilitySummaryWithID.", err);
        ctx.body = [];
        ctx.status = 500;
    });
}


const requestsSummaryWithID = async (ctx) => {
    return new Promise((resolve, reject) => {

        let query = `SELECT
                *
            FROM cs470_Employee_Timeoff
            WHERE employee_id = ?;`;

        dbConnection.query({
            sql: query,
            values: [ctx.params.employee_id]
        }, (error, tuples) => {
            if (error) {
                console.log("Connection error in SummaryController::requestsSummaryWithID", error);
                ctx.body = [];
                ctx.status = 200;
                return reject(error);
            }
            ctx.body = tuples;
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in requestsSummaryWithID.", err);
        ctx.body = [];
        ctx.status = 500;
    });
}

module.exports = {
    mainSummaryWithID,
    trainedSummaryWithID,
    availabilitySummaryWithID,
    requestsSummaryWithID
};
