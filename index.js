/* Require external APIs and start our application instance */
var express = require('express');
var mysql = require('mysql');
var app = express();

/* Configure our server to read public folder and ejs files */
app.use(express.static('public'));
app.set('view engine', 'ejs');


// const connection = mysql.createConnection({
//     host: '',
//     user: '',
//     password: '',
//     database: ''
// });
// connection.connect();

/* The handler for the DEFAULT route */
app.get('/', function(req, res){
    res.render('home');
});

app.get('/home', function(req, res){
  res.render('home');
});

app.get('/signup', function(req, res){
  res.render('signup');
});

app.get('/flightspage', function(req, res){
  res.render('flightspage');
});

app.get('/login', function(req, res){
  res.render('login')
})

app.get('/about', function(req, res){
  res.render('about')
})

/* The handler for undefined routes */
app.get('*', function(req, res){
   res.render('error');
});

/* Start the application server */
app.listen(process.env.PORT || 3000, function(){
    console.log('Server has been started');
})
