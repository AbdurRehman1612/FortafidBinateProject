const mongoose = require("mongoose");


const appointmentsSchema = new mongoose.Schema(
  {
    therapies: {
      type: [],
      required: false,
      ref: 'Therapies',
      default: null

    },
    therapist_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Therapist',
        required: false,
        default: null
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    dateofappointment:{
        type: String,
          default: null,
          required: false,
    },
    timeofappointment:{
        type: String,
          default: null,
          required: false,
    },
    addressofappointment:{
        type: String,
          default: null,
          required: false,
    },
    isrecurring:{
        type: Boolean,
          default: null,
          required: false,
    },
    noofclients:{
        type: Number,
          default: null,
          required: false,
    },
    requeststatus:{
        type: Number,
          default: 2,
          required: false,
    },

    iscompleted:{
        type: Boolean,
        default: false,
        required: false,
    },
    location: {
      type: {
          type: String,
          enum: ['Point'],
          required: false,
          default: "Point"
      },
      coordinates: {
          type: [Number],
          required: false
      }
  },
    
  },
  {
    timestamps: true,
  }
);




const Appointments = mongoose.model("Appointments", appointmentsSchema);

module.exports = Appointments;
