const mongoose = require("mongoose");
const db = require("../models");
const moment = require("moment");
const cron = require("node-cron");
const push_notification = require("../utils/push_notification");

// const { sendVerificationEmail } = require("../utils/utils");

const requestappointments = async (req, res) => {
  const { therapies, dateofappointment, timeofappointment, address, isrecurring, noofclients, therapist_id, lat, long } = req.body;

  // console.log("req.user.location", req.user.location)

  if (!therapies) {
    return res.status(400).send({ status: 0, message: "therapies is required" });
  }
  else if (!dateofappointment) {
    return res.status(400).send({ status: 0, message: "dateofappointment is required" });
  }
  else if (!timeofappointment) {
    return res.status(400).send({ status: 0, message: "timeofappointment is required" });
  }
  else if (!address) {
    return res.status(400).send({ status: 0, message: "address is required" });
  }
  else if (!noofclients) {
    return res.status(400).send({ status: 0, message: "noofclients is required" });
  }


  else {

    try {

      const appointments = new db.Appointments({ therapies: therapies, dateofappointment: dateofappointment, timeofappointment: timeofappointment, addressofappointment: address, isrecurring: isrecurring, noofclients: noofclients, user_id: req.user._id, therapist_id: therapist_id, "location.coordinates": [long, lat] });
      await appointments.save();
      // sendVerificationEmail(user);

      const appointmentdata = await db.Appointments.findOne({ _id: appointments._id }).populate("therapist_id").populate("therapies")
      const notiuser = await db.Therapist.findOne({ _id: therapist_id })
      // const notiuser1= await db.User.findOne({_id: req.user._id })

      const notification_obj = {
        user_device_token: notiuser.user_device_token,
        sender_text: "",
        heading: `You have an appointment request from ${req.user.name}`
        // + SelectedStatus,
      };
      push_notification(notification_obj);

      const notification = new db.Notification({ message: `You have an appointment request from ${req.user.name}`, user_id: notiuser._id });
      await notification.save();




      res
        .status(200)
        .send({ status: 1, message: "Appointment added successfully", data: appointmentdata });
    } catch (err) {
      return res.status(400).send(err.message);
    }
  }
};

const getselecttherapist = async (req, res) => {
  const { therapies } = req.body;

  const therapists = []
  const therapistsdetails = []



  console.log('therapies', therapies)
  try {



    for (let i = 0; i < therapies.length; i++) {

      const therapistsavailable = await db.Therapies.find({ _id: therapies[i] }).select("therapists")

      console.log('therapistsavailable', therapistsavailable)


      therapistsavailable.map((ta) => {

        console.log("ta", ta.therapists)
        ta.therapists.map((t) => {
          console.log("tttttttttttttttttt", t)
          console.log('therapists', therapists)
          var abc = therapists.includes(t.toString())
          console.log("checkkkkk", abc)
          if (!abc) {
            console.log("ifffff")
            therapists.push(t.toString())

          }

          // else{
          //   console.log("hiii")
          // }

        })

      })


    }



    for (let i = 0; i < therapists.length; i++) {

      const therapistsvalues = await db.Therapist.find({ _id: therapists[i] })

      therapistsvalues.map((t) => {
        console.log("t", t)

        therapistsdetails.push(t)

      })

    }
    console.log("therapistsdetails", therapistsdetails)

    // sendVerificationEmail(user);
    res
      .status(200)
      .send({ status: 1, data: therapistsdetails });
  } catch (err) {
    return res.status(400).send(err.message);
  }

};

const acceptappointments = async (req, res) => {


  try {

    const acceptreq = await db.Appointments.findOneAndUpdate(
      { _id: req.body._id },
      { requeststatus: 1 },
      { new: true }
    );


    const acceptreqq = await db.Appointments.findOne({ _id: req.body._id })
    const acceptreq1 = await db.User.findOne({ _id: acceptreqq.user_id })

    console.log("acceptreqq", acceptreqq)
    console.log("acceptreq1", acceptreq1)




    const notification_obj = {
      user_device_token: acceptreq1.user_device_token,
      sender_text: "",
      heading: `Your appointment request has been accepted by ${req.therapist.name}`

    };
    push_notification(notification_obj);

    const notification = new db.Notification({ message: `Your appointment request has been accepted by ${req.therapist.name}`, user_id: acceptreq1._id });
    await notification.save();
    res
      .status(200)
      .send({ status: 1, message: "Request accepted successfully", data: acceptreq });
  } catch (err) {
    return res.status(400).send(err.message);
  }

};
const rejectappointments = async (req, res) => {


  try {
    const rejectreq = await db.Appointments.findByIdAndUpdate(
      { _id: req.body._id },
      { $set: { requeststatus: 0 } }
    );
    res
      .status(200)
      .send({ status: 1, message: "Request declined successfully", data: rejectreq });
  } catch (err) {
    return res.status(400).send(err.message);
  }

};

const upcomingappointment = async (req, res) => {


  try {

    const datetoday = moment(new Date()).format("YYYY-MM-DD")


    console.log(datetoday)
    const check = await db.Appointments.find({ user_id: req.user._id, dateofappointment: { $gte: datetoday } }).populate("therapies")

    if (check.length > 0) {

      return res
        .status(200)
        .send({ status: 1, data: check });


    }
    else {
      return res
        .status(400)
        .send({ status: 0, message: "no upcoming appointments avaiable" });
    }
  }
  catch (err) {
    return res.status(400).send(err.message);
  }



};

