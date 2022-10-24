const express = require('express')
const router = express.Router();
const { chatInbox } = require("../controller/chatController")
const {userAuth,therapistAuth} = require('../auth/auth')


router.get('/:senderId', chatInbox)











module.exports = router