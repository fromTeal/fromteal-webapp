const functions = require('firebase-functions')
const admin = require('firebase-admin')
const {PubSub} = require('@google-cloud/pubsub');
const cors = require('cors')({
    origin: true,
})
const _ = require('lodash')
const TfIdf = require('node-tfidf')
const emoji = require('node-emoji')
const conversation = require('./conversation')
const {ENTITIES_METADATA} = require('./entities')
const textUtils = require('./text_utils')


const FROMTEAL_AVATAR = "http://fromTeal.app/static/media/logo.44c521dc.png"

const PROJECT_ID = process.env.GCLOUD_PROJECT

const TFIDF_THRESHOLD = 0

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
    const message = snap.data()
    console.log(`Yay, invoked: '${JSON.stringify(message)}'`)
    const triggeringMessageId = context.params.documentId

    const teamId = context.params.teamId
    const msgIntent = conversation.detectIntent(message)

    console.log(`Message basic intent: ${msgIntent.basicIntent}`)

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
        // if no entity-id given, generate random one
        if (_.get(intent, 'entityId', '') === '') {
            intent.entityId = getRandomEmoji()
            console.log(`No entityId given - generating random emoji: ${intent.entityId}`)
        }
        else {
            console.log(`entityId provided: ${intent.entityId}`)
        }
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
    return sendMessageBackToUser(text, 
        "notify", intent.entityType, 
        intent.entityId, "text-message", teamId)
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
        return sendMessageBackToUser(text, 
            "answer", intent.entityType, null, 
            "text-message", teamId)
    }).catch(err => {
        console.log('Error getting list of entities', err);
    });
    
}


const sendMessageBackToUser = (text, speechAct, entityType, entityId, type, teamId) => {
    console.log(`Creating message in team ${teamId}`)
    let ref = db.collection(`messages/simple/${teamId}`)
    return ref.add({
        speechAct: speechAct,
        entityType: entityType,
        entityId: entityId,
        teamId: teamId,
        type: type,
        text: text,
        user: "bot@fromteal.app",
        userName: "fromTeal",
        userPicture: FROMTEAL_AVATAR,
        created: new Date()
    })
}


const publishEvent = async (topicName, data) => {
    const pubsub = new PubSub({PROJECT_ID})
    const jsonData = JSON.stringify(data)
    const dataBuffer = Buffer.from(jsonData)
    return pubsub.topic(topicName).publish(dataBuffer)
}


exports.handleEntityCreatedEvent = functions.pubsub.topic('entity_created')
    .onPublish(async (message) => {
    // if a purpose is suggested in a personal team, we want to ask for confirmation 
    // - only on confirmation we would start the search for matching teams
    message = message.json
    console.log(message)
    if (message.speechAct === 'suggest' && message.entityType === 'purpose') {
        console.log(`Handling purpose creation for team: ${message.teamId}`)
        const team = await fetchTeam(message.teamId)
        console.log(team)
        if (team.teamType === 'person') {
            const text = `Please confirm this is what you really love to work on: ${message.text}`
            return sendMessageBackToUser(text, 
                'confirm', 'purpose', message.entityId, 
                'text-message', message.teamId)
        }
    }
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
            const addToArray = isArrayAttribute
            const team = await updateTeamAttribute(event.teamId, 
                attributeName, 
                attributeValue, 
                addToArray)
            console.log(`Team ${event.teamId} attribute ${attributeName} updated.`)
        }
    }
    // if the approved entity is of type purpose & it is a person-team, 
    // - perform a search for matching teams & send results back to user
    console.log("About to check if this is an approved purpose")
    if (event.entityType === 'purpose') {
        const team = await fetchTeam(event.teamId)
        console.log(`fetched team: ${JSON.stringify(team)}`)
        if (team.teamType === 'person') {
            console.log("Starting search")
            // TODO perform search for matching teams
            const matchingTeams = await searchForMatchingTeams(team.purpose, event.teamId)
            if (matchingTeams.length > 0) {
                let notifyText = `Found ${matchingTeams.length} teams matching your purpose`
                let resultMessageId = await sendMessageBackToUser(notifyText, 
                    "notify", null, null, "text-message", event.teamId)
                resultMessageId = await sendMessageBackToUser(JSON.stringify(matchingTeams), 
                    "match", "team", null, "list-message", event.teamId)
            }
            else {
                notifyText = "Couldn't find teams matching your purpose (we'll send here matches if we find some later)"
                resultMessageId = await sendMessageBackToUser(notifyText, 
                    "notify", null, null, "text-message", event.teamId)
            }
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

const updateTeamAttribute = async (teamId, attributeName, attributeValue, addToArray) => {
    console.log(`Updating ${teamId}: setting ${attributeName} to ${attributeValue}`)
    const ref = db.collection('teams')
    const team = await ref.doc(teamId).get()
    const teamData = team.data()
    console.log(teamData)
    if (addToArray) {
        if (!(attributeValue in teamData[attributeName])) {
            teamData[attributeName].push(attributeValue)
        }
    } else {
        teamData[attributeName] = attributeValue
    }
    console.log(`Updating to: ${JSON.stringify(teamData)}`)
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
        createdAt: new Date(),
        tags: [],
        members: [
            user.email
        ]
    })
    user.teamName = teamName
    user.teamId = teamName
    return user
}

