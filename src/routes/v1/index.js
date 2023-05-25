const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const documentRoute = require('./document.route');
const webhookRoute = require('./webhook.route');
const emailRoute = require('./email.route');
const templateRoute = require('./template.route');

const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/document',
    route: documentRoute,
  },
  {
    path: '/webhook',
    route: webhookRoute,
  },
  {
    path: '/email',
    route: emailRoute,
  },
  {
    path: '/template',
    route: templateRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

/* Use dev ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
