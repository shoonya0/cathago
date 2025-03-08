function jsonBodyParser(req, res, next) {
  let data = "";
  // Listen for data events to accumulate the request body
  req.on("data", (chunk) => {
    data += chunk;
  });

  // Listen for the end event to parse the accumulated data
  req.on("end", () => {
    try {
      // to check if form data is empty and if it is then parse the body as json
      if (req.headers["content-type"] === "multipart/form-data") {
        // if request have body then parse the body as json
        if (data) {
          req.body = JSON.parse(data);
        }
      }
    } catch (err) {
      // If parsing fails, send a 400 Bad Request response
      return res.status(400).send({ error: "Invalid JSON" });
    }
    // Call the next middleware in the stack
    next();
  });
}

module.exports = jsonBodyParser;
