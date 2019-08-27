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


    describe('tokenExists should find whether a token exists in a given string', () => {

        it('should return true when a token exists', () => {
            const text = "Yes, it is"
            const tokens = ["absolutlely", "yes", "indeed"]
            return assert.equal(textUtilsFunctions.tokenExists(text, tokens), true)
        })

        it('should return false when a token does not exist', () => {
            const text = "Yes, it is"
            const tokens = ["no", "not", "false"]
            return assert.equal(textUtilsFunctions.tokenExists(text, tokens), false)
        })

        it('should return true when a token exists and equals to the text', () => {
            const text = "No"
            const tokens = ["no", "not", "false"]
            return assert.equal(textUtilsFunctions.tokenExists(text, tokens), true)
        })
      
        it('should return false when a token does not exist and text is one word', () => {
            const text = "Yes"
            const tokens = ["no", "not", "false"]
            return assert.equal(textUtilsFunctions.tokenExists(text, tokens), false)
        })

    })

})


describe('data-processing functions', () => {
    let textUtilsFunctions

    before(() => {
        textUtilsFunctions = require('../text_utils')
    })

    after(() => {
        test.cleanup()
    })

    it("should count frequencies", () => {
        const arr = ["a", "d", "a", "b", "a", "d", "a", "c"]
        const expected = {
            "a": 4,
            "d": 2,
            "b": 1,
            "c": 1
        }
        const got = textUtilsFunctions.countFrequency(arr)
        assert.deepEqual(got, expected)
    })

    it("should return object keys sorted by values", () => {
        const obj = {
            "c": 1,
            "a": 4,
            "b": 1,
            "d": 2
        }
        const expected = ["c", "b", "d", "a"]
        const got = textUtilsFunctions.keysSortedByValues(obj)
        assert.deepEqual(got, expected)
    })

})