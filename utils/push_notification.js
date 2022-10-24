var FCM = require('fcm-node');
var serverKey = 'AAAAJ9wi_Yg:APA91bGYQuonDKGlBFNzQ6ztoqkIoxArLl3mCtU4cO9FS1Yy5WwqDDtoBmBaE6PFtba7WgeIbSJmd0F5Q02jCKNUd_GiQtONChts4F0YpUQmmfkhdRaCz-m2n8J3KUBIa7cmVRNlVGfY'; //put your server key here
var fcm = new FCM(serverKey);

const push_notification = (notification_obj) => {
    console.log(notification_obj)
    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: notification_obj.user_device_token, 
        collapse_key: 'your_collapse_key',
        
        notification: {
            title: notification_obj.sender_text, 
            body: notification_obj.heading
        },
        
        data: {  //you can send only notification or only data(or include both)
            title: notification_obj.sender_text, 
            body: notification_obj.heading
        }
    };
    
    fcm.send(message, function(err, response){
        if (err) {
            console.log("Something has gone wrong!");
        } else {
            console.log("Successfully sent with response: ", response);
        }
    });
}

module.exports = push_notification;
