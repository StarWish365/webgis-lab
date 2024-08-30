const express = require('express')
const app = express()
const port = 3000
app.use(express.static('public'))
app.get('/', (req, res) => res.send(' This is my first app part 1! '))
app.get('/lab1part1', (req, res) => {
    res.sendFile(__dirname + '/lab1part1.html');
})
app.listen(port, () => console.log(` Example applistening on port $ { port }! `))