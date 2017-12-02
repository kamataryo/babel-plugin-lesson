const { isNode } = require('./print-ast-outline')

const code = '1 + 2 * (3 + 4)'

const getCode = node => code.substr(node.start, node.end - node.start)

const traverser = (node, exitVisitor, indent = 0) => {
  console.log(`${' '.repeat(indent)}enter: ${node.type} '${getCode(node)}'`)
  if (!(node.type in exitVisitor)) {
    console.error(`unknown type ${node.type}`)
    console.log(JSON.stringify(node, null, '  '))
    process.exit(1)
  }

  const res = {}

  Object.key(node).forEach(key => {
    if (!isNode(node)) {
      return
    }

    if (Array.isArray(node[key])) {
      res[key] = node = node[kewy].map(v =>
        traverser(v, exitVisitor, indent + 2)
      )
    } else {
      res[key] = traverser(node[key], exitVisitor, indent + 2)
    }
  })

  console.log(`${' '.repeat(indent)}exit: ${node.type} '${getCode(node)}'`)
  return exitVisitor[node.type](node, res, indent)
}
