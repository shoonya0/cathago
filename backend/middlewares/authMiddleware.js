const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // check if the token is already in the session cookie then match the token with the user request this part is left

  // let data = "";
  // req.on("data", (chunk) => {
  //   data += chunk;
  // });
  // req.on("end", () => {
  //   console.log(data);
  // });

  // if user is already logged in, skip the token verification
  if (req.session.user != null) {
    // recover expire time from the token
    const token = req.session.user.token;
    const decoded = jwt.verify(token, "secret");
    const expiresIn = decoded.exp;

    // check if the token is expired
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    if (expiresIn < currentTime) {
      // delete the session
      req.session.destroy();
      console.warn("Token has expired. Please login again.");
      return res.status(403).send("Token has expired. Please login again.");
    }
    next();
  } else {
    const token = req.headers["x-access-token"];

    if (!token) {
      console.error("No token provided.");
      return res.status(403).send("No token provided."); // Send a 403 status if no token provided
    }

    jwt.verify(token, "secret", (err, decoded) => {
      if (err) {
        console.error("Token verification error:");
        return res.status(403).send("Token verification error.");
      }

      // Check if the token is expired
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      if (decoded.exp < currentTime) {
        console.warn("Token has expired. It will be reset after 24 hours.");
        return res
          .status(403)
          .send("Token has expired. It will be reset after 24 hours.");
      }

      // if the token is valid, set the user in the session
      req.session.user = {
        id: decoded.id,
        username: decoded.name,
        role: decoded.role,
        token: token,
        expiresIn: 86400,
        cookie: req.session.cookie,
      };

      next();
    });
  }
};
