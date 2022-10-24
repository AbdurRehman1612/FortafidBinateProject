const mongoose = require("mongoose");
const Users = mongoose.model("User");
const db = require("../models");
const bcrypt = require("bcrypt");
// const { sendVerificationEmail } = require("../utils/utils");

const signUp = async (req, res) => {
  const { email, password, confirmPassword } = req.body;
  const emailValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  const pass = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/
  // const otp = Math.floor(100000 + Math.random() * 900000);

  


  const userex = await db.User.findOne({ email });
  const userex1 = await db.Therapist.findOne({ email });
  
  if (userex) {
    return res.status(400).send({ status: 0, message: "Email Already Exist" });
  }
  else if (userex1) {
    return res.status(400).send({ status: 0, message: "You are already registered as therapist with this email" });
  } 
  else if (!email) {
    return res.status(400).send({ status: 0, message: "Email is required" });
  } 
  else if (!email.match(emailValidation)) {
    return res.status(400).send({ status: 0, Message: "Invalid email address" })
}
  else if (!password) {
    return res.status(400).send({ status: 0, message: "Password is required" });
  } 
  else if (!password.match(pass)) {
    return res.status(400).send({ status: 0, Message: "Password should be 8 characters long (should contain uppercase, lowercase, numeric and special character)" })
}
  else if (!confirmPassword) {
    return res.status(400).send({ status: 0, message: "Confirm Password is required" });
  } 
  else if (!confirmPassword.match(pass)) {
    return res.status(400).send({ status: 0, Message: "Password should be 8 characters long (should contain uppercase, lowercase, numeric and special character)" })
}
   else if (password !== confirmPassword) {
    return res.status(400).send({ status: 0, message: "Password Do not Match" });
  }

  else {
    try {
      const user = new db.User({  email, password, otp: 510016 });
      await user.save();
      // sendVerificationEmail(user);
      res
        .status(200)
        .send({ status: 1, message: "Verify Your Account", _id: user._id });
    } catch (err) {
      return res.status(400).send(err.message);
    }
  }
};

const verifyAccount = async (req, res) => {
  const { otp, _id } = req.body;
  if (!otp) {
    return res.status(400).send({ status: 0, message: "OTP is required" });
  } else {
    try {
      const user = await db.User.findOne({ _id: _id });
      
      if (!user) {
        return res.status(400).send({ status: 0, message: "Invalid User" });
      } else if (user.isVerify) {
        return res.status(200).send({ status: 1, message: "Already Verified" });
      } else {
        if (otp !== user.otp) {
          return res
            .status(400)
            .send({ status: 0, message: "Invalid One Time Password" });
        } else {
          await user.generateAuthToken();
          await db.User.findByIdAndUpdate(
            { _id: user._id },
            { $set: { isVerify: true } }
          );
          return res
            .status(200)
            .send({ status: 1, message: "Account Verified Successfully", data: user });
        }
      }
    } catch (error) {
      return res.status(400).send({ status: 0, message: "Some Error Occur" });
    }
  }
};

const resendOTP = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);
  try {
    const userex = await db.User.findOne({ email });
    if (!userex) {
      return res.status(400).send({ status: 0, message: "Invalid User" });
    } else {
      if (!userex.isVerify) {
        await db.User.findByIdAndUpdate({ _id: userex._id }, { $set: { otp: 510016 } });
        const user = await db.User.findOne({ _id: userex._id });
        console.log(user);
        // sendVerificationEmail(user);
        return res.status(200).send({ status: 1, message: "Verification OTP Sent" });
      } else {
        return res.status(200).send({ status: 1, message: "Already Verified" });
      }
    }
  } catch (error) {
    return res.status(400).send({ status: 0, message: "Some Error Occur" });
  }
};

const forgetPassword = async (req, res) => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  const { email } = req.body;
  try {
    const userex = await db.User.findOne({ email });
    if (!userex) {
      return res.status(400).send({ status: 0, message: "Invalid User" });
    } else {
      await db.User.findByIdAndUpdate(
        { _id: userex._id },
        { $set: { isVerify: false, otp: 510016 } }
      );
      const user = await db.User.findOne({ email });
      console.log(user);
      // sendVerificationEmail(user);
      return res.status(200).send({ status: 1, message: "Verification OTP Sent", _id: user._id });
    }
  } catch (error) {
    return res.status(400).send({ status: 0, message: "Some Error Occur" });
  }
};

