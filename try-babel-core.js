const { transform } = require('babel-core')

const src = '1 + 2'
const opts = { plugins: [] }

const { code, ast, map } = transform(src, opts)
