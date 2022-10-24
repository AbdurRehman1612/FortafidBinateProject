const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require('path');
const dotenv = require("dotenv");
const db = require("./models")

const {
  get_messages,
  send_message
} = require('./utils/messages');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
dotenv.config();
app.use('/upload', express.static(path.join(__dirname, 'upload')))

const contentSeeder = [
  {
      title: "Privacy Policy",
      content: "Lorem ipsum dolor sit amet.Ea iste consectetur qui harum libero exercitationem harum et quam earum At cupiditate perferendis qui aspernatur vero!",
      content_type: "privacy_policy"
  },
  {
      title: "Terms and Conditions",
      content: "Lorem ipsum dolor sit amet.Ea iste consectetur qui harum libero exercitationem harum et quam earum At cupiditate perferendis qui aspernatur vero!",
      content_type: "terms_and_conditions"
  },
  {
      title: "Help and Support",
      content: "Lorem ipsum dolor sit amet.Ea iste consectetur qui harum libero exercitationem harum et quam earum At cupiditate perferendis qui aspernatur vero!",
      content_type: "help_and_support"
  }
];
const dbSeed = async () => {
  await db.TCandPP.deleteMany({});
  await db.TCandPP.insertMany(contentSeeder);
}
dbSeed().then(() => {
  // mongoose.connection.close();
})


// var io = require('socket.io')(server, {
//   cors: {
//       origin: "*",
//       methods: ["GET", "POST","PATCH","DELETE"],
//       credentials: true,
//       transports: ['websocket', 'polling'],
//       allowEIO3: false
//   },
// });
// io.on('connection', socket => {
// console.log("socket connection " + socket.id);
// socket.on('get_messages', function(object) {
//     var user_room = "user_" + object.sender_id;
//       socket.join(user_room);
//       get_messages(object, function (response) { 
//           if (response.length > 0) {
//               console.log("get_messages has been successfully executed...");
//               io.to(user_room).emit('response', { object_type: "get_messages", data: response });
//           } else {
//               console.log("get_messages has been failed...");
//               io.to(user_room).emit('error', { object_type: "get_messages", message: "There is some problem in get_messages..." });
//           }
//       });
// });
// // SEND MESSAGE EMIT

// socket.on('send_message', function(object) {
//     var sender_room = "user_" + object.sender_id;
//       var receiver_room = "user_" + object.receiver_id;
//       send_message(object, async (response_obj)=> {
//           if (response_obj) {
//               console.log("send_message has been successfully executed...");
//                io.to(sender_room).to(receiver_room).emit('response', { object_type: "get_message", data: response_obj }); 
//         //        const nurse=await Patient.findOne({_id:object?.sender_id}).populate("user_id", "user_fname user_lname user_device_token") 
//         //        if(nurse){    
//         //       const notification_obj = {
//         //     user_device_token: nurse?.user_id?.user_device_token,
//         //     sender_text: object?.message,
//         //     heading: `new message from ${nurse?.user_id?.user_fname} ${nurse?.user_id?.user_lname}`  
//         //   }; 
//         //  await push_notification(notification_obj);
//         //        }
//           } else {
//               console.log("send_message has been failed...");
//               io.to(sender_room).to(receiver_room).emit('error', { object_type: "get_message", message: "There is some problem in get_message..." });
//           }
//       });
// });
// });


// Router config
app.use("/routes/user/", require("./routes/user"));
app.use("/routes/therapist/", require("./routes/therapist"));
app.use("/routes/therapies/", require("./routes/therapies"));
app.use("/routes/business/", require("./routes/business"));
app.use("/routes/appointments/", require("./routes/appointments"));
app.use("/routes/chat/", require("./routes/chat"));
app.use("/routes/tcandpp/", require("./routes/tcandpp"));




const PORT = 5000 || process.env.PORT;

app.listen(PORT, (req, res) => {
  console.log(`Server running on ${PORT}`);
});
