

  const tokenExists = (text, tokens) => {
    // TODO use classifier
    const panctuations = [',', '.', '!', '-', '(', ')']
    text = text.toLowerCase()
    panctuations.forEach(p => { text = text.replace(p, '')})
    const parts = text.split(' ')
    // TODO refactor
    let tokenFound = false
    tokens.forEach(w => {
      if (parts.indexOf(w) >= 0) {
        tokenFound = true
      }
    })
    return tokenFound
}

exports.isPositive = (text) => {
    const positiveWords = ['yes', 'true', 'confirm', 'positive', 'correct', 'right', 'sure', 'indeed', 'it is']
    return tokenExists(text, positiveWords)
}

exports.isNegative = (text) => {
    // TODO use classifier
    const negativeWords = ['no', 'false', 'negative', 'not', "isn't"]
    return tokenExists(text, negativeWords)
}
