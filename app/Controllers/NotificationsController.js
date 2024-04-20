const dbConnection = require('../../database/mySQLconnect');
const setAccessToken = require('../../config/setAccessToken');


require('dotenv').config();

const addNotification = async (ctx) => {
    return new Promise((resolve, reject) => {

        let query = `
            INSERT INTO cs470_Notification 
            (employee_id, time, unread, message) 
            VALUES (?, NOW(), TRUE, ?);
            `;

        dbConnection.query({
            sql: query,
            values: [Number(ctx.params.employee_id), ctx.params.message]
        }, (error, result) => {
            if (error) {
                console.log("Connection error in NotificationsController::addNotification", error);
                ctx.status = 500;
                return reject(error);
            }
            console.log("Notification added successfully!");
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in addNotification.", err);
        ctx.status = 500;
    });
}

const setNotificationsReadForEmployee = async (ctx) => {
    return new Promise((resolve, reject) => {

        const query = `
            UPDATE cs470_Notification
            SET unread = FALSE
            WHERE employee_id = ?;
        `;

        dbConnection.query({
            sql: query,
            values: [Number(ctx.params.employee_id)]
        }, (error, result) => {
            if (error) {
                console.log("Connection error in NotificationsController::setNotificationsReadForEmployee", error);
                ctx.status = 500;
                return reject(error);
            }
            console.log("Notifications updated successfully!");
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in setNotificationsReadForEmployee.", err);
        ctx.status = 500;
    });
}

const notificationsForEmployee = async (ctx) => {
    return new Promise((resolve, reject) => {

        let query = `SELECT *
            FROM cs470_Notification
            WHERE employee_id = ?
            ORDER BY time DESC;`;

        dbConnection.query({
            sql: query,
            values: [Number(ctx.params.employee_id)]
        }, (error, tuples) => {
            if (error) {
                console.log("Connection error in NotificationsController::notificationsForEmployee", error);
                ctx.body = [];
                ctx.status = 200;
                return reject(error);
            }
            ctx.body = tuples;
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in notificationsForEmployee.", err);
        ctx.body = [];
        ctx.status = 500;
    });
}

module.exports = {
    addNotification,
    setNotificationsReadForEmployee,
    notificationsForEmployee
};
