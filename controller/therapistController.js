const mongoose = require("mongoose");
const Therapist = mongoose.model("Therapist");
const db = require("../models");
const bcrypt = require("bcrypt");
// const { sendVerificationEmail } = require("../utils/utils");

const signUp = async (req, res) => {
    const { email, password, confirmPassword, radius } = req.body;
    const emailValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    const pass = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/
    // const otp = Math.floor(100000 + Math.random() * 900000);

    const userex = await db.Therapist.findOne({ email });
    const userex1 = await db.User.findOne({ email });
    if (userex) {
        return res.status(400).send({ status: 0, message: "Email Already Exist" });
    }
    else if (userex1) {
        return res.status(400).send({ status: 0, message: "You are already registered as User with this email" });
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
    else if (!radius) {
        return res.status(400).send({ status: 0, message: "Radius is required" });
    }
    else if (password !== confirmPassword) {
        return res.status(400).send({ status: 0, message: "Password Do not Match" });
    }
           
    else {
        try {
            const user = new db.Therapist({ email, radius, password, otp: 510016 });
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
            const user = await db.Therapist.findOne({ _id: _id });
           
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
                    const updateUser = await db.Therapist.findOneAndUpdate(
                        { _id: user._id },
                        {
                          user_device_type: req.body.devicetype,
                          user_device_token: req.body.devicetoken,
                        },
                        { new: true }
                      );
                    await db.Therapist.findByIdAndUpdate(
                        { _id: user._id },
                        { $set: { isVerify: true } }
                    );
                    return res
                        .status(200)
                        .send({ status: 1, message: "Account Verified Successfully",data: user  });
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
        const userex = await db.Therapist.findOne({ email });
        if (!userex) {
            return res.status(400).send({ status: 0, message: "Invalid User" });
        } else {
            if (!userex.isVerify) {
                await db.Therapist.findByIdAndUpdate({ _id: userex._id }, { $set: { otp: 510016 } });
                const user = await db.Therapist.findOne({ _id: userex._id });
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
        const userex = await db.Therapist.findOne({ email });
        if (!userex) {
            return res.status(400).send({ status: 0, message: "Invalid User" });
        } else {
            await db.Therapist.findByIdAndUpdate(
                { _id: userex._id },
                { $set: { isVerify: false, otp: 510016 } }
            );
            const user = await db.Therapist.findOne({ email });
            console.log(user);
            // sendVerificationEmail(user);
            return res.status(200).send({ status: 1, message: "Verification OTP Sent", _id: user._id });
        }
    } catch (error) {
        return res.status(400).send({ status: 0, message: "Some Error Occur" });
    }
};

const newPassword = async (req, res) => {
    const { email,newPassword,confirmnewPassword } = req.body;
    console.log(newPassword);
    if (!newPassword) {
      return res.status(400).send({ status:0, message: "New Password is required" });
    }
    else if(newPassword!==confirmnewPassword){
        return res.status(400).send({ status:0, message: "New Password and Confirm New Password does not match" });
      }
    else {
      try {
        const usercheck = await db.Therapist.findOne({ email });
        if (!usercheck) {
          return res.status(400).send({ status:0, message: "User Not Found" });
        }
        const salt = await bcrypt.genSalt(10);
        const pass = await bcrypt.hash(newPassword, salt);
        const user = await db.Therapist.findByIdAndUpdate(
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
const therapistcompleteprofilesignup = async (req, res) => {

    const { name, bio, affiliation, licensenumber, driverlicense, address, state, city, day, time, insurancepolicynumber, expirydate, lat, long } = req.body;
    // const otp = Math.floor(100000 + Math.random() * 900000);


    if (!bio) {
        return res.status(400).send({ status: 0, message: "Bio is required" });
    }
    else if (!affiliation) {
        return res.status(400).send({ status: 0, message: "affiliation is required" });
    }
    else if (!licensenumber) {
        return res.status(400).send({ status: 0, message: "licensenumber is required" });
    }
    else if (!driverlicense) {
        return res.status(400).send({ status: 0, message: "driverlicense is required" });
    }
    else if (!address) {
        return res.status(400).send({ status: 0, message: "address is required" });
    }
    else if (!state) {
        return res.status(400).send({ status: 0, message: "state is required" });
    }
    else if (!city) {
        return res.status(400).send({ status: 0, message: "city is required" });
    }
    else if (!day) {
        return res.status(400).send({ status: 0, message: "day is required" });
    }
    else if (!time) {
        return res.status(400).send({ status: 0, message: "time is required" });
    }
    else if (!insurancepolicynumber) {
        return res.status(400).send({ status: 0, message: "insurancepolicynumber is required" });
    }
    else if (!expirydate) {
        return res.status(400).send({ status: 0, message: "expirydate is required" });
    }
    else if (!name) {
        return res.status(400).send({ status: 0, message: "Name is required" });
    }

    else {

        try {
            console.log('req.therapist', req.therapist)
            const user = await db.Therapist.findOneAndUpdate(
                { _id: req.therapist._id},
                {
                    imageName: req.file ? req.file.path : req.therapist.imageName,
                    name: name,
                    bio: bio,
                    affiliation: affiliation,
                    driverlicense: driverlicense,
                    licensenumber: licensenumber,
                    address: address,
                    city: city,
                    state: state,
                    expirydate: expirydate,
                    day: day,
                    time: time,
                    insurancepolicynumber: insurancepolicynumber,
                    expirydate: expirydate,
                    profilecompleted: true,
                    "location.coordinates": [long, lat]

                },
                { new: true }
            );
            // sendVerificationEmail(user);
            res.status(200)
                .send({ status: 1, message: "Profile Completed Successfully!", user: user });
        } catch (err) {
            return res.status(400).send(err.message);
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
        const user = await db.Therapist.findOne({ email });
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
            const updateUser = await db.Therapist.findOneAndUpdate(
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
            const checkUser = await db.Therapist.findOne({ user_social_token: socialToken });
            if (!checkUser) {
                const user = new db.Therapist({ name, phone, email, user_social_token: socialToken, user_social_type: socialType, user_device_type: device_type, user_device_token: device_token, imageName: req.file ? req.file.path : image, isVerify: true });
                await user.generateAuthToken();
                await user.save();
                return res.status(200).send({ status: 1, message: 'Login Successfully', data: user });
            }
            else {
                const token = await checkUser.generateAuthToken();
                const upatedRecord = await db.Therapist.findOneAndUpdate({ _id: checkUser._id },
                    { user_device_type: device_type, user_device_token: device_token, isVerify: true, token }
                    , { new: true });
                return res.status(200).send({ status: 1, message: 'Login Successfully', data: upatedRecord });
            }
        }
    } catch (e) {
        res.status(400).send({ status: 0, message: e });
    }
};

const signOut = async (req, res) => {
    try {
        const user = await db.Therapist.findById({ _id: req.therapist._id });
        console.log("user", req.therapist._id)
        if (!user) {
            return res.status(400).send({ status: 0, message: "User Not Found" });
        } else {
            const updateUser = await db.Therapist.findOneAndUpdate(
                { _id: req.therapist._id },
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
        const user = await db.Therapist.findById({ _id: req.user._id });
        res.send({ status: 1, user });
    } catch (err) {
        return res.status(400).send({ status: 0, message: "Something Went Wrong" });
    }
};

const profileUpdate = async (req, res) => {

    const { name, email, licensenumber, driverlicense, address, state, city, day, time, insurancepolicynumber, expirydate, radius, lat, long } = req.body

    console.log("req.body",req.body)

    try {

        // const user1 = await db.Therapist.find(
        //     { _id: req.therapist._id })

        //     console.log('user1', user1)
            
        const user = await db.Therapist.findOneAndUpdate(
            { _id: req.therapist._id },
            {
                name: name,
                email: email,
                licensenumber: licensenumber,
                driverlicense: driverlicense,
                day: day,
                time: time,
                insurancepolicynumber: insurancepolicynumber,
                expirydate: expirydate,
                radius: radius,
                imageName: req.file ? req.file.path : req.therapist.imageName,
                address: address,
                city: city,
                state: state,
                "location.coordinates": [long, lat]
               
            },
            { new: true }
        );


        const update = await db.Chat.updateMany({sender_id: req.therapist._id},
            { $set: { "sender_object": [req.therapist.name , req.file ? req.file.path : req.therapist.imageName] }} )
    
              const update1 = await db.Chat.updateMany({receiver_id: req.therapist._id},
            { $set: { "receiver_object": [req.therapist.name , req.file ? req.file.path : req.therapist.imageName] }} )

        console.log("user",user)
        
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
            const usercheck = await db.Therapist.findOne({ _id: req.therapist._id });
            console.log('usercheck', usercheck)
            if (!usercheck) {
                return res.status(400).send({ status: 0, message: "User Not Found" });
            }
            await usercheck.comparePassword(currentPassword);
            const salt = await bcrypt.genSalt(10);
            const pass = await bcrypt.hash(newPassword, salt);
            const user = await db.Therapist.findByIdAndUpdate(
                { _id: req.therapist._id },
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
    therapistcompleteprofilesignup,
    profileUpdate,
    updatePassword,
    verifyAccount,
    resendOTP,
    forgetPassword,
    newPassword,
    signOut,
    socialLogin,

};
