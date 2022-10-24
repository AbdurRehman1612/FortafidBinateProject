const mongoose = require("mongoose");


const tcandppSchema = new mongoose.Schema(
    {
     
      content_type: {
          type: String,
      },
      content: {
         type: String,
      },
      title: {
          type: String,
      },
      
    },
    {
      timestamps: true,
    }
  );
  
  
  
  
  const TCandPP = mongoose.model("TCandPP", tcandppSchema);
  
  module.exports = TCandPP;