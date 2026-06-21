const express = require("express");

const { buildUiPage } = require("../ui/buildUiPage");

const uiRouter = express.Router();

uiRouter.get("/", (_req, res) => {
  res.json({
    message: "API is running",
    endpoints: ["GET /ui", "GET /api/requests", "POST /api/log"],
  });
});

uiRouter.get("/ui", (_req, res) => {
  res.type("html").send(buildUiPage());
});

module.exports = {
  uiRouter,
};
