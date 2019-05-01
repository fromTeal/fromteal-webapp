const functions = require('firebase-functions')
const admin = require('firebase-admin')
const cors = require('cors')({
    origin: true,
});

// const serviceAccount = require('../fromteal-sa.json');

admin.initializeApp({
    serviceAccount: 'fromteal-sa.json',
    databaseURL: "https://manual-pilot.firebaseio.com"
});
const db = admin.firestore();

exports.getMyTeams = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        const query = db.collection('teams').get().then((snapshot) => {
            const teams = []
            snapshot.forEach(doc => teams.push(doc.data()))
            return res.send(teams)
        })
    })
});


exports.sendMessage = functions.https.onRequest((req, res) => {
    const text = req.query.text
    const teamId = req.query.teamId
    let ref = db.ref(`communicate/${teamId}/messages`)

    let insert = ref.push({
        teamId: teamId,
        text: text,
    }).then(snapshot =>
        res.send({
            status: "OK",
            ref: snapshot.ref
        }));
});
