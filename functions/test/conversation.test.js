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
                entityChange: true,
                entityChangeType: "update",
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
    })

})