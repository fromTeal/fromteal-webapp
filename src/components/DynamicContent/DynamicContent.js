import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown'
import firebase from '../../firebase/firebase-config'

import classes from './DynamicContent.css'



class DynamicContent extends Component {

    state = {
        content: ''
    }
    
    fetchContent = (id) => {
        const db = firebase.firestore();
        // Disable deprecated features
        db.settings({
            timestampsInSnapshots: true
        });
        return db.collection('page_content').doc(id).get()
    } 

    componentDidMount = () => {
        this.fetchContent(this.props.contentId).then((doc) => {
            const items = doc.data().content || []
            this.setState({content: items.join("\n")})
        })
    }
 
    render () {
        return (
        <div className={'DynamicContent'}>
            <ReactMarkdown source={this.state.content} />
        </div>
        )
    }

}


export default DynamicContent
