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

const path = require("path");
const fs = require("fs");

const dummyDataPath = path.join(__dirname, "../data/dummyData.json");

function readDummyData() {
  try {
    const data = fs.readFileSync(dummyDataPath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading dummy data file:", err);
    return [];
  }
}

function writeDummyData(data) {
  try {
    fs.writeFileSync(dummyDataPath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Error writing dummy data file:", err);
    return false;
  }
}

apiRouter.get("/api/dummy", (req, res) => {
  const items = readDummyData();
  const requestId = String(Date.now()) + "-" + Math.random().toString(36).slice(2, 8);
  storeRequestSnapshot({
    id: requestId,
    method: req.method,
    path: req.originalUrl,
    ip: req.ip,
    receivedAt: new Date().toISOString(),
    headers: req.headers,
    body: req.query || {},
    files: [],
    urlFields: [],
  });
  res.json(items);
});

apiRouter.get("/api/dummy/:id", (req, res) => {
  const items = readDummyData();
  const item = items.find((i) => i.id === req.params.id);
  const requestId = String(Date.now()) + "-" + Math.random().toString(36).slice(2, 8);
  storeRequestSnapshot({
    id: requestId,
    method: req.method,
    path: req.originalUrl,
    ip: req.ip,
    receivedAt: new Date().toISOString(),
    headers: req.headers,
    body: { id: req.params.id },
    files: [],
    urlFields: [],
  });
  if (!item) {
    return res.status(404).json({ error: "Item not found" });
  }
  res.json(item);
});

apiRouter.put("/api/dummy/:id", (req, res) => {
  const items = readDummyData();
  const index = items.findIndex((i) => i.id === req.params.id);
  const requestId = String(Date.now()) + "-" + Math.random().toString(36).slice(2, 8);
  storeRequestSnapshot({
    id: requestId,
    method: req.method,
    path: req.originalUrl,
    ip: req.ip,
    receivedAt: new Date().toISOString(),
    headers: req.headers,
    body: req.body || {},
    files: [],
    urlFields: [],
  });
  if (index === -1) {
    return res.status(404).json({ error: "Item not found" });
  }
  const updatedItem = {
    ...items[index],
    ...req.body,
    id: req.params.id,
  };
  items[index] = updatedItem;
  writeDummyData(items);
  res.json({
    message: "Item updated successfully",
    item: updatedItem,
  });
});

apiRouter.delete("/api/dummy/:id", (req, res) => {
  const items = readDummyData();
  const index = items.findIndex((i) => i.id === req.params.id);
  const requestId = String(Date.now()) + "-" + Math.random().toString(36).slice(2, 8);
  storeRequestSnapshot({
    id: requestId,
    method: req.method,
    path: req.originalUrl,
    ip: req.ip,
    receivedAt: new Date().toISOString(),
    headers: req.headers,
    body: { id: req.params.id },
    files: [],
    urlFields: [],
  });
  if (index === -1) {
    return res.status(404).json({ error: "Item not found" });
  }
  const deletedItem = items[index];
  items.splice(index, 1);
  writeDummyData(items);
  res.json({
    message: "Item deleted successfully",
    item: deletedItem,
  });
});

module.exports = {
  apiRouter,
};

