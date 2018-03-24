var exphbs = require('express-handlebars')
var express = require('express')
var http = require('http')
var path = require('path')
require('dotenv').config()

/*
  CONFIGURE
*/

// create Express server instace
var app = express()

// configure Handlebars templating
app.engine('.hbs', exphbs({
  defaultLayout: 'default',
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views/templates')
}))

// configure server
app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'views'))
app.set('port', process.env.PORT || 8080)
app.use(express.static('static'))


/*
  ROUTER
*/

// homepage
app.get('/', (request, response) => {
  response.render('home', {
    title: 'Fuinki'
  })
})


/*
  START
*/

// start the server
app.listen(app.get('port'))