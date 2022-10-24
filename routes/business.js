const express = require('express')
const router = express.Router();
const { upload } = require("../utils/utils")
const { signUp, signIn, verifyAccount,resendOTP, userProfile, profileUpdate, updatePassword, forgetPassword, newPassword, bussinesscompleteprofilesignup, signOut, socialLogin } = require("../controller/businessController")
const {bussinessAuth} = require('../auth/auth')

router.post('/businesssignup', upload.single("imageName"), signUp);
router.post('/businessverifyaccount', verifyAccount)
router.post('/businessresendotp', resendOTP)
router.post('/businesssociallogin', socialLogin)
router.post('/newpassword',newPassword)
router.post('/businesscompleteprofilesignup', bussinessAuth, bussinesscompleteprofilesignup)
router.post('/businesssignin', signIn) 
router.post('/businessforgetpassword', forgetPassword)
router.post('/businesssignout', bussinessAuth, signOut)



router.get('/businessprofile', bussinessAuth, userProfile)
router.post('/businesschangepassword', bussinessAuth, updatePassword) 
router.post('/businessprofileupdate',bussinessAuth, upload.single("imageName"),  profileUpdate)











module.exports = router