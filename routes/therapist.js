const express = require('express')
const router = express.Router();
const { upload } = require("../utils/utils")
const { signUp, signIn, verifyAccount,resendOTP, userProfile, profileUpdate, updatePassword, forgetPassword, newPassword, therapistcompleteprofilesignup, signOut, socialLogin } = require("../controller/therapistController")
const {upcomingappointmenttherapist,completedappointmenttherapist} = require("../controller/appointmentsController")
const {therapistAuth} = require('../auth/auth')

router.post('/therapistsignup', upload.single("imageName"), signUp);
router.post('/therapistverifyaccount', verifyAccount)
router.post('/therapistresendotp', resendOTP)
router.post('/therapistsociallogin',upload.single("imageName"), socialLogin)
router.post('/therapistcompleteprofilesignup', upload.single("imageName"), therapistAuth, therapistcompleteprofilesignup)
router.post('/therapistsignin', signIn) 
router.post('/therapistforgetpassword', forgetPassword)
router.post('/therapistsignout', therapistAuth, signOut)
router.get('/therapistprofile', therapistAuth, userProfile)
router.post('/therapistchangepassword', therapistAuth, updatePassword) 
router.post('/therapistprofileupdate', therapistAuth,upload.single("imageName"), profileUpdate)
router.post('/newpassword',newPassword)

router.get('/getupcomingappointmenttherapist',therapistAuth, upcomingappointmenttherapist); //appointment api
router.get('/getcompletedappointmenttherapist',therapistAuth, completedappointmenttherapist); //appointment api










module.exports = router