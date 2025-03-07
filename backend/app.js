// backend/app.js
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const documentRoutes = require("./routes/documentRoutes");
const scanRoutes = require("./routes/scanRoutes");
const adminRoutes = require("./routes/adminRoutes");
const creditRoutes = require("./routes/creditRoutes");

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use(bodyParser.json());

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
    httpOnly: true,
  })
);

// Register routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/", documentRoutes);
app.use("/scan", scanRoutes);

// Admin routes
const roleMiddleware = require("./middlewares/roleMiddleware");

app.use("/credits", roleMiddleware, creditRoutes);
app.use("/admin", roleMiddleware, adminRoutes);

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

module.exports = app;
