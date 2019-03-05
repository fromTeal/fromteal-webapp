import React, { Component } from 'react'
import firebase from '../../../firebase/firebase-config'
import Chat from '../Chat/Chat'
import ChatInput from '../Chat/ChatInput/ChatInput'
import MessageInput from '../Chat/MessageInput/MessageInput'
import Spinner from '../../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler'

class TeamChannel extends Component {
  state = {
    messages: [],
    speechActs: [
      "notification",
      "ask-to-join",
      "suggest-tool",
      "ask-for-advice-on-tool",
      "approve-tool",
    ],
    loading: true
  }

  // TODO read entity-types metadata from props & infer message-types

  entityTypes = {
    "member": {
      states: ["invited", "applied", "declined", "discussed", "joined", "left", "removed", "inactive", "active"]
    },
    "purpose": {
      states: ["suggested", "discussed", "approved", "declined", "replaced"]
    },
    "team-name": {
      states: ["suggested", "discussed", "approved", "declined", "replaced"]
    },
    "logo": {
      states: ["suggested", "discussed", "approved", "declined", "replaced"]
    },
    "tool": {
      states: ["suggested", "discussed", "approved", "declined", "replaced"]
    },
    "product": {
      states: ["suggested", "discussed", "approved", "declined", "inactive"]
    },
    "use-case": {
      states: ["suggested", "discussed", "approved", "declined", "inactive", "designed", "started", "released", "validated", "removed"]
    }
  }

  allEntityTypes = [
    "member",
    "purpose",
    "team-name",
    "logo",
    "product",
    "use-case",
    "tool"
  ]

  // TODO create base message-types & merge with the ones inferred from the entity-types
  messageTypes = {
    "show": {
      entityMessage: false,
      speechAct: "show",
      parameters: ["entityType", "predicate", "entityId"],
      parametersOptions: {
        entityType: {
          description: "which type of entity",
          options: ["everything"],
          dynamicOptions: "entityTypes",
        },
        predicate: {
          conditionOnParameter: "entityType",
          conditionOnParameterValueNotEqual: "everything",
          description: "which {entityType} to show",
          options: ["all", "specific"],
          dynamicOptions: "entityStates",
          optional: true
        },
        entityId: {
          conditionOnParameter: "predicate",
          conditionOnParameterValue: "specific",
          description: "choose {entityType}",
          dynamicOptions: "entityIds",
          optional: true
        }
      }
    },
    "invite": {
      entityMessage: true,
      creatingNewEntity: true,
      speechAct: "invite",
      parameters: ["entityType", "entityId", "message"],
      parametersOptions: {
        entityType: {
          options: ["member"],
        },
        entityId: {
          description: "enter email address",
          validation: "email"
        },
        message: {
          description: "enter invitation message",
          optional: true
        }
      }
    },
    "accept": {
      entityMessage: true,
      creatingNewEntity: false,
      speechAct: "accept",
      parameters: ["entityType", "entityId"],
      parametersOptions: {
        entityType: {
          options: ["member"],
        },
        entityId: {
          description: "enter email address",
          validation: "email"
        }
      }
    },
    "suggest": {
      entityMessage: true,
      creatingNewEntity: true,
      speechAct: "suggest",
      parameters: ["entityType", "entityId", "message"],
      parametersOptions: {
        entityType: {
          options: ["purpose", "team-name", "product", "use-case", "tool"],
        },
        entityId: {
          description: "enter {entityType} id",
          validation: "entityId",
          defaultValue: "counter"
        },
        message: {
          description: "enter {entityType} description",
          optional: true
        }
      }
    },
    "discuss": {
      entityMessage: true,
      creatingNewEntity: false,
      speechAct: "discuss",
      parameters: ["entityType", "entityId", "message"],
      parametersOptions: {
        entityType: {
          options: ["purpose", "team-name", "product", "use-case", "tool"],
        },
        entityId: {
          description: "choose {entityType}",
          dynamicOptions: "entityIds",
        },
        message: {
          description: "enter message",
          optional: true
        }
      }
    },
    "approve": {
      entityMessage: true,
      creatingNewEntity: false,
      speechAct: "approve",
      parameters: ["entityType", "entityId", "message"],
      parametersOptions: {
        entityType: {
          options: ["purpose", "team-name", "product", "use-case", "tool"],
        },
        entityId: {
          description: "choose {entityType}",
          dynamicOptions: "entityIds",
        },
        message: {
          description: "enter message",
          optional: true
        }
      }
    }
    // TODO add more
  }


