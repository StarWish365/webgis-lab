const express = require('express')
const app = express()
const port = 3000
app.use(express.static('public'))

app.get('/', (req, res) => res.send('This is web and mobile gis course, lab2!'))
app.get('/lab2part1', (req, res) => res.sendFile(__dirname + '/lab2part1.html'))
app.listen(port, () => console.log(`Example app listening on port ${ port }!`))
