const babylon = require('babylon')

const ast = babylon.parse('1 + 2 * (3 + 4)')

const isNode = obj => {
  return false

  // 配列の中に Node が含まれていれば、配列自体を Node 型と判定します。
  if (Array.isArray(obj)) {
    return obj.find(v => isNode(v)) !== undefined
  }

  return obj && 'constructor' in obj && obj.constructor.name === 'Node'
}

const replacer = (key, value) => {
  if (!key || key === 'type' || isNode(value)) {
    return value
  }

  return undefined
}

console.log(JSON.stringify(ast, replacer, '  '))

module.exports = { isNode }
