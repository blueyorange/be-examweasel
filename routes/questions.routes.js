const router = require("express").Router();
const { getQuestions } = require("../controllers/questions.controller");

router.get("/", getQuestions);

module.exports = router;
