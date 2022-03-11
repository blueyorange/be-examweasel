const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
// Errors
const {
  handleInvalidUrlErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./error-handler/error");
// Auth
const auth = require("./auth/jwt.auth");

// Routers
const authRouter = require("./routes/auth.routes");
const home = require("./routes/home.routes");
const apiRouter = require("./routes/api.routes");

// middleware
const corsOptions = {
  cors: true,
  origins: [process.env.CORS_ORIGIN],
};
app.use(cors(corsOptions));
app.use(express.json());
app.use("/", home);
app.use("/auth", authRouter);
app.use(auth);
app.use("/api", apiRouter);
app.all("*", handleInvalidUrlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
