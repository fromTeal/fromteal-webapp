const {ENTITIES_METADATA} = require('./entities')
const _ = require('lodash')
const textUtils = require('./text_utils')


exports.normalizedMessage = (message) => {
  const normalizedMessage = {...message}
  if (_.get(message, 'speechAct', null) !== null) {
    normalizedMessage.speechAct = message.speechAct.toLowerCase()
  }
  if (_.get(message, 'entityType', null) !== null) {
    normalizedMessage.entityType = message.entityType.toLowerCase()
  }
  return normalizedMessage
}

exports.detectIntent = (message) => {
    const intent = {}
    intent.basicIntent = ''
    intent.text = message.text
    intent.user = message.user
    intent.userName = message.userName
    intent.userPicture = message.userPicture
    intent.toStatus = ''
    intent.metadataFound = false
    intent.validated = false
  
    if ('entityId' in message) {
      intent.entityId = message.entityId
    } else if (_.get(message, 'inReplyTo.entityId', null) !== null) {
      intent.entityId = message.inReplyTo.entityId
    }
    if ('entityType' in message) {
      intent.entityType = message.entityType
    } else if ('inReplyTo' in message && 'entityType' in message.inReplyTo) {
      intent.entityType = message.inReplyTo.entityType
    }
    if ('speechAct' in message) {
      intent.speechAct = message.speechAct
    } else if ('inReplyTo' in message && 'speechAct' in message.inReplyTo) {
      // if no speech-act, but this is a reply, infer speechAct from the message being replied
      // TODO use dialogues metadata
      switch (message.inReplyTo.speechAct) {
        case 'ask':
            intent.speechAct = 'suggest'
            break
        case 'confirm':
            if (textUtils.isPositive(message.text)) {
              intent.speechAct = 'approve'
            }
            else if (textUtils.isNegative(message.text)) {
              intent.speechAct = 'decline'
            }
            break
      }
    } 
    // detect a join message
    if ('speechAct' in message && message.speechAct === "join") {
      // join is a special speech-act - 
      // it flips the subject-entity-type & subject-entity-id with the object-entity-type & object-entity-id
      // also, it changes the context of the team -
      // it writes the message in the team the user tries to join
      // TODO add metadata-based "macros" to the protocol, allowing friendly ways to say things
      intent.teamId = intent.entityId
      intent.objectEntityType = intent.entityType
      intent.objectEntityId = intent.entityId
      intent.entityType = "member"
      intent.entityId = message.user
    }
    if (intent.entityType in ENTITIES_METADATA) {
        intent.metadataFound = true
    }
    // detect a list message
    if ('speechAct' in message && message.speechAct === "list") {
        intent.basicIntent = "list"
        intent.validated = true
    }
    // detect a show message
    else if ('speechAct' in message && message.speechAct === "show") {
      intent.basicIntent = "show"
      intent.validated = true
    }
    else if ('entityType' in intent && 'speechAct' in intent && intent.entityType in ENTITIES_METADATA) {
      const metadata = ENTITIES_METADATA[intent.entityType]
      if (intent.speechAct in metadata.transitions) {
        const transition = metadata.transitions[intent.speechAct]
        if (transition.from.length === 0) {
          intent.basicIntent = 'create'
        }
        else {
          intent.basicIntent = 'update'
        }
        intent.toStatus = transition.to
        intent.validated = true
      }
    }
    
    return intent
  }
  

