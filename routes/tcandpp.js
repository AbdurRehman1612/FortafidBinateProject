const express = require('express')
const router = express.Router();
const { getContents, updateContent } = require("../controller/tcandppController")


router.get("/content/:content_type", getContents);
router.post("/content/:content_type", updateContent);










module.exports = router