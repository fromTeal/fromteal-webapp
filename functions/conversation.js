const entities = require('./entities')
const ENTITIES_METADATA = entities.ENTITIES_METADATA


exports.detectIntent = (message) => {
    const intent = {}
    intent.basicIntent = ''
    intent.text = message.text
    intent.user = message.user
    intent.toStatus = ''
    intent.metadataFound = false
    intent.validated = false
  
    if ('entityId' in message) {
      intent.entityId = message.entityId
    }
    if ('entityType' in message) {
      intent.entityType = message.entityType
    }
    if ('speechAct' in message) {
      intent.speechAct = message.speechAct
    }
    if (intent.entityType in ENTITIES_METADATA) {
        intent.metadataFound = true
    }
    if ('speechAct' in message && message.speechAct === "list") {
        intent.basicIntent = "list"
        intent.validated = true
    }
    else if ('entityType' in message && 'speechAct' in message && intent.entityType in ENTITIES_METADATA) {
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
  