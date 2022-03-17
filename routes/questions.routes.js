const router = require("express").Router();
const {
  getQuestions,
  postQuestion,
  putQuestion,
} = require("../controllers/questions.controller");

router.get("/", getQuestions);
router.post("/", postQuestion);
router.put("/:_id", putQuestion);

module.exports = router;
