const express = require('express')
const router = express.Router();
const { upload } = require("../utils/utils")
const { signUp, signIn, verifyAccount,resendOTP, userProfile, profileUpdate, updatePassword, forgetPassword, newPassword, signOut, socialLogin, usercompleteprofilesignup } = require("../controller/userController")
const {upcomingappointment,completedappointment} = require("../controller/appointmentsController")
const {userAuth} = require('../auth/auth')



router.post('/signup', upload.single("imageName"), signUp);
router.post('/verifyaccount', verifyAccount)
router.post('/resendotp', resendOTP)
router.post('/sociallogin',upload.single("imageName"), socialLogin)
router.post('/signin', signIn) 
router.post('/forgetpassword', forgetPassword)
router.post('/signout', userAuth, signOut)
router.post('/usercompleteprofilesignup',upload.single("imageName"), userAuth, usercompleteprofilesignup)
router.get('/profile', userAuth, userProfile)
router.post('/changepassword', userAuth, updatePassword) 
router.post('/profileupdate', userAuth,upload.single("imageName"), profileUpdate)
router.post('/newpassword',newPassword)


router.get('/getupcomingappointment',userAuth, upcomingappointment); //appointment api
router.get('/getcompletedappointment',userAuth, completedappointment); //appointment api










module.exports = router