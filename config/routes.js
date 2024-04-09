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

const EmployeesController = require('../app/Controllers/EmployeesController.js');
const employeesRouter = require('koa-router')({
    prefix: '/employees'
});

employeesRouter.get('/all-employees', EmployeesController.allEmployees);
employeesRouter.get('/all-punches', EmployeesController.allPunches);
employeesRouter.get('/all-requests', EmployeesController.allRequests);
employeesRouter.get('/requests/time-off/:employee_id', EmployeesController.timeOffRequestByID);
employeesRouter.get('/requests/availability/:employee_id', EmployeesController.availabilityRequestsByID);
employeesRouter.put('/update/:employee_id', EmployeesController.updateEmployee);
/**
 * Register all of the controllers into the default controller.
 */
router.use(
    '',
    loginRouter.routes(),
    summaryRouter.routes(),
    shiftsRouter.routes(),
    employeesRouter.routes()
);

module.exports = function (app) {
    app.use(router.routes());
    app.use(router.allowedMethods());
};
