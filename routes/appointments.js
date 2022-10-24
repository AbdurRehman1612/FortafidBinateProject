const express = require('express')
const router = express.Router();
const { requestappointments,getselecttherapist, acceptappointments, rejectappointments, therapistRadius, getUserAppointmentNotification, getTherapistAppointmentNotification } = require("../controller/appointmentsController")
const {therapistAuth,userAuth} = require('../auth/auth')




router.post('/getselecttherapist',userAuth, getselecttherapist);
router.post('/requestappointments',userAuth, requestappointments);
router.post('/acceptappointment',therapistAuth, acceptappointments);
router.post('/therapistinradius',userAuth, therapistRadius); 
router.post('/rejectappointment',therapistAuth, rejectappointments);

router.get('/getusernotification',userAuth, getUserAppointmentNotification);
router.get('/gettherapistnotification',therapistAuth, getTherapistAppointmentNotification);




module.exports = router