const router = require("express").Router();
const {
  getQuestions,
  postQuestion,
  patchQuestion,
  deleteQuestion,
} = require("../controllers/questions.controller");

router.get("/", getQuestions);
router.post("/", postQuestion);
router.patch("/:_id", patchQuestion);
router.delete("/:_id", deleteQuestion);

module.exports = router;
