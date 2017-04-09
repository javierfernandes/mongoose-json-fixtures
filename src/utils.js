export const flatten = list => list.reduce((acc, e) => {
  if (Array.isArray(e)) {
    return acc.concat(e)
  }
  acc.push(e)
  return acc
}, [])

export const sequencePromises = function(array) {
  return array.reduce((soFar, func) => {
    return soFar.then(result => {
      return func().then(e => {
        result.push(e)
        return result
      })
    })
  }, Promise.resolve([]));
}

export const splitInChunks = (array, chunkSize) => {
  let i = 0
  return array.reduce((acc, e) => {
    if (i === chunkSize) {
      acc.push([e])
      i = 1
    }
    else {
      acc[acc.length - 1].push(e)
      i++
    }
    return acc
  }, [[]])
}

export const startsWith = (string, preffix) => string.indexOf(preffix) == 0