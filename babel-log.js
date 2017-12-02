const babylon = require('babylon')
const log = require('babel-log')
const printAST = require('ast-pretty-print')

const ast = babylon.parse('1+2+3')

console.log(ast)
log(ast)
log(printAST(ast, true))
