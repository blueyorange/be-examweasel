const router = require("express").Router();
const {
  postDocument,
  putDocument,
} = require("../controllers/documents.controller");

router.post("/", postDocument);
router.put("/:_id", putDocument);

module.exports = router;
