const words = require('./wordle-words')
const { removeIfExists, replaceCharAt } = require('./utils')

module.exports = function Wordle () {
  this.length = 5
  this.options = []
  this.matchingWords = words
  this.exactMatchingLetters = {}
  this.missplacedLetters = [[], [], [], [], []]

  this.validateWord = word => {
    if (typeof word !== 'string') {
      return 'word should be string'
    }
    word = word.toLowerCase()
    if (word.length !== this.length) {
      return `word should be ${this.length} long`
    }
    if (/[^a-z]+/.test(word)) {
      return 'Invalid word, only letters are allowed'
    }
    return true
  }

  this.validateOption = option => {
    if (typeof option !== 'string') {
      return 'option should be string'
    }
    if (/[^\+\-\.]+/.test(option)) {
      return "Invalid option, only '+', '-' and '.' are allowed"
    }
    if (option.length !== this.length) {
      return `option should be ${this.length} long`
    }
    return true
  }

  this.addOption = (word, option) => {
    const wordErrorMessage = this.validateWord(word)
    if (typeof wordErrorMessage === 'string') {
      throw new Error(wordErrorMessage)
    }
    const optionErrorMessage = this.validateOption(option)
    if (typeof optionErrorMessage === 'string') {
      throw new Error(optionErrorMessage)
    }

    this.options.push([word.toLowerCase(), option])
    this.solve()
  }

  this.showOptions = () => {
    console.log('current set of options', this.options)
  }

  this.solve = () => {
    this.exactMatchingLetters = {}
    let matching = '.....'
    let atLeastOneMatching = false
    const notExistingLetters = []
    this.missplacedLetters = [[], [], [], [], []]
    const allExistingLetters = []
    const regexes = []

    for (const option of this.options) {
      const letters = option[0]
      const mode = option[1]

      for (let i = 0; i < this.length; i++) {
        if (mode[i] === '+') {
          matching = replaceCharAt(matching, i, letters[i])
          atLeastOneMatching = true
          allExistingLetters.push(letters[i])
          removeIfExists(notExistingLetters, letters[i])
          this.exactMatchingLetters[letters[i]] = i
        } else if (
          mode[i] === '-' &&
          !allExistingLetters.includes(letters[i])
        ) {
          notExistingLetters.push(letters[i])
        } else if (mode[i] === '.') {
          this.missplacedLetters[i].push(letters[i])
          allExistingLetters.push(letters[i])
          removeIfExists(notExistingLetters, letters[i])
        }
      }
    }

    if (atLeastOneMatching) {
      regexes.push(new RegExp(matching))
    }

    if (notExistingLetters.length) {
      regexes.push(
        new RegExp(`[^${notExistingLetters.join('')}]{${this.length}}`)
      )
    }

    if (allExistingLetters.length) {
      const set = [...new Set(allExistingLetters)]
      set.forEach(letter => regexes.push(new RegExp(`(.*[${letter}].*)`)))
    }

    let missplacedRegex = new Array(this.length).fill('.')
    for (let i = 0; i < this.length; i++) {
      if (this.missplacedLetters[i].length) {
        missplacedRegex[i] = `[^${[...new Set(this.missplacedLetters[i])].join(
          ''
        )}]`
      }
    }
    if (atLeastOneMatching) {
      regexes.push(new RegExp(missplacedRegex.join('')))
    }

    console.log(regexes, 'regexes')

    this.matchingWords = words.filter(
      word => !regexes.find(reg => !reg.test(word))
    )
    console.log(this.matchingWords.length, 'words matching')
    this.findBestGuess()
  }

  this.showMatchingWords = () => {
    console.log(this.matchingWords)
  }

  this.findBestGuess = () => {
    const letterWeights = {}
    for (const word of this.matchingWords) {
      for (i = 0; i < word.length; i++) {
        const letter = word[i]
        if (this.exactMatchingLetters[letter] !== i) {
          letterWeights[letter] = (letterWeights[letter] || 0) + 1
        }
      }
    }
    let maxWeightWord = undefined
    let maxWeight = 0
    for (const word of this.matchingWords) {
      let weight = 0
      const existingLetters = {}
      for (i = 0; i < word.length; i++) {
        const letter = word[i]
        if (
          !existingLetters[letter] &&
          !this.missplacedLetters[i].includes(letter)
        ) {
          weight = weight + (letterWeights[letter] || 0)
        }
        existingLetters[letter] = true
      }
      if (weight > maxWeight) {
        maxWeight = weight
        maxWeightWord = word
      }
    }
    console.log('Next best guess is', maxWeightWord)
  }
}
