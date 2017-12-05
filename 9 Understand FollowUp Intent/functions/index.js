const functions = require('firebase-functions');
var admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
var firestore = admin.firestore();

exports.webhook = functions.https.onRequest((request, response) => {

    // console.log("request.body.result.parameters: ", request.body.result.parameters);
    // {
    //     name: "john",
    //     persons: "3"
    //     ...
    // }

    switch (request.body.result.action) {

        case 'BookHotel':

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
            break;

        case 'countBooking':

            firestore.collection('orders').get()
                .then((querySnapshot) => {

                    var orders = [];
                    querySnapshot.forEach((doc) => { orders.push(doc.data()) });
                    // now orders have something like this [ {...}, {...}, {...} ]

                    response.send({
                        speech: `you have ${orders.length} orders, would you like to see them? (yes/no)`
                    });
                })
                .catch((err) => {
                    console.log('Error getting documents', err);

                    response.send({
                        speech: "something went wrong when reading from database"
                    })
                })

            break;

        case 'showBookings':

            firestore.collection('orders').get()
                .then((querySnapshot) => {

                    var orders = [];
                    querySnapshot.forEach((doc) => { orders.push(doc.data()) });
                    // now orders have something like this [ {...}, {...}, {...} ]

                    // converting array to speech
                    var speech = `here are your orders \n`;

                    orders.forEach((eachOrder, index) => {
                        speech += `number ${index + 1} is ${eachOrder.RoomType} room for ${eachOrder.persons} persons, ordered by ${eachOrder.name} contact email is ${eachOrder.email} \n`
                    })

                    response.send({
                        speech: speech
                    });
                })
                .catch((err) => {
                    console.log('Error getting documents', err);

                    response.send({
                        speech: "something went wrong when reading from database"
                    })
                })

            break;

        default:
            response.send({
                speech: "no action matched in webhook"
            })
    }
});
