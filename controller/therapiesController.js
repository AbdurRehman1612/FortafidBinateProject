const mongoose = require("mongoose");
const db = require("../models");

// const { sendVerificationEmail } = require("../utils/utils");

const AddTherapyAdmin = async (req, res) => {
  const {
    title,
    name,
    type,
    price,
    duration,
    benefits,
    ingredients,
    description,
  } = req.body;
  // const otp = Math.floor(100000 + Math.random() * 900000);

  //   const userex = await db.User.findOne({ email });
  //   if (userex) {
  //     return res.status(400).send({ status: 0, message: "Email Already Exist" });
  //   }
  console.log("req.body", req.body);

  if (!title) {
    return res.status(400).send({ status: 0, message: "title is required" });
  } else if (!name) {
    return res.status(400).send({ status: 0, message: "name is required" });
  } else if (!price) {
    return res.status(400).send({ status: 0, message: "price is required" });
  } else if (!type) {
    return res.status(400).send({ status: 0, message: "type is required" });
  } else if (!duration) {
    return res.status(400).send({ status: 0, message: "duration is required" });
  } else if (!benefits) {
    return res.status(400).send({ status: 0, message: "benefits is required" });
  } else if (!ingredients) {
    return res
      .status(400)
      .send({ status: 0, message: "ingredients is required" });
  } else {
    try {
      const therapies = new db.Therapies({
        title,
        name,
        type,
        price,
        duration,
        benefits,
        ingredients,
        description,
        imageName: req.file ? req.file.path : "",
      });
      await therapies.save();
      // sendVerificationEmail(user);
      res
        .status(200)
        .send({ status: 1, message: "Therapy added successfully by Admin" });
    } catch (err) {
      return res.status(400).send(err.message);
    }
  }
};

const AddTherapy = async (req, res) => {
  const {
    title,
    name,
    type,
    price,
    duration,
    benefits,
    ingredients,
    description,
  } = req.body;
  // const otp = Math.floor(100000 + Math.random() * 900000);

  //   const userex = await db.User.findOne({ email });
  //   if (userex) {
  //     return res.status(400).send({ status: 0, message: "Email Already Exist" });
  //   }
  console.log("req.body", req.body);

  if (!title) {
    return res.status(400).send({ status: 0, message: "title is required" });
  } else if (!name) {
    return res.status(400).send({ status: 0, message: "name is required" });
  } else if (!price) {
    return res.status(400).send({ status: 0, message: "price is required" });
  } else if (!type) {
    return res.status(400).send({ status: 0, message: "type is required" });
  } else if (!duration) {
    return res.status(400).send({ status: 0, message: "duration is required" });
  } else if (!benefits) {
    return res.status(400).send({ status: 0, message: "benefits is required" });
  } else if (!ingredients) {
    return res
      .status(400)
      .send({ status: 0, message: "ingredients is required" });
  } else {
    try {
      const therapies = new db.Therapies({
        title,
        name,
        type,
        price,
        duration,
        benefits,
        ingredients,
        description,
        addedby: "Therapist",
        imageName: req.file ? req.file.path : "",
        therapist_id: req.therapist._id,
        therapists: req.therapist._id,
      });
      await therapies.save();
      // sendVerificationEmail(user);

      

      res.status(200).send({
        status: 1,
        message: `Therapy added successfully by ${req.therapist.name}`,
      });
    } catch (err) {
      return res.status(400).send(err.message);
    }
  }
};

