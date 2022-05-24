if (process.env.NODE_ENV !== 'production') require('dotenv').config({ path: '.env' })

const express = require('express')
const app = express()

const expressLayouts = require('express-ejs-layouts')

const indexRouter = require('./routes/index')
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection
db.on('error', err => console.log(err))
db.once('open', () => console.log('Connected to the db'))

app.use('/', indexRouter)

app.listen(process.env.PORT)