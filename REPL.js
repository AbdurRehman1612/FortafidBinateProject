// const arr=["634530e71e600ee20ff767ee","634530e71e600ee20ff767ee"]
// const a="634530e71e600ee20ff767ee"

// const c= arr.includes(a)

// console.log("c",c)

const db = require("./models");

const func= async ()=>{
const chats = await db.Chat.find({ $or: [{ sender_id: "634530e71e600ee20ff767ee" }, { receiver_id: "634530e71e600ee20ff767ee" }] }).populate("sender_id").populate("receiver_id")
    
console.log("chats:", chats);


// let data = []

// chats.reverse().map(chat => {
//   if (data?.length == 0) {
//     data.push(chat)
//   } else {
//     let flag = false
//     console.log("flaggggggggggg",flag)
//     console.log("data",data)
//     for (var i = 0; i < data.length; i++) {

//       // if (chat.receiver_id._id == data[i].receiver_id._id) {
//       //   flag = true
//       //   break;
//       // }

// console.log("ccccccc", data[i].sender_id._id)
//       // if (req.params.senderId == chat.sender_id._id) {
//       if (req.params.senderId == data[i].sender_id._id) {
//         console.log("flaggggggggggg111",flag)
//         if (chat.receiver_id._id == data[i].receiver_id._id) {
//           flag = true
//           console.log("flaggggggggggg1",flag)
//           break;
//         }
//       }

      


//       // if (req.params.senderId == chat.receiver_id._id) {
//       if (req.params.senderId == data[i].receiver_id._id) {
//         console.log("flaggggggggggg222",flag)
//         if (chat.sender_id._id == data[i].sender_id._id) {
//           flag = true
//           console.log("flaggggggggggg2",flag)
//           break;
//         }

//       }

//       console.log("dataAAAAA",data)
//       console.log("FLAGGG",flag)




//       // if (chat.sender_id._id == data[i].sender_id._id) {
//       //   flag = true
//       //   break;
//       // }

//     }
//     console.log("flaggggggggggg3",flag)

//     if (!flag) {
//       data.push(chat)
//     }
//   }
// })


// if (chats) {
//   res.status(200).send({
//     status: 1,
//     message: " you have find list of Chats Successfully.",
//     data: chats,
//   });
// } else {
//   res.status(400).send({
//     status: 0,
//     message: " Failed list of Chats.",
//     data: [],
//   });
// }
}

func()