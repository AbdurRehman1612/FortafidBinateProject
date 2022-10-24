const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const therapistSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: false,
      trim: true,
    },
    name: {
      type: String,
      default: null,
      trim: true,
    },
    bio: {
      type: String,
      default: null,
      trim: true,
    },
    affiliation: {
      type: String,
      default: null,
      trim: true,
    },
    licensenumber: {
      type: String,
      default: null,
      trim: true,
    },
    driverlicense: {
      type: String,
      default: null,
      trim: true,
    },
    password: {
      type: String,
      required: false,
      trim: true,
    },
  
    imageName: {
      type: String,
      default: null,
      trim: true,
    },
    otp: {
      type: Number,
      required: false,
      trim: true,
    },
    
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerify: {
      type: Boolean,
      default: false,
    },
    user_social_token: {
      type: String,
      required: false,
      trim: true,
      default: null,
    },
    user_social_type: {
      type: String,
      required: false,
      trim: true,
      default: null,
    },
    user_device_type: {
      type: String,
      required: false,
      trim: true,
      default: null,
    },
    user_device_token: {
      type: String,
      required: false,
      trim: true,
      default: null,
    },
    token: {
      type: String,
      default: null,
      required: false,
    },
    address: {
      type: String,
      default: null,
      required: false,
    },
    state: {
      type: String,
      default: null,
      required: false,
    },
    city: {
      type: String,
      default: null,
      required: false,
    },
    distance: {
      type: Number,
      default: null,
      required: false,
    },
    day: {
      type: String,
      default: null,
      required: false,
    },
    time: {
      type: String,
      default: null,
      required: false,
    },
    insurancepolicynumber: {
      type: String,
      default: null,
      required: false,
    },
    expirydate: {
      type: String,
      default: null,
      required: false,
    },
    radius: {
      type: Number,
      default: null,
      required: false,
    },
    ratings:{
      type: [],
      default: null,
    },
    ratedby:{
      type: [],
      default: null,
    },
    averagerating: {
      type: Number,
      default: null,
      required: false,
    },
    profilecompleted: {
      type: Boolean,
      default: false,
      required: false,
    },

    location: {
      type: {
          type: String,  
          enum: ['Point'], 
          required: false,
          default:"Point"
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

therapistSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

therapistSchema.methods.generateAuthToken = async function () {
    const therapist = this;
    const token = jwt.sign({ therapistId: therapist._id }, process.env.KEY);
    therapist.token = token;
    await therapist.save();
    console.log('therapist', therapist)
    console.log('token', token)
  return token;
};

therapistSchema.methods.comparePassword = function (candidatePassword) {
  const user = this;
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
      if (err) {
        return reject(err);
      }
      if (!isMatch) {
        return reject(err);
      }
      resolve(true);
    });
  });
};
const Therapist = mongoose.model("Therapist", therapistSchema);

module.exports = Therapist;
