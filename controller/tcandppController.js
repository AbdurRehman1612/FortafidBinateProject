const mongoose = require("mongoose");
const db = require("../models");


// Get content
const getContents = async (req, res) => {
  try {
    if (!req.params.content_type) {
      return res
        .status(400)
        .send({ status: 0, message: "Content field is required" });
    } else {
      const contentFind = await db.TCandPP.findOne({
        content_type: req.params.content_type,
      });
      if (contentFind) {
        return res.status(200).send({ status: 1, data: contentFind });
      } else {
        return res
          .status(400)
          .send({ status: 0, message: "Something Went Wrong." });
      }
    }
  } catch (e) {
    return res.status(400).send(e);
  }
};
// Update Content
const updateContent = async (req, res) => {
  try {
    const content = await db.TCandPP.findOneAndUpdate(
      { content_type: req.params.content_type },
      { content: req.body.content },
      { new: true }
    );
    //  console.log(content, "here");
    if (content) {
      return res.status(200).json({ message: "Content Update Successfully" });
    } else {
      return res.status(200).json({ message: "Content Not Found" });
    }
  } catch (e) {
    res.status(400).send(e);
  }
};


module.exports = {
    getContents,
    updateContent
};
