const test = require('firebase-functions-test')()
const admin = require('firebase-admin')
const chai = require('chai')
const assert = chai.assert
const sinon = require('sinon')




describe('Text Utils Functions', () => {
    let textUtilsFunctions

    before(() => {
        textUtilsFunctions = require('../text_utils')
    })

    after(() => {
        test.cleanup()
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
            return assert.equal(textUtilsFunctions.isPositive(positiveExamples[0]), true)
        })

    })

})