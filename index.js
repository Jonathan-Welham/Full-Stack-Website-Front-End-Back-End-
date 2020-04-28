/* Section for DB Table names (for clarity) */
//michael reeves user is storing all 20 preset flights
let mUserTable = "users";
let mFlightsTable = "flights";
let mAirportsTable = "airports";


/* Require external APIs and start our application instance */
var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var session = require('express-session');
var bcrypt = require('bcrypt');
var app = express();


/* Configure our server to read public folder and ejs files */
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    secret: 'top secret code!',
    resave: true,
    saveUninitialized: true
}));
app.set('view engine', 'ejs');


/*MySQL Configuration*/
var connection = mysql.createConnection({
    hots:'d6q8diwwdmy5c9k9.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user:'tzlry3naw0wu3zx2',
    password:'v3iz92y0cpypv8cn',
    database:'wtczbcjgyshsp8x5'
});
connection.connect();

// function herokuConnection() {
//   let con = mysql.createConnection({
//     host:'d6q8diwwdmy5c9k9.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
//     user:'tzlry3naw0wu3zx2',
//     password:'v3iz92y0cpypv8cn',
//     database:'wtczbcjgyshsp8x5'
//   });
//   return con;
// }


/* Middleware */
function isAuthenticated(req, res, next){
    if(!req.session.authenticated) res.redirect('/login');
    else next();
}


/* Helper Functions */
function checkUsername(username){
  let stmt = 'SELECT * FROM users WHERE username=?';
  return new Promise(function(resolve, reject){
     connection.query(stmt, [username], function(error, results){
         if(error) throw error;
         resolve(results);
     });
  });
}

function checkPassword(password){
  return new Promise(function(resolve, reject){
     bcrypt.compare(password, hash, function(error, result){
        if(error) throw error;
        resolve(result);
     });
  });
}


/* Routes */
//Home Pages
app.get('/', function(req, res){
    res.render('home');
});

app.get('/home', function(req, res){
  res.render('home');
});

//Login/SignUp Routes
app.get('/signup', function(req, res){

  res.render('signup');
});

app.post('/signup', function(req, res){

});

app.get('/login', function(req, res){

  res.render('login')
})

app.post('/login', function(req, res){

});

//Login Required Access
app.get('/flightspage', function(req, res){
  res.render('flightspage');
});

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