const newPassword = async (req, res) => {
  const { newPassword, email, confirmnewPassword } = req.body;
  console.log(newPassword);
  if (!newPassword) {
    return res.status(400).send({ status:0, message: "New Password is required" });
  } 
  else if(newPassword!==confirmnewPassword){
    return res.status(400).send({ status:0, message: "New Password and Confirm New Password does not match" });
  }
  else {
    try {
      const usercheck = await db.User.findOne({ email });
      if (!usercheck) {
        return res.status(400).send({ status:0, message: "User Not Found" });
      }
      const salt = await bcrypt.genSalt(10);
      const pass = await bcrypt.hash(newPassword, salt);
      const user = await db.User.findByIdAndUpdate(
        { _id: usercheck._id },
        { $set: { password: pass, isVerify: true } }
      );
      res
        .status(200)
        .send({ status:1, message: "Password Changed Successfully", data: user });
    } catch (err) {
      return res.status(400).send({ status:0, message: err });
    }
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password)
    if (!email || !password) {
      return res
        .status(400)
        .send({ status: 0, message: "Must provide email or password" });
    }
    const user = await db.User.findOne({ email });
    if (!user) {
      return res.status(400).send({ status: 0, message: "Invalid User" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!user.isVerify) {
      return res.status(400).send({ status: 0, message: "User is Not Verified"});
    } else if (!isMatch) {
      return res.status(400).send({ status: 0, message: "Password is not valid" });
    } else {
      await user.generateAuthToken();
      const updateUser = await db.User.findOneAndUpdate(
        { _id: user._id },
        {
          user_device_type: req.body.devicetype,
          user_device_token: req.body.devicetoken,
        },
        { new: true }
      );
      res.status(200).send({ status: 1, message: "Login Successfull", data: updateUser });
    }
  } catch (err) {
    return res.status(400).send({ status: 0, message: err });
  }
};

const socialLogin = async (req, res) => {
  const { socialToken, socialType, device_token, device_type, name, email, image, phone } = req.body
  try {
    if (!socialToken) {
      return res.status(400).send({ status: 0, message: 'User Social Token field is required' });
    }
    else if (!socialType) {
      return res.status(400).send({ status: 0, message: 'User Social Type field is required' });
    }
    else if (!device_token) {
      return res.status(400).send({ status: 0, message: 'User Device Type field is required' });
    }
    else if (!device_type) {
      return res.status(400).send({ status: 0, message: 'User Device Token field is required' });
    }
    else {
      const checkUser = await db.User.findOne({ user_social_token: socialToken });
      if (!checkUser) {
        const user = new db.User({ name, phone, email, user_social_token: socialToken, user_social_type: socialType, user_device_type: device_type, user_device_token: device_token, imageName: req.file ? req.file.path : image, isVerify: true });
        await user.generateAuthToken();
        await user.save();
        return res.status(200).send({ status: 1, message: 'Login Successfully', data: user });
      }
      else {
        const token = await checkUser.generateAuthToken();
        const upatedRecord = await db.User.findOneAndUpdate({ _id: checkUser._id },
          { user_device_type: device_type, user_device_token: device_token, isVerify: true, token }
          , { new: true });
        return res.status(200).send({ status: 1, message: 'Login Successfully', data: upatedRecord });
      }
    }
  } catch (e) {
    res.status(400).send({ status: 0, message: e });
  }
};

const usercompleteprofilesignup = async (req, res) => {

  const { name, phone, address, state, city, zipcode, lat, long } = req.body;
  // const otp = Math.floor(100000 + Math.random() * 900000);
console.log("req.body",req.body)

  if (!name) {
      return res.status(400).send({ status: 0, message: "name is required" });
  }
  else if (!phone) {
      return res.status(400).send({ status: 0, message: "phone is required" });
  }
  
  else if (!state) {
      return res.status(400).send({ status: 0, message: "state is required" });
  }
  else if (!address) {
      return res.status(400).send({ status: 0, message: "address is required" });
  }

  else if (!city) {
      return res.status(400).send({ status: 0, message: "city is required" });
  }
  else if (!zipcode) {
      return res.status(400).send({ status: 0, message: "zipcode is required" });
  }
  

  else {

      try {
          console.log('req.user', req.user)
          const user = await db.User.findOneAndUpdate(
              { _id: req.user._id},
              {
                  imageName: req.file ? req.file.path : req.user.imageName,
                  name: name,
                  phone:phone,
                  city:city,
                  address: address,
                  zipcode:zipcode,
                  state: state,
                  profilecompleted: true,
                  "location.coordinates": [long, lat]
              },
              // {
              //   $push: { "location.coordinates": [long, lat] },
              // },
              { new: true }
          );
          // const data = await db.User.findByIdAndUpdate(
          //   { _id: therapyid },
          //  {
          //     $push: { therapists: req.therapist._id },
          //   }, { new: true }
          // );
          // sendVerificationEmail(user);
          res.status(200)
              .send({ status: 1, message: "Profile Completed Successfully!", user: user });
      } catch (err) {
          return res.status(400).send(err.message);
      }
  }
};

const signOut = async (req, res) => {
  try {
    const user = await db.User.findById({ _id: req.user._id });
    console.log("user", req.user._id)
    if (!user) {
      return res.status(400).send({ status: 0, message: "User Not Found" });
    } else {
      const updateUser = await db.User.findOneAndUpdate(
        { _id: req.user._id },
        {
          token: null,
          user_device_type: null,
          user_device_token: null,
        },
        { new: true }
      );
      res.status(200).send({ status: 1, message: "User Logged Out" });
    }
  } catch (err) {
    return res.status(400).send({ status: 0, message: err });
  }
};

const userProfile = async (req, res) => {
  try {
    const user = await db.User.findById({ _id: req.user._id });
    res.send({ status: 1, user });
  } catch (err) {
    return res.status(400).send({ status: 0, message: "Something Went Wrong" });
  }
};

const profileUpdate = async (req, res) => {

  const {

    name,
    phone,
    address,
    city,
    state,
    zipcode,
    lat, 
    long

  } = req.body;

  console.log(req.body)

  try {

    console.log("reqqqqqq",req.file)

    const user = await db.User.findOneAndUpdate(
      { _id: req.user._id },
      {
        name: name,
        phone: phone,
        imageName: req.file ? req.file.path : req.user.imageName,
        address: address,
        city: city,
        state: state,
        zipcode: zipcode,
        "location.coordinates": [long, lat]
      },
      { new: true }
    );

    
 
      
      
      
      
     
          const update = await db.Chat.updateMany({sender_id: req.user._id},
        { $set: { "sender_object": [req.user.name ,req.file ? req.file.path : req.user.imageName] }} )

          const update1 = await db.Chat.updateMany({receiver_id: req.user._id},
        { $set: { "receiver_object": [req.user.name ,req.file ? req.file.path : req.user.imageName] }} )

        



    res.status(200).send({ status: 1, message: "Profile updated successfully", user: user });


  } catch (err) {
    return res.status(400).send({ status: 0, message: "Something Went Wrong" });
  }
};

const updatePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmnewPassword } = req.body;
  if (!currentPassword) {
    return res.status(400).send({ status: 0, message: "Current Password is required" });
  } else if (!newPassword) {
    return res.status(400).send({ status: 0, message: "New Password is required" });
  }
  else if (!confirmnewPassword) {
    return res.status(400).send({ status: 0, message: "Confirm New Password is required" });
  }
  else if (currentPassword == newPassword) {
    return res
      .status(400)
      .send({ status: 0, message: "Old password and new password can't be same" });
  }
  else if (newPassword !== confirmnewPassword) {
    return res
      .status(400)
      .send({ status: 0, message: "New password and confirm new password does not match" });
  }
  else {
    try {
      const usercheck = await db.User.findOne({ _id: req.user._id });
      if (!usercheck) {
        return res.status(400).send({ status: 0, message: "User Not Found" });
      }
      await usercheck.comparePassword(currentPassword);
      const salt = await bcrypt.genSalt(10);
      const pass = await bcrypt.hash(newPassword, salt);
      const user = await db.User.findByIdAndUpdate(
        { _id: req.user._id },
        { $set: { password: pass } }
      );
      res.status(200).send({ status: 1, message: "Password updated successfully", password: user.password });
    } catch (err) {
      return res.status(400).send({ status: 0, message: "Invalid Current Password" });
    }
  }
};



module.exports = {
  signUp,
  signIn,
  userProfile,
  profileUpdate,
  updatePassword,
  verifyAccount,
  resendOTP,
  forgetPassword,
  newPassword,
  usercompleteprofilesignup,
  signOut,
  socialLogin,
 
};
