const Wordle = require('./src/wordle')
const inquirer = require('inquirer')

const wordle = new Wordle()

const prompt = async () => {
  let proceed = true
  let word = undefined
  let option = undefined
  while (proceed) {
    wordle.showOptions()
    console.log(
      "Set '+' for exact match (green), '-' for not existing (grey) and '.' for missplaced (orange) letters in the exact position of option"
    )
    const inputs = await inquirer.prompt([
      {
        type: 'input',
        name: 'word',
        message: 'Enter Next Word',
        validate: w => wordle.validateWord(w)
      },
      {
        type: 'input',
        name: 'option',
        message: 'Enter option',
        validate: o => wordle.validateOption(o)
      }
    ])
    try {
      wordle.validateOption(inputs.option)
      word = inputs.word
      option = inputs.option
      wordle.addOption(word, option)
    } catch (e) {
      console.error(e.message)
    }
    word = undefined
    option = undefined

    const checkBoxInputs = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'showWords',
        message: 'Show matching words',
        default: false
      }
    ])
    if (checkBoxInputs.showWords) {
      wordle.showMatchingWords()
    }
  }
}

prompt().then(done => console.log('Done'))
