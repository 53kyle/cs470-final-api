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



/**
 * Register all of the controllers into the default controller.
 */
router.use(
    '',
    loginRouter.routes(),
    summaryRouter.routes()
);

module.exports = function (app) {
    app.use(router.routes());
    app.use(router.allowedMethods());
};
