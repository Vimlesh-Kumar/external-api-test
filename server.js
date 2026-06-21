const { createApp } = require("./src/app");
const { port } = require("./src/config");

const app = createApp();

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
