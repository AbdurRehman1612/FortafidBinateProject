const mongoose = require("mongoose");


const notificationSchema = new mongoose.Schema(
    {
     
      message: {
          type: String,
          
      },
      sender_text: {
        type: String,
        
    },
    
      is_blocked: {
         type: Number,
         default: 0
      },
      user_id: {
          type: String,
      },
      
    },
    {
      timestamps: true,
    }
  );
  
  
  
  
  const Notification = mongoose.model("Notification", notificationSchema);
  
  module.exports = Notification;