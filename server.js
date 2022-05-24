const express = require('express')
const app = express()

const port = 3000

const expressLayouts = require('express-ejs-layouts')

const indexRouter = require('./routes/index')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))

const mongoose = require('mongoose')
mongoose.connect(process.env?.DATABASE_URL ?? `mongodb://localhost:${port}/___`, { useNewUrlParser: true })

const db = mongoose.connection
db.on('error', err => console.log(err))
db.once('error', () => console.log('Connected'))

app.use('/', indexRouter)
app.listen(process.env?.PORT ?? port)