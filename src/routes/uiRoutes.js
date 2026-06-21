const express = require("express");

const { buildUiPage } = require("../ui/buildUiPage");

const { buildLandingPage } = require("../ui/buildLandingPage");

const uiRouter = express.Router();

uiRouter.get("/", (_req, res) => {
  res.type("html").send(buildLandingPage());
});

uiRouter.get("/ui", (_req, res) => {
  res.type("html").send(buildUiPage());
});

module.exports = {
  uiRouter,
};
