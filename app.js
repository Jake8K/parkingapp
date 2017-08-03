var express = require('express');
var mysql = require('./dbcon.js');
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 2454);
app.set('hostname', 'localhost');
app.use(express.static('public'));

app.get('/',function(request,response,next){
  var context = {};
  response.render('home', context);
});

app.post('/user',function(request,response,next){
  var context = {};

  console.log("1");
  
  mysql.pool.query("INSERT INTO User (user_username, user_fname, user_lname, \
    user_phone, user_email, user_address, user_city, user_state, user_zipcode) \
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);", [request.body.username, request.body.fname, 
    request.body.lname, request.body.phone, request.body.email, request.body.address, 
    request.body.city, request.body.state, request.body.zipcode], 
     function(err, result){
    if(err){
      next(err);
      return;
    }
    else {
      mysql.pool.query('SELECT * FROM User WHERE id=?', [result.insertId], function(err, rows, fields){
        if(err){
          next(err);
          return;
        }
        else {
          response.send(JSON.stringify(rows[rows.length - 1]));
        }
      });
    }
  });
});

/*
app.get('/delete_band',function(request,response,next){
  var context = {};
  
  mysql.pool.query("DELETE FROM Band WHERE band_id=?;", 
    [request.query.band_id], 
     function(err, result){
    if(err){
      next(err);
      return;
    }
    else {
      response.redirect('/bands');
    }
  });
});
*/

app.use(function(request,response){
  response.status(404);
  response.render('404');
});

app.use(function(err, request, response, next){
  console.error(err.stack);
  response.status(500);
  response.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://' + app.get('hostname') + ':' + app.get('port') + '; press Ctrl-C to terminate.');
});

