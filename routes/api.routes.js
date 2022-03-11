const apiRouter = require("express").Router();
const userRouter = require("./users.routes");
const apiInfoRouter = require("./info.routes");

apiRouter.use("/users", userRouter);
apiRouter.use("/", apiInfoRouter);

module.exports = apiRouter;
