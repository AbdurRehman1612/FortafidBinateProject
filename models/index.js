const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useFindAndModify: false,
});


module.exports = {
  User: require("./User"),
  Therapist: require("./Therapist"),
  Business: require("./Business"),
  Therapies: require("./Therapies"),
  Appointments: require("./Appointments"),
  TCandPP: require("./tcandpp"),
  Chat: require("./Chat"),
  Notification: require("./Notification")
  // ScannedProducts: require("./ScannedProducts"),
};
