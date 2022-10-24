const db = require("../models");
const push_notification = require("../utils/push_notification");

const get_messages = async(object, callback) => { 
    db.Chat.find({
            $or: [
                { $and: [{ sender_id: object.sender_id }, { receiver_id: object.receiver_id }] },
                { $and: [{ sender_id: object.receiver_id }, { receiver_id: object.sender_id }] },
            ]
        }, async(err, results) => {
            if (err) {
                callback(err);
            } else {
                callback(results);
            }
        }) 
    
        
}
const send_message = async(object, callback) => {
     console.log(object)
    const isuser = await db.User.findOne({_id: object?.sender_id}) 
    if(isuser){ 
        const therapist=await db.Therapist.findOne({_id:object?.receiver_id})
     var documents_chat = new db.Chat({ sender_id: object.sender_id, "sender_object": [isuser.name, isuser.imageName], receiver_id: object.receiver_id,"receiver_object": [therapist.name,therapist.imageName],multiModels:"User", message: object.message });
     documents_chat.save(async(err, results) => {
        if (err) {
            callback(err);
        } else {
            db.Chat.find({ _id: results._id }, async(err, results_query) => {
                    if (err) {
                        callback(err);
                    } else {
                        callback(results_query);
                    }
                }) 
        }
    });

    const notification_obj = {
        user_device_token: therapist.user_device_token,
        sender_text: object?.message,
        heading: `You have one new message from ${isuser.name}` 
        
      }; 
      push_notification(notification_obj);

// const notification = new db.Notification({ message: `You have one new message from ${isuser.name}`, type: "message", sender_text: object?.message, user_id: therapist._id});
// await notification.save();


    }
    else{
            const therapist = await db.Therapist.findOne({_id: object?.sender_id})  
            const isuser = await db.User.findOne({_id: object?.receiver_id})  
            console.log("user",isuser)
            console.log("therapist",therapist)
          var documents_chat = new db.Chat({ sender_id: object.sender_id,  "sender_object": [therapist.name, therapist.imageName], receiver_id: object.receiver_id,"receiver_object": [isuser.name, isuser.imageName],multiModels:"Therapist", message: object.message });
         documents_chat.save(async(err, results) => {
        if (err) {
            callback(err);
        } else {
            db.Chat.find({ _id: results._id }, async(err, results_query) => {
                    if (err) {
                        callback(err);
                    } else {
                        callback(results_query);
                    }
                })  
        }
    });

    const notification_obj = {
        user_device_token: isuser.user_device_token,
        sender_text: object?.message,
        heading: `You have one new message from ${therapist.name}` 
        
      }; 
      push_notification(notification_obj);

// const notification = new db.Notification({ message: `You have one new message from ${therapist.name}`, type: "message", sender_text: object?.message, user_id: isuser._id});
// await notification.save();
    } 
}
module.exports = {
    get_messages,
    send_message
}