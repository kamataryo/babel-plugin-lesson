const { transform } = require('babel-core')
const { parseExpression } = require('babylon')
const source = `
  // comment<1>
  const hoge = require("hoge")  // comment<2>
  // comment<3>
  const hogehoge = 100 /* comment<4> */
  function sayHello() { return 'hello!' }
  class Cat {}
`

const WasCreated = Symbol('WasCreated')

const plugin = ({ types: t, template }) => {
  return {
    visitor: {
      Program: {
        exit: (nodePath, state) => {
          const newStartAst = template(
            'console.log("=============== start of code ==================")'
          )()
          const newEndAst = template(
            'console.log("=============== end of code ==================")'
          )()

          nodePath.unshiftContainer('body', newStartAst) // 先頭にコードを追加
          nodePath.pushContainer('body', newEndAst) // 最後にコードを追加
        }
      },

      VariableDeclarator: (nodePath, state) => {
        if (t.isIdentifier(nodePath.node.id)) {
          if (nodePath.node.id.name === 'hoge') {
            nodePath.get('init').replaceWith(parseExpression('1 + 1'))
          } else if (nodePath.node.id.name === 'hogehoge') {
            nodePath.get('init').replaceWith(parseExpression('1 * 4'))
          }
        }
      },
      'FunctionDeclaration|ClassDeclaration': (nodePath, state) => {
        if (nodePath[WasCreated] || !t.isIdentifier(nodePath.node.id)) {
          return
        }

        if (nodePath.node.id.name === 'sayHello') {
          const newAST = template('function sayHello() { return "foobar" }')()
          nodePath.replaceWith(newAST)
          nodePath[WasCreated] = true
        } else if (nodePath.node.id.name === 'Cat') {
          nodePath.replaceWith(template('class Dog {}')())
          nodePath[WasCreated] = true
        }
      }
    }
  }
}

console.log(transform(source, { plugins: [plugin] }).code)
