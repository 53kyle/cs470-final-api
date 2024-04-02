const dbConnection = require('../../database/mySQLconnect');
const setAccessToken = require('../../config/setAccessToken');


require('dotenv').config();

const authorizeUser = async (ctx) => {
        return new Promise((resolve, reject) => {
	    
            let query = "SELECT * FROM cs470_Employee WHERE employee_id = ?";

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
            console.log('authorizeUser in LoginController threw an exception. Reason...', err);
	        ctx.status = 200;
            ctx.body = {
                status: "Failed",
                error: err,
                user: null
            };
        });
}

module.exports = {
    authorizeUser,
};
