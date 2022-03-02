function replaceCharAt (item, index, char) {
  let a = item.split('')
  a[index] = char
  return a.join('')
}

function removeIfExists (array, letter) {
  const index = array.indexOf(letter)
  if (index > -1) {
    array.splice(index, 1) // 2nd parameter means remove one item only
  }
}

function replaceCharAt (item, index, char) {
  let a = item.split('')
  a[index] = char
  return a.join('')
}

module.exports = { removeIfExists, replaceCharAt }
