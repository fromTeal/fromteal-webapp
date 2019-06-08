const functions = require('firebase-functions')
const admin = require('firebase-admin')
const {PubSub} = require('@google-cloud/pubsub');
const cors = require('cors')({
    origin: true,
})
const conversation = require('./conversation')
const {ENTITIES_METADATA} = require('./entities')



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

    let ref = db.collection(`messages/simple/${teamId}`)

    let insert = ref.add({
        teamId: teamId,
        text: text,

    }).then(snapshot =>
        res.send({
            status: "OK",
            ref: snapshot.ref
        }));
})


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

const updateEntityRecord = async (intent, teamId, triggeringMessageId) => {
    console.log(`Updating ${intent.entityType} ${intent.entityId} to status ${intent.toStatus}, for team ${teamId}`)
    // 1st, read the existing record, to make sure we don't override data
    const ref = db.collection(`entities/${intent.entityType}/${teamId}`)
    const doc = await ref.doc(`${intent.entityId}`).get()
    return ref.doc(`${intent.entityId}`).set({
        ...doc.data(),
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
    // TODO implement (e.g., send email when adding member)
  });


exports.handleEntityUpdatedEvent = functions.pubsub.topic('entity_updated')
    .onPublish(async (message) => {
     const event = message.json
     let newEntity = null
     const metadata = ENTITIES_METADATA[event.entityType]
     console.log(`team is ${event.teamId}`)
    // currently, we only handle events of approving entities, so ignoring other states
    if (event.toStatus !== 'approved') return
    // check whether this entity-type has max-cardinality=1 
    if (metadata.maxCardinality === 1) {
        // look up other approved entities of this type
        const snapshot = await db.collection(`entities/${event.entityType}/${event.teamId}`)
            .where("status", "==", "approved")
            .get()
        const updates = []
        snapshot.forEach(doc => {
            console.log(`considering update of ${doc.id}`)
            console.log(doc.data())
            if (doc.id !== event.entityId) {
                console.log(`it is different than ${event.entityId}`)
                updates.push(updateEntityStatus(doc.id, event.entityType, doc.data(), 'replaced'))
            } else {
                newEntity = doc.data()
            }
        })
        console.log(`got ${updates.length} updates`)
        const results = await Promise.all(updates)
        console.log('done')
    }
    console.log(`Is team attribute? ${metadata.teamAttribute}`)
    // check whether this entity-type is a team attribute
    if (metadata.teamAttribute) {
        // if so, extract the attribute & update the team
        let attributeName = event.entityType
        let attributeValue = null
        console.log(`Checking dataType ${metadata.dataType}`)
        switch (metadata.dataType) {
            case 'short_string':
                attributeValue = newEntity.entityId
                break
            case 'string':
                attributeValue = newEntity.text
                break
            default:
                attributeValue = newEntity.text || newEntity.entityId
        }
        console.log(`About to update team: ${attributeValue}`)
        if (attributeValue !== null && attributeValue !== "") {
            const isArrayAttribute = metadata.maxCardinality !== 1
            if (isArrayAttribute) {
                attributeName = `${attributeName}s`
            }
            return updateTeamAttribute(event.teamId, 
                attributeName, 
                attributeValue, 
                isArrayAttribute)
        }
    }
})


const updateEntityStatus = async (entityId, entityType, entity, toStatus) => {
    console.log(`Updating ${entityId} located entities/${entityType}/${entity.teamId} to:`)
    entity.status = toStatus
    console.log(entity)
    return db.collection(`entities/${entityType}/${entity.teamId}`)
        .doc(entityId)
        .set(entity)
}

const updateTeamAttribute = async (teamId, attributeName, attributeValue, isArrayAttribute) => {
    console.log(`Updating ${teamId}: setting ${attributeName} to ${attributeValue}`)
    const ref = db.collection('teams')
    const team = await ref.doc(teamId).get()
    const teamData = team.data()
    console.log(teamData)
    if (isArrayAttribute) {
        if (!(attributeValue in teamData[attributeName])) {
            teamData[attributeName].push(attributeValue)
        }
    } else {
        teamData[attributeName] = attributeValue
    }
    console.log(`Updating to: ${teamData}`)
    return ref.doc(teamId).set(teamData)
}


const createPersonalTeam = async (user) => {
    // try to use the username part of the email
    let teamName = user.email.split("@")[0]
    // check whether this name is available
    const ref = db.collection('teams')
    const existingTeam = await ref.doc(teamName).get()    
    // else, use the full email
    if (existingTeam !== null) {
        teamName = user.email
    }
    // create a team & mark it as personal team
    const newTeam = await ref.doc(teamName).set({
        name: teamName,
        teamType: 'person',
        createdBy: user.email,
        createdAt: new Date()
    })
    return teamName
}

const firstSignIn = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        try {
            const idToken = req.header('me')
            const user = await verifyUser(idToken)
            console.log(`Handling 1st-sign-in of ${user.email}`)
            user.teamName = await createPersonalTeam(user)
            const messageId = await publishEvent("user_ready_for_onboard", user)
            return res.send(user)
        } catch (err) {
            res.status(500).send(err)
        }
    })
})






