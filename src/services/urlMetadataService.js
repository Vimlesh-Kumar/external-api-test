async function collectUrlFieldMetadata(body) {
  const urlFields = [];
  const possibleUrlFields = Object.entries(body || {}).filter(([, val]) =>
    typeof val === "string" && val.startsWith("http")
  );

  if (possibleUrlFields.length > 0) {
    console.log("\n--- URL Fields Detected ---");
  }

  for (const [field, url] of possibleUrlFields) {
    try {
      const response = await fetch(url, { method: "HEAD" });
      const info = {
        field,
        url,
        status: response.status,
        contentType: response.headers.get("content-type"),
        contentLength: response.headers.get("content-length"),
      };
      urlFields.push(info);
      console.log("URL field info:", info);
    } catch (err) {
      const info = {
        field,
        url,
        error: err.message,
      };
      urlFields.push(info);
      console.log(`Failed to fetch URL for field "${field}":`, err.message);
    }
  }

  return urlFields;
}

module.exports = {
  collectUrlFieldMetadata,
};
