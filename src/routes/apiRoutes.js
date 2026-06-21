const express = require("express");

const { upload } = require("../middleware/upload");
const { getRecentRequests, storeRequestSnapshot } = require("../store/requestStore");
const { collectUrlFieldMetadata } = require("../services/urlMetadataService");

const apiRouter = express.Router();

apiRouter.get("/api/requests", (_req, res) => {
  res.json({
    requests: getRecentRequests(),
  });
});

apiRouter.post("/api/log", upload.any(), async (req, res) => {
  const body = req.body || {};
  const files = (req.files || []).map((file) => ({
    fieldname: file.fieldname,
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
  }));

  const requestId = String(Date.now()) + "-" + Math.random().toString(36).slice(2, 8);

  console.log("\n--- Incoming Request ---");
  console.log("Headers:", req.headers);
  console.log("Received body fields:", body);
  console.log("Received files:", files);

  const urlFields = await collectUrlFieldMetadata(body);

  storeRequestSnapshot({
    id: requestId,
    method: req.method,
    path: req.originalUrl,
    ip: req.ip,
    receivedAt: new Date().toISOString(),
    headers: req.headers,
    body,
    files,
    urlFields,
  });

  console.log("------------------------\n");

  res.status(200).json({
    message: "Data received and logged successfully",
    requestId,
    body,
    files,
    urlFields,
  });
});

module.exports = {
  apiRouter,
};