const AddtomyTherapy = async (req, res) => {
  const { therapyid } = req.body;
  const array = [];

  console.log("therapyid", therapyid);
  console.log("req.therapist", req.therapist);
  // console.log("req.therapist._id",req.therapist._id)

  const findtherapy = await db.Therapies.findOne({
    therapyid: therapyid,
    therapist_id: req.therapist._id,
  });

  console.log("findtherapy", findtherapy);
  if (findtherapy !== null) {
    return res
      .status(400)
      .send({ status: 0, message: "Therapy already added" });
  } else {
    try {
      const therapydata = await db.Therapies.findOne({ _id: therapyid });
      const mytherapies = new db.Therapies({
        title: therapydata.title,
        name: therapydata.name,
        type: therapydata.type,
        price: therapydata.price,
        duration: therapydata.duration,
        benefits: therapydata.benefits,
        ingredients: therapydata.ingredients,
        description: therapydata.description,
        addedby: "Therapist",
        therapyid: therapyid,
        therapist_id: req.therapist._id,
        imageName: therapydata.imageName,
        therapists: req.therapist._id,
      });
      await mytherapies.save();

      const check = await db.Therapies.find({ _id: therapyid });

      console.log("check", check);
      check.map((ch) => {
        array.push(ch.therapists);
      });
      console.log("array", array[0]);
      const c = array[0].includes(req.therapist._id);
      console.log("c", c);
      if (array[0].includes(req.therapist._id)) {
        res.status(200).send({ status: 1, message: "Therapy already added" });
      } else {
        const data = await db.Therapies.findByIdAndUpdate(
          { _id: therapyid },
          {
            $push: { therapists: req.therapist._id },
          },
          { new: true }
        );
        // sendVerificationEmail(user);
        res.status(200).send({
          status: 1,
          message: "Therapy added successfully",
          data: data,
        });
      }
    } catch (err) {
      return res.status(400).send(err.message);
    }
  }
};

