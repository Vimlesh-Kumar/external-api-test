const express = require("express");

const { uiRouter } = require("./routes/uiRoutes");
const { apiRouter } = require("./routes/apiRoutes");

function createApp() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(uiRouter);
  app.use(apiRouter);

  return app;
}

module.exports = {
  createApp,
};
