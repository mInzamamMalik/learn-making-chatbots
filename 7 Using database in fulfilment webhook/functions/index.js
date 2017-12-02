const functions = require('firebase-functions');
var admin = require("firebase-admin");

admin.initializeApp(functions.config().firebase);

var firestore = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.webhook = functions.https.onRequest((request, response) => {

    console.log("request.body.result.parameters: ", request.body.result.parameters);
    // {
    //     name: "john",
    //     persons: "3"
    //     ...
    // }

    let params = request.body.result.parameters;

    firestore.collection('orders').add(params)
        .then(() => {

            response.send({
                speech:
                    `${params.name} your hotel booking request for ${params.RoomType} room is forwarded for
                    ${params.persons} persons, we will contact you on ${params.email} soon`
            });
        })
        .catch((e => {
            
            console.log("error: ", e);

            response.send({
                speech: "something went wrong when writing on database"
            });
        }))


});