exports.firstSignIn = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        try {
            const idToken = req.header('me')
            let user = await verifyUser(idToken)
            console.log(user)
            console.log(`Handling 1st-sign-in of ${user.email}`)
            user = await createPersonalTeam(user)
            console.log(user)
            const params = {teamId: user.teamId}
            const eventId = await publishEvent("user_ready_for_onboard", params)
            console.log(`Published event for user ${user.email} 1st sign-in: ${eventId}`)
            // send a welcome message
            const welcomeText = `Welcome to fromTeal, ${user.name}!`
            const greetMsg = await sendMessageBackToUser(welcomeText, 
                "greet", null, null, "text-message", user.teamId)
            return res.send(user)
        } catch (err) {
            res.status(500).send(err)
        }
    })
})



exports.handleUserOnboardEvent = functions.pubsub.topic('user_ready_for_onboard')
    .onPublish((message) => {
    const params = message.json

    // ask the user about her purpose
    const purposeAskText = "To continue, please tell us what would you really love to work on? The thing you would work on if you didn't have to work at all.. "
    return sendMessageBackToUser(purposeAskText, "ask", "purpose", null, "text-message", params.teamId)
})



exports.teamAutoTaggingJob = functions.pubsub.schedule('every 6 hour')
    .onRun((context) => {
    console.log('Team auto-tagging job invoked')
    return publishEvent('team_auto_tagging_requested', "start")
})

exports.startTeamAutoTagging = functions.pubsub.topic('team_auto_tagging_requested')
    .onPublish(async (message) => {
    console.log(`Team auto-tagging job requested ${JSON.stringify(message)}`)
    // TODO read in pages, otherwise we'll exceed the function timeout
    console.log("Fetching purpose text from all teams")
    const teams = await fetchAllTeams()
    const purposes = []
    teams.forEach(team => {
        const teamId = team.id
        const teamData = team.data()
        console.log(JSON.stringify(teamData))
        const p = _.get(teamData, 'purpose', "")
        console.log(`Current purpose is: ${p}`)
        const purposeTokens = cleanPurpose(p)
        console.log(`Current purpose tokens: ${purposeTokens}`)
        if (purposeTokens !== "") {
            purposes.push({
                teamId: teamId,
                purposeTokens: purposeTokens,
                tags: teamData.tags,
                allTags: _.get(teamData, 'allTags', [])
            })
        }
    })
    return publishEvent('team_auto_tagging_processing', purposes)
})

