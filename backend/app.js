// backend/app.js
const express = require("express");
const session = require("express-session");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const documentRoutes = require("./routes/documentRoutes");
const scanRoutes = require("./routes/scanRoutes");
const adminRoutes = require("./routes/adminRoutes");
const creditRoutes = require("./routes/creditRoutes");
const jsonBodyParser = require("./middlewares/jsonBodyParser");
const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5500"); // Allow requests from this origin
  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-access-token"
  );
  res.header("Access-Control-Allow-Credentials", "true"); // Allow cookies to be sent with requests
  next();
});

app.options("*", (req, res) => {
  res.sendStatus(200);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

app.use(express.urlencoded({ extended: true }));

// app.use(jsonBodyParser);
app.use(express.json());
// make an docker container and then use it as api

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
app.use("/", scanRoutes);
app.use("/credits", creditRoutes);

// Admin routes
const roleMiddleware = require("./middlewares/roleMiddleware");

app.use("/admin", roleMiddleware, adminRoutes);
// app.use(express.static(path.join(__dirname, "public")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(path, "public", "index.html"));
// });

module.exports = app;
