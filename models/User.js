const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
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
    phone: {
      type: Number,
      default: null,
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
    zipcode: {
      type: String,
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

userSchema.pre("save", function (next) {
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

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ userId: user._id }, process.env.KEY);
  user.token = token;
  await user.save();
  return token;
};

userSchema.methods.comparePassword = function (candidatePassword) {
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
const User = mongoose.model("User", userSchema);

module.exports = User;
