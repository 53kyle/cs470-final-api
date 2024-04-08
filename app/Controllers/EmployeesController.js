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


module.exports = {
    allEmployees
};
