const Authorize = require('../app/Middleware/Authorize.js');
const VerifyJWT = require('../app/Middleware/VerifyJWT.js');


/*
|--------------------------------------------------------------------------
| Default router
|--------------------------------------------------------------------------
|
| Default router is used to define any routes that don't belong to a
| controller. Also used as a parent container for the other routers.
|
*/
const router = require('koa-router')({
    prefix: '/api/v1'
});

router.get('/', function (ctx) {
    console.log('router.get(/)');
    return ctx.body = 'Status: 200';
});

/*
|--------------------------------------------------------------------------
| login router
|--------------------------------------------------------------------------
|
| Description
|
*/

// Login router configuration.

const LoginController = require('../app/Controllers/LoginController.js');
const loginRouter = require('koa-router')({
    prefix: '/login'
});

loginRouter.get('/:employee_id', LoginController.authorizeUser, (err) => console.log("routes.js: login-route error:", err));


// Summary router configuration.

const SummaryController = require('../app/Controllers/SummaryController.js');
const summaryRouter = require('koa-router')({
    prefix: '/summary'
});

summaryRouter.get('/main/:employee_id', SummaryController.mainSummaryWithID);
summaryRouter.get('/trained/:employee_id', SummaryController.trainedSummaryWithID);
summaryRouter.get('/availability/:employee_id', SummaryController.availabilitySummaryWithID);
summaryRouter.get('/requests/:employee_id', SummaryController.requestsSummaryWithID);

const ShiftsController = require('../app/Controllers/ShiftsController.js');
const shiftsRouter = require('koa-router')({
    prefix: '/shifts'
});

shiftsRouter.get('/all-shifts/:start_date/:end_date', ShiftsController.shiftsInRange);
shiftsRouter.get('/employee/:employee_id/:start_date/:end_date', ShiftsController.shiftsForEmployeeInRange);
shiftsRouter.get('/employee/:employee_id/next', ShiftsController.nextShiftForEmployee);
shiftsRouter.get('/employee/:employee_id/today', ShiftsController.todaysShiftForEmployee);
shiftsRouter.put('/update/:employee_id/:shift_id', ShiftsController.updateShift);
shiftsRouter.put('/post/:shift_id', ShiftsController.postShift);
shiftsRouter.get('/generator/:start_date/:end_date', ShiftsController.employeeCountByShift);
shiftsRouter.post('/add-shift', ShiftsController.addShift);
shiftsRouter.put('/edit-shift', ShiftsController.editShift);
shiftsRouter.delete('/delete-shift/:shift_id', ShiftsController.deleteShift);
shiftsRouter.get('/trained-departments', ShiftsController.allTrained);

const EmployeesController = require('../app/Controllers/EmployeesController.js');
const employeesRouter = require('koa-router')({
    prefix: '/employees'
}); 

employeesRouter.get('/all-employees', EmployeesController.allEmployees);
employeesRouter.get('/all-punches', EmployeesController.allPunches);
employeesRouter.get('/all-requests/timeoff', EmployeesController.allTimeoffRequests);
employeesRouter.get('/all-requests/availability', EmployeesController.allAvailabilityRequests);
employeesRouter.get('/requests/time-off/:employee_id', EmployeesController.timeOffRequestByID);
employeesRouter.post('/requests/add-time-off/:employee_id/:start_time/:end_time/:reason', EmployeesController.addTimeOffRequest);
employeesRouter.delete('/requests/remove-time-off/:employee_id/:start_time/:end_time/:reason', EmployeesController.removeTimeOffRequest);
employeesRouter.post('/requests/add-availability/:employee_id/:day_of_week/:start_time/:end_time/', EmployeesController.addAvailabilityRequest);
employeesRouter.get('/requests/availability/:employee_id', EmployeesController.availabilityRequestsByID);
employeesRouter.put('/update', EmployeesController.updateEmployee);
employeesRouter.get('/trained/:shift_id', EmployeesController.employeesTrainedInShift);
employeesRouter.get('/available/:shift_id', EmployeesController.employeesAvailableForShift);
employeesRouter.get('/hours/:start_date/:end_date', EmployeesController.employeeHoursInRange);
employeesRouter.get('/shifts/:start_date/:end_date', EmployeesController.employeeShiftsInRange);
employeesRouter.delete('/delete/:employee_id', EmployeesController.deleteEmployee);
employeesRouter.get('/availability/:employee_id', EmployeesController.fetchAvailabilityByID);
employeesRouter.put('/update-timeoff', EmployeesController.updateTimeoff);
employeesRouter.put('/update-availability-request', EmployeesController.updateAvailabilityRequest);

const PunchInController = require('../app/Controllers/PunchInController.js');
const punchInRouter = require('koa-router')({
    prefix: '/punchin'
});

punchInRouter.post('/start-shift/:employee_id/:approved', PunchInController.addStartShift);
punchInRouter.post('/end-shift/:employee_id/:approved', PunchInController.addEndShift);
punchInRouter.post('/start-meal/:employee_id/:approved', PunchInController.addStartMeal);
punchInRouter.post('/end-meal/:employee_id/:approved', PunchInController.addEndMeal);
punchInRouter.put('/set-approved/:employee_id/:punchin', PunchInController.setPunchApproved);
punchInRouter.put('/set-denied/:employee_id/:punchin', PunchInController.setPunchDenied);
punchInRouter.get('/last-punch/:employee_id', PunchInController.lastPunchForEmployee);
punchInRouter.get('/all-punch/:employee_id/:start_date/:end_date', PunchInController.punchesOnDayForEmployee);

const NotificationsController = require('../app/Controllers/NotificationsController');
const notificationsRouter = require('koa-router')({
    prefix: '/notifications'
});

notificationsRouter.post('/add-notification/:employee_id/:message', NotificationsController.addNotification);
notificationsRouter.delete('/remove-notification/:employee_id/:time', NotificationsController.removeNotification);
notificationsRouter.put('/set-notifications-read/:employee_id', NotificationsController.setNotificationsReadForEmployee);
notificationsRouter.get('/all-notifications/:employee_id', NotificationsController.notificationsForEmployee);
notificationsRouter.get('/pending-count', NotificationsController.availabilityTimeOffPendingCount);
notificationsRouter.get('/punch-pending-count', NotificationsController.punchinPendingCount);

/**
 * Register all of the controllers into the default controller.
 */
router.use(
    '',
    loginRouter.routes(),
    summaryRouter.routes(),
    shiftsRouter.routes(),
    employeesRouter.routes(),
    punchInRouter.routes(),
    notificationsRouter.routes()
);

module.exports = function (app) {
    app.use(router.routes());
    app.use(router.allowedMethods());
};