const EditTherapyAdmin = async (req, res) => {
  const {
    therapyid,
    title,
    name,
    type,
    price,
    duration,
    benefits,
    ingredients,
    description,
  } = req.body;

  try {
    const edittherapy = await db.Therapies.findOneAndUpdate(
      { _id: therapyid, addedby: "Admin" },
      {
        title: title,
        name: name,
        type: type,
        price: price,
        duration: duration,
        benefits: benefits,
        ingredients: ingredients,
        description: description,
        imageName: req.file ? req.file.path : therapyid.imageName,
      },
      { new: true }
    );
    // .findByIdAndUpdate(
    //   { _id: user._id },
    //   { $set: { isVerify: true } }
    // );
    console.log("edittherapy", edittherapy);
    res.status(200).send({
      status: 1,
      message: "Therapy edit successfully",
      data: edittherapy,
    });
    // }
    // else{
    //   res
    //     .status(400)
    //     .send({ status: 1, message: "You are not allowed to edit therapy that is not yours" });
    // }
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

const EditmyTherapy = async (req, res) => {
  const {
    therapyid,
    title,
    name,
    type,
    price,
    duration,
    benefits,
    ingredients,
    description,
  } = req.body;

  try {
    const edittherapy = await db.Therapies.findOneAndUpdate(
      {
        therapyid: therapyid,
        therapist_id: req.therapist._id,
        addedby: "Therapist",
      },
      {
        title: title,
        name: name,
        type: type,
        price: price,
        duration: duration,
        benefits: benefits,
        ingredients: ingredients,
        description: description,
        imageName: req.file ? req.file.path : therapyid.imageName,
      },
      { new: true }
    );
    // .findByIdAndUpdate(
    //   { _id: user._id },
    //   { $set: { isVerify: true } }
    // );
    console.log("edittherapy", edittherapy);
    res.status(200).send({
      status: 1,
      message: "Therapy edit successfully",
      data: edittherapy,
    });
    // }
    // else{
    //   res
    //     .status(400)
    //     .send({ status: 1, message: "You are not allowed to edit therapy that is not yours" });
    // }
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

const getmyTherapy = async (req, res) => {
  console.log("req.therapist._id", req.therapist._id);

  try {
    const mytherapies = await db.Therapies.find({
      therapist_id: req.therapist._id,
      addedby: "Therapist",
    });
    console.log("mytherapies", mytherapies);
    res.status(200).send({ status: 1, mytherapies: mytherapies });
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

const showalltherapiesuser = async (req, res) => {
  try {
    const mytherapies = await db.Therapies.find();
    console.log("mytherapies", mytherapies);
    res.status(200).send({ status: 1, data: mytherapies });
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

const showalltherapies = async (req, res) => {
  try {
    const mytherapies = await db.Therapies.find({ addedby: "Admin" });
    console.log("mytherapies", mytherapies);
    res.status(200).send({ status: 1, data: mytherapies });
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

const showtherapydetailsadmin = async (req, res) => {
  const { therapyid } = req.body;
  try {
    const mytherapies = await db.Therapies.find({
      _id: therapyid,
      addedby: "Admin",
    });
    console.log("mytherapies", mytherapies);
    res.status(200).send({ status: 1, data: mytherapies });
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

const showtherapydetails = async (req, res) => {
  const { therapyid } = req.body;
  try {
    const mytherapies = await db.Therapies.find({
      therapyid: therapyid,
      addedby: "Therapist",
    });
    console.log("mytherapies", mytherapies);
    res.status(200).send({ status: 1, data: mytherapies });
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

const showinfusioncategory = async (req, res) => {
  try {
    const mytherapies = await db.Therapies.find({ type: "infusion" });
    res.status(200).send({ status: 1, data: mytherapies });
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

const showaddonscategory = async (req, res) => {
  try {
    const mytherapies = await db.Therapies.find({ type: "addons" });
    res.status(200).send({ status: 1, data: mytherapies });
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

const showinjectionscategory = async (req, res) => {
  try {
    const mytherapies = await db.Therapies.find({ type: "injections" });
    res.status(200).send({ status: 1, data: mytherapies });
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

const AddRatings = async (req, res) => {
  const { _id, therapistid, ratings } = req.body;

  const therapyarray = [];
  const therapistarray = [];

  const checkAdmin = await db.Therapies.find({
    _id: _id,
    
  });
  // const checkTherapist = await db.Therapies.find({
  //   _id: therapyid,
  //   addedby: "Therapist",
  // });

  console.log("checkAdmin", checkAdmin);
  // console.log("checkTherapist", checkTherapist);

  try {

    const check= await db.Therapies.findOne({_id: _id})

    console.log("check", check)
    const array = check.ratedby
    console.log("array", array)


    if(array.includes(req.user._id)){
      return res.status(200).send({status: 1, message: "Ratings already added"})
    }

    else{
   
     
      const therapyrating = await db.Therapies.findByIdAndUpdate(
        { _id: _id },
        {
          $push: { ratings: ratings, ratedby: req.user._id },
        },
        { new: true }
      );
      const result = await db.Therapies.find({
        _id: _id
      }).select("ratings");

      result.map((r) => {
        therapyarray.push(r.ratings);
      });

      const average =
        therapyarray[0].reduce((a, b) => a + b, 0) / therapyarray[0].length;
      Math.round(average);
      // console.log("average",Math.round(average))

      const avgratingtherapy = await db.Therapies.findByIdAndUpdate(
        { _id: _id },
        {
          $set: { averagerating: average },
        }
      );

      const therapistrating = await db.Therapist.findByIdAndUpdate(
        { _id: therapistid },
        {
          $push: { ratings: ratings, ratedby: req.user._id },
        },
        { new: true }
      );
      const result1 = await db.Therapist.find({ _id: therapistid }).select(
        "ratings"
      );

      result1.map((r) => {
        therapistarray.push(r.ratings);
      });

      const average1 =
        therapistarray[0].reduce((a, b) => a + b, 0) / therapistarray[0].length;
      Math.round(average1);
      // console.log("average",Math.round(average))

      const avgratingtherapist = await db.Therapist.findByIdAndUpdate(
        { _id: therapistid },
        {
          $set: { averagerating: average },
        }
      );



      res
        .status(200)
        .send({ status: 1, message: "Ratings added successfully" });
    }
  }
   catch (err) {
    return res.status(400).send(err.message);
  }
};

module.exports = {
  AddTherapyAdmin,
  AddTherapy,
  AddtomyTherapy,
  getmyTherapy,
  showalltherapiesuser,
  EditTherapyAdmin,
  showalltherapies,
  EditmyTherapy,
  showtherapydetails,
  showtherapydetailsadmin,
  showinfusioncategory,
  showaddonscategory,
  showinjectionscategory,
  AddRatings,
};