const functions = require('firebase-functions')
const admin = require('firebase-admin')
const cors = require('cors')({
    origin: true,
})
const conversation = require('./conversation')





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

    let ref = db.collection(`communicate/${teamId}/messages`)

    let insert = ref.add({
        teamId: teamId,
        text: text,

    }).then(snapshot =>
        res.send({
            status: "OK",
            ref: snapshot.ref
        }));
});


exports.handleMessage = functions.firestore.document('/messages/simple/{teamId}/{documentId}')
    .onCreate((snap, context) => {
        console.log("Yay, invoked")
        const message = snap.data()
        const triggeringMessageId = context.params.documentId

        const teamId = context.params.teamId
        const msgIntent = conversation.detectIntent(message)

        switch (msgIntent.basicIntent) {
          case 'create':
            return createEntity(msgIntent, teamId, triggeringMessageId)
          case 'update':
              return updateEntity(msgIntent, teamId, triggeringMessageId)
          case 'list':
              return listEntities(msgIntent, teamId, triggeringMessageId)
        default:
            console.log("Message ignored - not a supported action")
        }
    })


const createEntity = (intent, teamId, triggeringMessageId) => {
  console.log(`Creating new ${intent.entityType} ${intent.entityId}, for team ${teamId}`)
  const ref = db.collection(`entities/${intent.entityType}/${teamId}`)
  return ref.doc(`${intent.entityId}`).set({
    id: intent.entityId,
    teamId: teamId,
    text: intent.text,
    user: intent.user,
    status: intent.toStatus,
    created: new Date(),
    createMessage: triggeringMessageId
  }).then(snapshot => {
      const text = `${intent.entityType} ${intent.entityId} ${intent.toStatus}`
      console.log(text)
      // Send a message back
      let ref = db.collection(`messages/simple/${teamId}`)
      return ref.add({
          speechAct: "notify",
          teamId: teamId,
          type: "text-message",
          text: text,
          user: "bot@fromteal.app",
          userName: "fromTeal",
          userPicture: "http://fromTeal.app/static/media/logo.44c521dc.png",
          created: new Date()
      })
  }).catch(err => {
      console.log('Error creating entity', err);
  })
}


const updateEntity = (intent, teamId, triggeringMessageId) => {
  console.log(`Updating ${intent.entityType} ${intent.entityId} to status ${intent.toStatus}, for team ${teamId}`)
  const ref = db.collection(`entities/${intent.entityType}/${teamId}`)
  return ref.doc(`${intent.entityId}`).set({
    id: intent.entityId,
    teamId: teamId,
    text: intent.text,
    user: intent.user,
    status: intent.toStatus,
    updated: new Date(),
    lastUpdateMessage: triggeringMessageId
  }).then(snapshot => {
    const text = `${intent.entityType} ${intent.entityId} ${intent.toStatus}`
    console.log(text)
    // Send a message back
    let ref = db.collection(`messages/simple/${teamId}`)
    return ref.add({
            speechAct: "notify",
            teamId: teamId,
            type: "text-message",
            text: text,
            user: "bot@fromteal.app",
            userName: "fromTeal",
            userPicture: "http://fromTeal.app/static/media/logo.44c521dc.png",
            created: new Date()
        })
    }).catch(err => {
        console.log('Error updating entity', err);
    })
}


const listEntities = (intent, teamId, triggeringMessageId) => {
    console.log(`Listing ${intent.entityType}, for team ${teamId}`)
    const ref = db.collection(`entities/${intent.entityType}/${teamId}`)
    return ref.where("status", ">", "DELETED").get().then(snapshot => {
        const entities = []
        let text = ""
        let token = `${intent.entityType} list: `
        snapshot.forEach(doc => {
            const entity = doc.data()
            entities.push(entity)
            text = `${text}${token}[${entity.id}] ${entity.text}`
            token = ", "
        })
        console.log(entities)
        // Send a message back
        let ref = db.collection(`messages/simple/${teamId}`)
        return ref.add({
            speechAct: "answer",
            teamId: teamId,
            type: "text-message",
            text: text,
            user: "bot@fromteal.app",
            userName: "fromTeal",
            userPicture: "http://fromTeal.app/static/media/logo.44c521dc.png",
            created: new Date()
        })
    }).catch(err => {
        console.log('Error getting list of entities', err);
    });
    
}
