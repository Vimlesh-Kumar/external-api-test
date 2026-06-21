# External API Test Workspace & Request Inspector

A beautiful, lightweight, and modern API testing utility built with **Node.js, Express, and Vanilla JS/CSS**. It serves as a visual playground where you can inspect webhooks, parse files, test multi-part payloads, preview URL contents in real-time, and play with a mock JSON database.

---

## 🚀 Key Features

* **Interactive Landing Page**: A premium workspace documenting all endpoints dynamically with built-in cURL code generators and immediate access links.
* **Real-time Request Inspector UI**: A dashboard that captures headers, query parameters, parsed JSON/url-encoded bodies, file attachments, and metadata, updating instantly without page reloads.
* **Multipart Form-Data & File Uploads**: Built-in support using Multer to capture and display uploaded file structures.
* **Dynamic URL Metadata & Preview**: Detects URLs inside incoming bodies, resolves their MIME types/content length, and renders interactive previews (images, video, audio, PDFs, HTML frames) right inside the dashboard.
* **Dummy Database Store**: A local file-backed JSON database at `src/data/dummyData.json` supporting standard REST operations (`GET`, `PUT`, `DELETE`).

---

## 🛠 Project Structure

```
external-api-test/
├── server.js                 # Entrypoint - boots up Express server
└── src/
    ├── app.js                # App configuration, middle-ware pipelines
    ├── config.js             # Environment-based configuration (Port, etc.)
    ├── data/
    │   └── dummyData.json    # File-backed local mock database
    ├── middleware/
    │   └── upload.js         # Multer instance for multipart upload capture
    ├── routes/
    │   ├── apiRoutes.js      # REST endpoints & dummy data handlers
    │   └── uiRoutes.js       # HTML view routes
    ├── services/
    │   └── urlMetadataService.js # HEAD request resolver for URL previews
    ├── store/
    │   └── requestStore.js   # In-memory history for request logs
    └── ui/
        ├── buildLandingPage.js # Dynamic landing page HTML template
        └── buildUiPage.js      # Real-time Request Inspector Dashboard UI
```

---

## ⚡ Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v16.0.0 or higher recommended)

### Installation
Clone or navigate to the project directory, then install the dependencies:
```bash
npm install
```

### Running the Server
To run the server locally with auto-reload (watch mode):
```bash
npm run dev
```
The server will start at **`http://localhost:8000`**.

---

## 📖 API Endpoints Reference

### View & Dashboard Routing

#### `GET /`
Serves the **API Workspace Landing Page**. Provides dynamic document references and example test commands for every endpoint.

#### `GET /ui`
Serves the **Request Inspector UI Dashboard**. Real-time dashboard that displays a logs timeline of all incoming requests and allows tabbed inspection of headers, body, links, and files.

---

### Request Logger Endpoints

#### `POST /api/log`
The general logging endpoint. Send webhooks, payloads, or files here to inspect them in the UI dashboard.
* Supports: `application/json`, `application/x-www-form-urlencoded`, and `multipart/form-data`.

**Example cURL:**
```bash
curl -X POST http://localhost:8000/api/log \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello from API Tester!", "avatar": "https://dummyimage.com/600x400/000/fff"}'
```

#### `GET /api/requests`
Retrieves the logged requests history as a JSON list. Used by the dashboard UI for polling logs.

---

### Dummy REST Database Endpoints
Interact with the local mock database stored at `src/data/dummyData.json`.

#### `GET /api/dummy`
Lists all items currently stored in the mock database.
```bash
curl -X GET http://localhost:8000/api/dummy
```

#### `GET /api/dummy/:id`
Retrieves a specific item details by its ID.
```bash
curl -X GET http://localhost:8000/api/dummy/1
```

#### `PUT /api/dummy/:id`
Updates the fields of a specific item by its ID. The changes are immediately written back to the JSON file on disk.
```bash
curl -X PUT http://localhost:8000/api/dummy/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Upgraded Wireless Headphones", "price": 109.99}'
```

#### `DELETE /api/dummy/:id`
Removes an item from the mock database by its ID. The changes are immediately written back to the JSON file on disk.
```bash
curl -X DELETE http://localhost:8000/api/dummy/2
```
