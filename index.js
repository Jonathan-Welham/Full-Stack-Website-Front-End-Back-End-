/* Database Table Names */
let authorTable = `l9_author`;
let quotesTable = `l9_quotes`;
let userTable = `users`;

//Base Variables for Weather Data
let mLon = 0.0;
let mLat = 0.0;

/*App config*/
/*Heroku config line: mysql://pfnztbj0jssyafv8:wygjtwvkebhwfirn@un0jueuv2mam78uv.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/vechx3rourud5mk8 */
var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var session = require('express-session');
var bcrypt = require('bcrypt');
var app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    secret: 'top secret code!',
    resave: true,
    saveUninitialized: true
}));
app.use(express.static("public")); //folder for images, css, js

/*MySQL DB -- Local Server Connection Config*/
// function localConnection() {
//   let con = mysql.createConnection({
//     hots:'localhost',
//     user:'daniel',
//     password:'password',
//     database:'quotes'
//   });
//
//   return con;
// }

/*MySQL DB -- JawsMariaDB Connection Config*/
function herokuConnection() {
  let con = mysql.createConnection({
    host:'d6q8diwwdmy5c9k9.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user:'tzlry3naw0wu3zx2',
    password:'v3iz92y0cpypv8cn',
    database:'wtczbcjgyshsp8x5'
  });
  return con;
}

/* Helper Functions */

function isAuthenticated(req, res, next){
    if(!req.session.authenticated) res.redirect('/login');
    else next();
}

function checkUsername(username){
    let stmt = 'SELECT * FROM users WHERE username=?';
    var con = herokuConnection();
    return new Promise(function(resolve, reject){
       con.query(stmt, [username], function(error, results){
           if(error) throw error;
           con.end();
           resolve(results);
       });
    });
}

function checkPassword(password, hash){
  return new Promise(function(resolve, reject){
     bcrypt.compare(password, hash, function(error, result){
        if(error) throw error;
        resolve(result);
     });
  });
}

function getAirportSearchData(query){
  var searchKeyword = query.airport;
  let stmt = `SELECT * FROM airports WHERE name LIKE '%${searchKeyword}%'`;
  let con = herokuConnection();
  return new Promise(function(resolve, reject){
     con.query(stmt, [searchKeyword], function(error, results){
         if(error) throw error;
         con.end();
         resolve(results);
     });
  });
}

function getCitySearchData(query){
  var searchKeyword = query.city;
  let stmt = `SELECT * FROM airports WHERE cityName LIKE '%${searchKeyword}%'`;
  let con = herokuConnection();
  return new Promise(function(resolve, reject){
     con.query(stmt, [searchKeyword], function(error, results){
         if(error) throw error;
         con.end();
         resolve(results);
     });
  });
}

function getLatAndLon(query){
  let stmt = `SELECT lat, lon FROM airports WHERE cityname=?`;
  let con = herokuConnection();
  return new Promise(function(resolve, reject){
     con.query(stmt, [query.weather], function(error, results){
         if(error) throw error;
         con.end();
         resolve(results);
     });
  });
}



/* Routes */
//home Routes
app.get('/', function (req, res){
  res.redirect('/home');
});
app.get('/home', function(req, res){
  //Was attempting to show search data in home page but it wasn't worth it
  var results = [];
  res.render('home', {"results":results});
});

//login routes used in a modal
app.get('/login', function(req, res){
  res.render('login');
});
app.post('/login', async function(req, res){
    let isUserExist   = await checkUsername(req.body.username);
    if(isUserExist.length > 0) { console.log("USER FOUND"); } else { console.log("USER NOT FOUND"); }
    let hashedPasswd  = isUserExist.length > 0 ? isUserExist[0].password : '';
    let passwordMatch = await checkPassword(req.body.password, hashedPasswd);
    if(passwordMatch){
      console.log("PASSWORDS MATCH");
        req.session.authenticated = true;
        req.session.user = isUserExist[0].username;
        res.redirect('/home');
    }
    else{
        console.log("PASSWORDS DON'T MATCH");
        res.render('login', {error: true});
    }
});

/* Register Routes */
app.get('/register', function(req, res){
    res.render('register');
});
app.post('/register', function(req, res){
    let salt = 10;
    bcrypt.hash(req.body.password, salt, function(error, hash){
        if(error) throw error;
        let stmt = 'INSERT INTO users (username, password) VALUES (?, ?)';
        let connection = herokuConnection();
        let data = [req.body.username, hash];
        connection.query(stmt, data, function(error, result){
           if(error) throw error;
           connection.end();
           res.redirect('/login');
        });
    });
});

/* Logout Route */
app.get('/logout', function(req, res){
   req.session.destroy();
   res.redirect('/');
});

/* Search Fields */
app.get('/citysearch', async function(req, res){
    let airportData = await getAirportSearchData(req.query);
    res.render('citysearch', {"results": airportData});
});

app.get('/airportsearch', async function(req, res){
    let cityData = await getCitySearchData(req.query);
    res.render('airportsearch', {"results": cityData});
});

app.get('/weathersearch', async function(req, res){
  //AJAX Call
  let mLonAndLat = await getLatAndLon(req.query);
  if(mLonAndLat.length <= 0) {
    mLon = 0;
    mLat = 0;
  } else {
    mLon = mLonAndLat[0].lon;
    mLat = mLonAndLat[0].lat;
  }
  console.log("lon and lat= " + mLon + " " + mLat);
  res.render('weathersearch', {"mLon":mLon, "mLat":mLat, "cityName":req.query.weather});
});

app.get('/weathersearchData', async function(req, res){
  res.send({"mLon":mLon, "mLat":mLat, "cityName":req.query.weather});
})


/* Flight Planner */
app.get('/planFlight', isAuthenticated, function(req, res){
//grab data
  res.render('planFlight');
});

app.post('/planFlight', isAuthenticated, function(req, res){


  res.render('/');
});

app.get('/userflights', isAuthenticated, function(req, res){
//show data
  res.render('userflights');
});





/* Error Route */
app.get("*", async function(req, res){
    res.render("error");
});
//Console output
app.listen(process.env.PORT, function() {
  console.log("Express server is running...");
});

//opening server and opening listening channel
var server = app.listen(3000, function() {
  //opens server on port 3000, does stuff
});
