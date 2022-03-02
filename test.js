const Wordle = require('./src/wordle')

const wordle = new Wordle()

// tested for wordle Wordle 256 4/6

// 🟨⬜⬜⬜⬜
// 🟨🟨🟨⬜⬜
// ⬜🟩🟨🟩🟨
// 🟩🟩🟩🟩🟩

// started with tempo
wordle.addOption('tempo', '.----')
// 932 words matching
// Next best guess is stair
wordle.addOption('stair', '...--')
// 359 words matching
// Next best guess is lants
wordle.addOption('lants', '-+.+.')
// 5 words matching
// Next best guess is nasty
