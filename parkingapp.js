var express = require('express');
var mysql = require('./dbcon.js');
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 5853);
app.set('hostname', 'localhost');
app.use(express.static('public'));

app.get('/',function(request,response,next){
  var context = {};
  response.render('home', context);
});

app.get('/user',function(request,response,next){
  var context = {};
  mysql.pool.query('SELECT * FROM User', function(err, rows, fields){
    if(err){
      response.status(409);
      response.send(err.sqlMessage);
    }
    else {
      context.exercises = rows;
      response.send(JSON.stringify(rows));
    }
  });
});

app.post('/user',function(request,response,next){
  var context = {};
  
  mysql.pool.query("INSERT INTO User (user_username, user_fname, user_lname, \
    user_phone, user_email, user_address, user_city, user_state, user_zipcode) \
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);", [request.body.username, request.body.fname, 
    request.body.lname, request.body.phone, request.body.email, request.body.address, 
    request.body.city, request.body.state, request.body.zipcode], 
     function(err, result){
    if(err){
      response.status(409);
      response.send(err.sqlMessage);
      return;
    }
    else {
      mysql.pool.query('SELECT * FROM User WHERE user_id=?', [result.insertId], function(err, rows, fields){
        if(err){
          response.status(409);
          response.send(err.sqlMessage);
          return;
        }
        else {
          response.send(JSON.stringify(rows[rows.length - 1]));
        }
      });
    }
  });
});

app.delete('/user',function(request,response,next){
  var context = {};
  mysql.pool.query('DELETE FROM User WHERE user_username=?', [request.body.username], function(err, rows, fields){
    if(err){
      response.send(err.sqlMessage);
      return;
    }
    else {
      mysql.pool.query('SELECT * FROM User', function(err, rows, fields){
        if(err){
          response.status(409);
          response.send(err.sqlMessage);
          return;
        }
        else {
         context.exercises = rows;
         response.send(JSON.stringify(rows));
        }
      });
    }
  });
});

app.get('/location',function(request,response,next){
  var context = {};
  mysql.pool.query('SELECT * FROM Location', function(err, rows, fields){
    if(err){
      response.status(409);
      response.send(err.sqlMessage);
      return;
    }
    else {
      context.exercises = rows;
      response.send(JSON.stringify(rows));
    }
  });
});

app.post('/location',function(request,response,next){
  var context = {};
  
  mysql.pool.query("INSERT INTO Location (location_lat, location_lon, location_availability, \
    location_last_availability_update) VALUES (?, ?, ?, NOW());", [request.body.location_lat, request.body.location_lon, 
    request.body.location_availability], 
     function(err, result){
    if(err){
      response.status(409);
      response.send(err.sqlMessage);
      return;
    }
    else {
      mysql.pool.query('SELECT * FROM Location WHERE location_id=?', [result.insertId], function(err, rows, fields){
        if(err){
          response.status(409);
          response.send(err.sqlMessage);
          return;
        }
        else {
          response.send(JSON.stringify(rows[rows.length - 1]));
        }
      });
    }
  });
});

app.delete('/location',function(request,response,next){
  var context = {};
  mysql.pool.query('DELETE FROM Location WHERE location_id=?', [request.body.location_id], function(err, rows, fields){
    if(err){
      response.send(err.sqlMessage);
      return;
    }
    else {
      mysql.pool.query('SELECT * FROM Location', function(err, rows, fields){
        if(err){
          response.status(409);
          response.send(err.sqlMessage);
          return;
        }
        else {
         context.exercises = rows;
         response.send(JSON.stringify(rows));
        }
      });
    }
  });
});

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

