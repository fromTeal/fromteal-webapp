const test = require('firebase-functions-test')()
const admin = require('firebase-admin')
const chai = require('chai')
const assert = chai.assert
const sinon = require('sinon')




describe('Conversation Functions', () => {
    let conversationFunctions

    before(() => {
        conversationFunctions = require('../conversation')
    })

    after(() => {
        test.cleanup()
    })


    describe('detectIntent', () => {


        it('should detect suggest purpose message', () => {
            const message = {
                entityId: "🌱",
                entityType: "purpose",
                speechAct: "suggest",
                text: "Make people awesome",
                type: "text-message",
                user: "user@example.org",
                userName: "Nowbleed Forme"
            }
            const teamId = "team1"
            const trigMsgId = "msg012"

            const expectedIntent = {
                basicIntent: "create",
                entityId: "🌱",
                entityType: "purpose",
                metadataFound: true,
                speechAct: "suggest",
                text: "Make people awesome",
                user: "user@example.org",
                toStatus: "suggested",
                validated: true
            }
            const got = conversationFunctions.detectIntent(message, teamId, trigMsgId)
            return assert.deepEqual(got, expectedIntent);
        })

        
        it('should detect approve purpose message', () => {
            const message = {
                entityId: "🌱",
                entityType: "purpose",
                speechAct: "approve",
                text: "LGTM",
                type: "text-message",
                user: "user@example.org",
                userName: "Nowbleed Forme"
            }
            const teamId = "team1"
            const trigMsgId = "msg123"

            const expectedIntent = {
                basicIntent: "update",
                entityId: "🌱",
                entityType: "purpose",
                metadataFound: true,
                speechAct: "approve",
                text: "LGTM",
                user: "user@example.org",
                toStatus: "approved",
                validated: true
            }
            const got = conversationFunctions.detectIntent(message, teamId, trigMsgId)
            return assert.deepEqual(got, expectedIntent);
        })


        it('should detect list purpose message', () => {
            const message = {
                entityId: "",
                entityType: "purpose",
                speechAct: "list",
                text: "",
                type: "text-message",
                user: "user@example.org",
                userName: "Nowbleed Forme"
            }
            const teamId = "team1"
            const trigMsgId = "msg234"

            const expectedIntent = {
                basicIntent: "list",
                entityId: "",
                entityType: "purpose",
                metadataFound: true,
                speechAct: "list",
                text: "",
                user: "user@example.org",
                toStatus: "",
                validated: true
            }
            const got = conversationFunctions.detectIntent(message, teamId, trigMsgId)
            return assert.deepEqual(got, expectedIntent);
        })


    })


    describe('classify', () => {

        const positiveExamples = [
            "Yes, it is"
        ]
        const negativeExamples = [

        ]
        const neutralExamples = [
            
        ]

        it('should classify a positive answer', () => {
            // TODO implement
            return assert.equal(conversationFunctions.isPositive(positiveExamples[0]), true)
        })

    })

})