  componentDidMount() {
    const teamId = this.props.match.params.id
    const db = firebase.firestore();
    // Disable deprecated features
    db.settings({
      timestampsInSnapshots: true
    });
    db.collection(`communicate/${teamId}/messages`).orderBy("created")
        .onSnapshot((querySnapshot) => {
          this.setState({loading: false})
          querySnapshot.docChanges().forEach((change) => {
            // TODO handle other changes - update & delete!
            if (change.type === "added") {
              this.setState((prevState) => {
                  const newMessages = [...prevState.messages]
                  newMessages.push(change.doc.data())
                  return {
                    ...prevState,
                    messages: newMessages
                  }
                })
              }
            })
        });
  }

  // TODO remove once switched to messageSentHandler
  addMessage = (speechAct, text, teamId) => {
    const db = firebase.firestore()
    db.collection(`communicate/${teamId}/messages`).add({
        type: "text-message",
        speechAct: speechAct,
        text: text,
        user: "dibaunaumh@gmail.com",
        created: new Date()
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
  }


  messageSentHandler = (isUnderstood, speechAct, entityType, entityId,
                        parameters, messageText, teamId) => {
    const db = firebase.firestore()
    db.collection(`communicate/${teamId}/messages`).add({
        type: "text-message",
        isUnderstood: isUnderstood,
        speechAct: speechAct,
        entityType: entityType,
        entityId: entityId,
        parameters: parameters,
        messageText: messageText,
        user: "dibaunaumh@gmail.com",
        created: new Date()
    })    // TODO set current user!!!
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
  }

  // TODO add support for search
  fetchEntityIds = (entityType) => {
    // TODO replace temporary mock with fetch from database
    switch(entityType) {
      case "tool":
        return ["Trello", "Notion.so", "Google-Docs"]
      case "member":
        return ["udi@gmail.com", "inna@gmail.com", "arvind@gmail.com"]
      case "purpose":
        return ["purpose#1", "purpose#2", "purpose#3", "purpose#4", "purpose#5"]
      case "team-name":
        return ["team-name#1"]
      default:
        return []
    }
  }

  fetchDynamicOptions = (dynamicOptions, params) => {
    switch(dynamicOptions) {
      case "entityTypes":
        return this.allEntityTypes
      case "entityStates":
        if (!params) throw "Can't fetch entity-states: missing params"
        if (!params.hasOwnProperty("entityType")) throw "Can't fetch entity-states: missing entityType parameter"
        return this.entityTypes[params.entityType].states
      case "entityIds":
        if (!params) throw "Can't fetch entity-states: missing params"
        if (!params.hasOwnProperty("entityType")) throw "Can't fetch entity-states: missing entityType parameter"
        return this.fetchEntityIds(params.entityType)
      default:
        throw `${dynamicOptions} dynamic-options isn't supported`
    }
  }

  render() {
    let chat = <Chat messages={this.state.messages}/>
    if (this.state.loading) chat = <Spinner />

    return (
      <React.Fragment>
        {chat}
        <ChatInput teamId={this.props.match.params.id} speechActs={this.state.speechActs} addMessage={this.addMessage}/>
        <hr/>
        <MessageInput
          messageSent={this.messageSentHandler}
          givenMessage={this.props.givenMessage}
          messageTypes={this.messageTypes}
          dynamicOptions={this.fetchDynamicOptions}/>
      </React.Fragment>
    )

  }

}


export default withErrorHandler(TeamChannel)
