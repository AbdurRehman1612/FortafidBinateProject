const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const businessSchema = new mongoose.Schema(
  {

    email: {
    type: String,
      default: null,
      trim: true,
    },
    name: {
      type: String,
      default: null,
      trim: true,
    },
    einNumber: {
      type: Number,
      default: null,
      trim: true,
    },
    address: {
      type: String,
      default: null,
      required: false,
    },
    licensenumber: {
      type: String,
      default: null,
      trim: true,
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
    accounttitle: {
      type: String,
      default: null,
      trim: true,
    },
    accountnumber: {
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
    bankname: {
      type: String,
      default: null,
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

businessSchema.pre("save", function (next) {
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

businessSchema.methods.generateAuthToken = async function () {
    const business = this;
    const token = jwt.sign({ businessId: business._id }, process.env.KEY);
    business.token = token;
    await business.save();
    console.log('Business', business)
    console.log('token', token)
  return token;
};

businessSchema.methods.comparePassword = function (candidatePassword) {
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
const Business = mongoose.model("Business", businessSchema);

module.exports = Business;
