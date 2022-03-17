const router = require("express").Router();
const {
  getQuestions,
  postQuestion,
  putQuestion,
  deleteQuestion,
} = require("../controllers/questions.controller");

router.get("/", getQuestions);
router.post("/", postQuestion);
router.put("/:_id", putQuestion);
router.delete("/:_id", deleteQuestion);

module.exports = router;