exports.handleTeamAutoTagging = functions.pubsub.topic('team_auto_tagging_processing')
    .onPublish(async (message) => {
    const teams = message.json
    console.log(JSON.stringify(teams))
    console.log(`Auto-tagging ${teams.length} teams `)
    const updates = []
    // calculate TF/IDF for all teams' purposes 
    const tfidf = new TfIdf()
    const tagsById = {}
    const allTagsById = {}
    teams.forEach(team => {
        tfidf.addDocument(team.purposeTokens, team.teamId)
        tagsById[team.teamId] = team.tags
        allTagsById[team.teamId] = team.allTags
        console.log(`Added document ${team.teamId} to TF/IDF model: ${team.purposeTokens}`)
    })
    tfidf.documents.forEach((d, i) => {
        const teamId = d['__key']
        console.log(`Going over document ${teamId}`)
        const teamAutoTags = []  
        for (const key in d) {
            if (key !== '__key') {
                if (d[key] > TFIDF_THRESHOLD) {
                    console.log(`Found new auto-tag: ${key}`)
                    teamAutoTags.push(key)
                }
            }
        }
        const existingTags = tagsById[teamId]
        const existingAllTags = allTagsById[teamId]
        const allTags = _.union(existingTags, teamAutoTags)
        if (!_.isEqual(allTags, existingAllTags)) {
            console.log(`Updating allTags for team ${teamId}: ${allTags}`)
            // TODO if faster, send pubsub event to trigger the team update async
            //updates.push(updateTeamAttribute(teamId, 'autoTags', teamAutoTags, false))
            updates.push(updateTeamAttribute(teamId, 'allTags', allTags, false))
        }
    })
    console.log(`${tfidf.documents.length} teams to be updated with auto-tags (${updates.length} updates)`)
    return Promise.all(updates)
})



const searchForMatchingTeams = async (purpose, exceludeTeamId) => {
    // clean & tokenize purpose text
    const tokens = cleanPurpose(purpose)
    let allMatches = []
    // for each token, search any team with this token as tag/auto-assigned-tag
    const queryResults = []
    tokens.split(" ").forEach(async w => {
        console.log(`Searching ${w}`)
        queryResults.push(searchTeamsByArrayAttributeValue("allTags", w))
    })
    const allResults = await Promise.all(queryResults)
    allResults.forEach(result => {
        if (!result.empty) {
            const teams = []
            result.forEach(t => {teams.push(t.data())})
            if (teams) {
                console.log(`Found ${JSON.stringify(teams)} matches`)
                allMatches.push(...teams)
            }
        }
    })
    console.log(`In total, found ${allMatches.length} teams`)
    // return the set of resulting teams, sorted by the number of tokens matched
    const frequencyCounts = textUtils.countFrequency(allMatches)
    console.log(`Frequency counts: ${JSON.stringify(frequencyCounts)}`)
    const matches = textUtils.keysSortedByValues(frequencyCounts)
    return matches.reverse()
}


//
//  Data access (TODO move)
//

const fetchTeam = async (teamId) => {
    const ref = db.collection('teams')
    const team = await ref.doc(teamId).get()
    return team.data()
}

const fetchAllTeams = async () => {
    const ref = db.collection('teams')
    return ref.get()
}

const searchTeamsByArrayAttributeValue = async (arrayField, value) => {
    const ref = db.collection('teams')
    return ref.where(arrayField, "array-contains", value).get()
}

//
//  Utilities (TODO move)
//


// emoji

const getRandomEmoji = () => {
    // TODO implement
    const randomEmoji = emoji.random()
    console.log(`Generated random emoji: ${randomEmoji.key} - ${randomEmoji.emoji}`)
    return randomEmoji.emoji
}


// nlp

const cleanPurpose = (text) => {
    // TODO library for text processing
    const panctuations = [',', '.', '!', '-', '(', ')', "'", '"', "&"]
    const commonPurposeWords = [
        'help', 'offer', 'deliver', 'happy', 'awesome', 'people', 'save',
        'stop', 'perfect', 'happier', 'change', 'easier', 'faster', 'improve',
        'evolve', 'humanity', 'to', 'you'
    ]
    text = text.toLowerCase()
    text = removeTokens(text, panctuations)
    //text = removeTokens(text, stopwords_en)   // the node-tfidf already does it
    text = removeTokens(text, commonPurposeWords)
    return text
}

const removeTokens = (text, tokens) => {
    tokens.forEach(t => { text = text.replace(t, '')})
    return text
}
