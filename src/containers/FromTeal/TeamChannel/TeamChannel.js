import React, { Component } from 'react'
import _ from 'lodash'
import axios from 'axios'
import firebase from '../../../firebase/firebase-config'
import Chat from '../Chat/Chat'
import ChatInput from '../Chat/ChatInput/ChatInput'
import Spinner from '../../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler'
import AuthContext from '../../auth-context'
import {parse} from '../../../protocols/entityChat'
import { BldgView } from '../../../components/BldgView/BldgView'

import classes from './TeamChannel.css'


const ENTITIES_METADATA_URL = "https://us-central1-manual-pilot.cloudfunctions.net/getEntitiesMetadata"


class TeamChannel extends Component {
  static contextType = AuthContext

  state = {
    messages: [],
    idsByType: {},
    lastMessage: null,
    speechActs: [],
    entityTypes: [],
    entityTypesBySpeechAct: {},
    loading: true
  }

  constructor(props) {
    super(props)
    this.bldgView = React.createRef();
  }

  componentDidMount() {
    const teamId = this.props.match.params.id
    const db = firebase.firestore();
    // Disable deprecated features
    db.settings({
      timestampsInSnapshots: true
    });
    db.collection(`messages/simple/${teamId}`).orderBy("created")
        .onSnapshot((querySnapshot) => {
          this.setState({loading: false})
          querySnapshot.docChanges().forEach((change) => {
            // TODO handle other changes - update & delete!
            if (change.type === "added") {
              this.setState((prevState) => {
                const lastMessage = change.doc.data()
                  const newMessages = [...prevState.messages]
                  newMessages.push(lastMessage)
                  return {
                    ...prevState,
                    messages: newMessages,
                    lastMessage: lastMessage
                  }
                })
              }
            })
            this.bldgView.current.reload()
        })
    db.collection(`ids/by_team/${teamId}`).orderBy("entityType")
        .onSnapshot((querySnapshot) => {
          querySnapshot.docChanges().forEach((change) => {
            // TODO handle other changes - update & delete!
            if (change.type === "added") {
              this.setState((prevState) => {
                const lastId = change.doc.data()
                const lastIdType = lastId.entityType
                const newIdsByType = {...prevState.idsByType}
                let idsByThisType = []
                if (lastIdType in newIdsByType) {
                  idsByThisType = newIdsByType[lastIdType]
                }
                idsByThisType.push(lastId)
                newIdsByType[lastIdType] = idsByThisType
                return {
                  ...prevState,
                  idsByType: newIdsByType
                }
              })
            }
          })
        })
    // get & process the entities metadata
    axios.get( ENTITIES_METADATA_URL )
          .then( response => {
            const metadata = response.data
            const entityTypes = []
            const speechActs = ["list", "show"]   // list & show are special speech acts, not derived from transitions
            const entityTypesBySpeechAct = {
              "list": [],
              "show": []
            }
            _.keys(metadata).forEach((entityType) => {
              const entityTypeMetadata = metadata[entityType]
              entityTypes.push(entityType)
              entityTypesBySpeechAct["list"].push(entityType)
              entityTypesBySpeechAct["show"].push(entityType)
              _.keys(entityTypeMetadata.transitions).forEach((speechAct) => {
                  if (speechAct in entityTypesBySpeechAct) {
                    entityTypesBySpeechAct[speechAct].push(entityType)
                  } else {
                    speechActs.push(speechAct)
                    entityTypesBySpeechAct[speechAct] = [entityType]
                  }
                })
              })
            this.setState({entityTypes, speechActs, entityTypesBySpeechAct})
      })
  }

  parseMessage = (text, speechAct, entityType, entityId) => {
    try {
      const tree = parse(text)
      text = "" // parsed successfully
      _.keys(tree).forEach((k) => {
        if (_.startsWith(k, "speechAct")) {
          speechAct = tree[k].text
        }
        if (_.startsWith(k, "entityType")) {
          entityType = tree[k].text
        }
        if (_.startsWith(k, "entityId")) {
          entityId = tree[k].text
        }
        if (_.startsWith(k, "entityText")) {
          text = tree[k].text
        }
      })
    } catch (e) {
      // not parsed successfully
      // TODO validate it's a syntax error
      speechAct = "say"
    }  
    return {text, speechAct, entityType, entityId}
  }

  addMessage = (text, teamId, speechAct=null, entityType=null, entityId=null) => {
    if (_.isEmpty(speechAct) || _.isEmpty(entityType)) {
      ({text, speechAct, entityType, entityId} = this.parseMessage(text, speechAct, entityType, entityId))
    }
    const newMessage = {
      type: "text-message",
      text: text,
      user: this.context.user.email,
      userName: this.context.user.name,
      userPicture: this.context.user.picture,
      created: new Date()
    }
    if (!_.isEmpty(speechAct, true)) {
      newMessage.speechAct = speechAct
    }
    if (!_.isEmpty(entityType, true)) {
      newMessage.entityType = entityType
    }
    if (!_.isEmpty(entityId, true)) {
      newMessage.entityId = entityId
    }

    // check if the previous message was a question 
    // - if it is, we can assume this message is an answer & mark it as a reply to the previous message
    if (this.state.lastMessage && 
      (this.state.lastMessage.speechAct === 'ask' || this.state.lastMessage.speechAct === 'confirm')) {
      newMessage.inReplyTo = this.state.lastMessage
    }
    const db = firebase.firestore()
    db.collection(`messages/simple/${teamId}`).add(newMessage)
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
  }

  progSendMessage = (msg) => {
    msg = msg.replace("[", "").replace("]", "")
    // TODO use a "parse-speech-message" function
    const parts = msg.split(" ")
    const speechAct = parts[0]
    const entityType = parts[1]
    let entityId = null
    if (parts.length > 1) {
      entityId = parts[2]
    }
    const teamId = this.props.match.params.id
    this.addMessage(msg, teamId, speechAct, entityType, entityId, "", this.props.match.params.id)
  }

  render() {
    let chat = <Chat messages={this.state.messages} progSendMessage={this.progSendMessage} className={'Chat'}/>
    if (this.state.loading) chat = <Spinner />

    return (
      <React.Fragment>

        <div className={'bldg_layer'}>
          <BldgView ref={this.bldgView}/>
        </div>

        <div className={'chat_layer'}>
          {chat}
          <ChatInput
            teamId={this.props.match.params.id}
            speechActs={this.state.speechActs}
            entityTypes={this.state.entityTypes}
            entityTypesBySpeechAct={this.state.entityTypesBySpeechAct}
            idsByType={this.state.idsByType}
            addMessage={this.addMessage}/>
        </div> 

      </React.Fragment>
    )

  }

}


export default withErrorHandler(TeamChannel)
