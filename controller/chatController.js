const mongoose = require("mongoose");
const db = require("../models");


const chatInbox = async (req, res) => {
  try {



    // const chats = await Chat.find({ sender_id: req.params.senderId }).populate("sender_id").populate("receiver_id")
    const chats = await db.Chat.find({ $or: [{ sender_id: req.params.senderId }, { receiver_id: req.params.senderId }] })
 



    let data = []

    chats.reverse().map(chat => {
      if (data?.length == 0) {
        data.push(chat)
      } else {
        let flag = false
        for (var i = 0; i < data.length; i++) {
          if (req.params.senderId == data[i].sender_id.toString()) {
              console.log("1")
            if (chat.receiver_id.toString() == data[i].sender_id.toString()) {
              flag = true
              break;
            }
          }
          if (req.params.senderId == data[i].receiver_id.toString()) {
            if (chat.sender_id.toString() == data[i].receiver_id.toString()) {
              flag = true
              break;
            }
          }
        }

        if (flag===false) {
          data.push(chat)
        }
      }
    })

    if (chats) {
      res.status(200).send({
        status: 1,
        message: " you have find list of Chats Successfully.",
        data: data,
      });
    } else {
      res.status(400).send({
        status: 0,
        message: " Failed list of Chats.",
        data: [],
      });
    }

    // }

  } catch (e) {
    res.status(400).send({ status: 0, message: e.message });
  }

};


module.exports = {
  chatInbox
};