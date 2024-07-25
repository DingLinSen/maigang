const fs = require('fs')
const path = require('path')

const express = require('express')
const app = express()
const ports = 8888

app.use(express.static(path.resolve(__dirname, './dist')))

app.get('*', (req, res) => {
  const html = fs.readFileSync(path.resolve(__dirname, './dist/index.html'), 'utf-8')
  res.send(html)
})

app.listen(ports)
console.log(`server start on ${ ports }`)