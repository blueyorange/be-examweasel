const router = require("express").Router();
const { postDocument } = require("../controllers/documents.controller");

router.post("/", postDocument);

module.exports = router;
