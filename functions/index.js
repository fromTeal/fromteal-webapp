const functions = require('firebase-functions')
const admin = require('firebase-admin')
const {PubSub} = require('@google-cloud/pubsub');
const cors = require('cors')({
    origin: true,
})
const conversation = require('./conversation')


const PROJECT_ID = process.env.GCLOUD_PROJECT


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
    .onCreate(messageHandler)


async function messageHandler(snap, context) {
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
}

const createEntity = async (intent, teamId, triggeringMessageId) => {
    try {
        const snapshot = await createEntityRecord(intent, teamId, triggeringMessageId)
        intent.teamId = teamId
        const messageId = await publishEvent("entity_created", intent)
        console.log(`Message ${messageId} sent to topic: entity_created`)
        return notifyOnEntityChange(intent, teamId)
    } catch (err) {
      console.log('Error creating entity', err)
    }
}


const createEntityRecord = (intent, teamId, triggeringMessageId) => {
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
    })
}

const notifyOnEntityChange = (intent, teamId) => {
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
}

const updateEntity = async (intent, teamId, triggeringMessageId) => {
    try {
        const snapshot = await updateEntityRecord(intent, teamId, triggeringMessageId)
        intent.teamId = teamId
        const messageId = await publishEvent("entity_updated", intent)
        console.log(`Message ${messageId} sent to topic: entity_updated`)
        return notifyOnEntityChange(intent, teamId)
    } catch (err) {
        console.log('Error updating entity', err)
    }
}

const updateEntityRecord = (intent, teamId, triggeringMessageId) => {
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


const publishEvent = async (topicName, data) => {
    const pubsub = new PubSub({PROJECT_ID})
    const jsonData = JSON.stringify(data)
    const dataBuffer = Buffer.from(jsonData)
    return pubsub.topic(topicName).publish(dataBuffer)
}


exports.handleEntityCreatedEvent = functions.pubsub.topic('entity_created')
    .onPublish((message) => {
    // TODO is there something to do?
  });


exports.handleEntityUpdatedEvent = functions.pubsub.topic('entity_updated')
    .onPublish((message) => {
     console.log(`team is ${message.json.teamId}`)
    // we only have tasks for approved entities, so ignore other states
    if (message.json.toStatus !== 'approved') return
    switch (message.json.entityType) {
        case 'purpose':
            // look up other approved entities

            // if found, update them to state 'replaced'

            // update the team

            break
    }
});