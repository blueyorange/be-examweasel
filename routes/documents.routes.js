const router = require("express").Router();
const {
  postDocument,
  putDocument,
  deleteDocument,
} = require("../controllers/documents.controller");

router.post("/", postDocument);
router.put("/:_id", putDocument);
router.delete("/:_id", deleteDocument);

module.exports = router;
