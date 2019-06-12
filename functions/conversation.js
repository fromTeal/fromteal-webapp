const {ENTITIES_METADATA} = require('./entities')


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
    else if ('inReplyTo' in message) {
      // if no speech-act, but this is a reply, infer speechAct & entityType from the message being replied
      const inReplyTo = message.inReplyTo
      intent.speechAct = 'suggest'  // TODO use dialogs metadata
      if (!('entityType' in intent) && 'entityType' in inReplyTo) {
        intent.entityType = inReplyTo.entityType
      }
    } 
    if (intent.entityType in ENTITIES_METADATA) {
        intent.metadataFound = true
    }
    // detect a list message
    if ('speechAct' in message && message.speechAct === "list") {
        intent.basicIntent = "list"
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
  