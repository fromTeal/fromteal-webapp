const functions = require('firebase-functions')
const admin = require('firebase-admin')
const cors = require('cors')({
    origin: true,
});


admin.initializeApp({
    serviceAccount: 'fromteal-sa.json',
    databaseURL: "https://manual-pilot.firebaseio.com"
});
const db = admin.firestore();

exports.getMyTeams = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        const idToken = req.header('me')
        verifyUser(idToken)
            .then(queryUserTeams)
            .then((snapshot) => {
                const teams = extractTeams(snapshot)
                return res.send(teams)
            }).catch((error) => {
                res.status(500).send(error)
            })
    })
});

const verifyUser = (idToken) => {
    return admin.auth().verifyIdToken(idToken)
}

const queryUserTeams = (user) => {
    console.log("performing query using user", user.email)
    return db.collection('teams')
        .where("members", "array-contains", user.email)
        .get()
}

const extractTeams = (snapshot) => {
    const teams = []
    snapshot.forEach(doc => teams.push(doc.data()))
    console.log("teams enumerated:", teams)
    return teams
}

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