const completedappointment = async (req, res) => {

  try {

    const datetoday = moment(new Date()).format("YYYY-MM-DD")


    console.log(datetoday)
    const check = await db.Appointments.find({ user_id: req.user._id, dateofappointment: { $lt: datetoday } }).populate("therapies")

    if (check.length > 0) {

      return res
        .status(200)
        .send({ status: 1, data: check });
    }

    else {
      return res
        .status(400)
        .send({ status: 0, message: "no completed appointments avaiable" });
    }
  }
  catch (err) {
    return res.status(400).send(err.message);
  }

};



const upcomingappointmenttherapist = async (req, res) => {


  try {

    const datetoday = moment(new Date()).format("YYYY-MM-DD")



    const check = await db.Appointments.find({ therapist_id: req.therapist._id, dateofappointment: { $gte: datetoday } }).populate("therapies")


    if (check.length < 1) {
      return res
        .status(400)
        .send({ status: 0, message: "no upcoming appointments avaiable" });
    }
    else {


      return res
        .status(200)
        .send({ status: 1, data: check });
    }
  }
  catch (err) {
    return res.status(400).send(err.message);
  }



};

const completedappointmenttherapist = async (req, res) => {

  try {

    const datetoday = moment(new Date()).format("YYYY-MM-DD")


    const check = await db.Appointments.find({ therapist_id: req.therapist._id, dateofappointment: { $lt: datetoday } }).populate("therapies")

    if (check.length > 0) {




      return res
        .status(200)
        .send({ status: 1, data: check });

    }
    else {
      return res
        .status(400)
        .send({ status: 0, message: "no completed appointments avaiable" });
    }
  }
  catch (err) {
    return res.status(400).send(err.message);
  }
};



const therapistRadius = async (req, res) => {

  const { therapies } = req.body;
  const long = req.body.long;
  const lat = req.body.lat;
  console.log(long, lat)

  const therapists = []
  const therapistsdetails = []
  const distances = []

  if (!long || !lat) {
    return res.status(400).send({ status: 0, Message: "Location not found" })
  }

  else {


    try {

      //therapies se tharapist nikaalay
      for (let i = 0; i < therapies.length; i++) {

        const therapistsavailable = await db.Therapies.find({ _id: therapies[i] }).select("therapists")

        console.log('therapistsavailable', therapistsavailable)


        therapistsavailable.map((ta) => {

          console.log("ta", ta.therapists)
          ta.therapists.map((t) => {

            if (!therapists.includes(t.toString())) {

              therapists.push(t.toString())

            }
          })

        })

      }




      console.log('therapists', therapists)


      //therapist ki details nikaalein
      for (let i = 0; i < therapists.length; i++) {

        const therapistsvalues = await db.Therapist.find({ _id: therapists[i] })


        console.log("asd", therapistsvalues)
        therapistsvalues.map((t) => {
          console.log("t", t)
          therapistsdetails.push(t)
        })

      }

      console.log("therapistsdetails", therapistsdetails)


      //distance calculate krke key mein bheja
      for (let i = 0; i < therapistsdetails.length; i++) {
        var R = 6371; // km
        var dLat = toRad(therapistsdetails[i].location.coordinates[1] - lat);
        var dLon = toRad(therapistsdetails[i].location.coordinates[0] - long);
        var lat1 = toRad(lat);
        var lat2 = toRad(therapistsdetails[i].location.coordinates[1]);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        var convert = (d * 0.001).toFixed(2)


        function toRad(Value) {
          return Value * Math.PI / 180;
        }

        console.log("distance", convert)
        console.log("ddddddd", therapistsdetails[i])
        //  therapistsdetails[i]=({...therapistsdetails[i], "distance": convert})


        distances.push(convert)
        console.log("distance array", distances)

      }

      const updatedData = therapistsdetails.map((td, index) => {
        return { ...td?._doc, distance: distances[index] }
      })

      res
        .status(200)
        .send({ status: 1, data: updatedData });
    }

    catch (err) {
      return res.status(400).send(err.message);
    }

  }


};


const getUserAppointmentNotification = async (req, res) => {

  const getnotifications = await db.Notification.find({ user_id: req.user._id }).sort({ createdAt: -1 })


  if (getnotifications.length < 1) {
    return res
      .status(400)
      .send({ status: 0, message: "No notifications found" });
  }
  else {
    try {

      return res
        .status(200)
        .send({ status: 1, data: getnotifications });
    }
    catch (err) {
      return res.status(400).send(err.message);
    }
  }


};


const getTherapistAppointmentNotification = async (req, res) => {


  const getnotifications = await db.Notification.find({ user_id: req.therapist._id }).sort({ createdAt: -1 })


  if (getnotifications.length < 1) {
    return res
      .status(400)
      .send({ status: 0, message: "No notifications found" });
  }
  else {
    try {

      return res
        .status(200)
        .send({ status: 1, data: getnotifications });
    }
    catch (err) {
      return res.status(400).send(err.message);
    }
  }


};



                                                                                              


cron.schedule("0 0 0 * * *", function () {

  const datetoday = moment(new Date()).format("YYYY-MM-DD")


  db.Appointments.updateMany({ dateofappointment: { $lte: datetoday } },
    { $set: { iscompleted: true } })

  console.log("Appointments status updated!");

});





             

module.exports = {
  requestappointments,
  getselecttherapist,
  acceptappointments,
  rejectappointments,
  upcomingappointment,
  completedappointment,
  upcomingappointmenttherapist,
  completedappointmenttherapist,
  therapistRadius,
  getUserAppointmentNotification,
  getTherapistAppointmentNotification
};