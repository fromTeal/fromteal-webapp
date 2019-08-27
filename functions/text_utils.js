

  const _tokenExists = (text, tokens) => {
    // TODO use classifier
    const panctuations = [',', '.', '!', '-', '(', ')']
    text = text.toLowerCase()
    panctuations.forEach(p => { text = text.replace(p, '')})
    // TODO refactor
    let tokenFound = false
    tokens.forEach(w => {
      if (text.indexOf(w) >= 0) {
        tokenFound = true
      }
    })
    return tokenFound
}

exports.tokenExists = _tokenExists

exports.isPositive = (text) => {
    const positiveWords = ['yes', 'true', 'confirm', 'positive', 'correct', 'right', 'sure', 'indeed', 'it is']
    return _tokenExists(text, positiveWords)
}

exports.isNegative = (text) => {
    // TODO use classifier
    const negativeWords = ['no', 'false', 'negative', 'not', "isn't"]
    return _tokenExists(text, negativeWords)
}

exports.countFrequency = (arr) => {
  // return object with the number of occurrences of each item in the given array
  let counts = {};

  for (let i = 0; i < arr.length; i++) {
    let num = arr[i];
    counts[num] = counts[num] ? counts[num] + 1 : 1;
  }
  return counts
}

exports.keysSortedByValues = (obj) => {
  // return the keys of a given object, sorted by their corresponding values
  const pairs = Object.keys(obj).map(k => [k, obj[k]])
  pairs.sort((a, b) => (a[1] > b[1]) ? 1 : -1)
  return pairs.map(pair => pair[0])
}
