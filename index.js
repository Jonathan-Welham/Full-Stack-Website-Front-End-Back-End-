/* Section for DB Table names (for clarity) */
//michael reeves user is storing all 20 preset flights
let mUserTable = "users";
let mFlightsTable = "flights";
let mAirportsTable = "airports";


/* Require external APIs and start our application instance */
var express = require('express');
var mysql = require('mysql');
var app = express();

/* Configure our server to read public folder and ejs files */
app.use(express.static('public'));
app.set('view engine', 'ejs');

/*MySQL Configuration*/
function herokuConnection() {
  let con = mysql.createConnection({
    hots:'un0jueuv2mam78uv.cbetxkdyhwsb.us-east-1.rds.amazonaws.com ',
    user:'qvf8vxh0rdduv2gg',
    password:'f8o1mvy0nowab7c0',
    database:'ddjfarfxnodbdjgp'
  });
  return con;
}


/* Helper Functions */


/* Routes */
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
