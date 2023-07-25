const express = require('express');
const docsRoute = require('./docs.route');
const documentRoute = require('./document.route');
const webhookRoute = require('./webhook.route');
const emailRoute = require('./email.route');
const templateRoute = require('./template.route');

const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
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
