const apiRouter = require("express").Router();
const userRouter = require("./users.routes");
const questionRouter = require("./questions.routes");
const apiInfoRouter = require("./info.routes");
const documentRouter = require("./documents.routes");

apiRouter.use("/", apiInfoRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/questions", questionRouter);
apiRouter.use("/documents", documentRouter);

module.exports = apiRouter;
