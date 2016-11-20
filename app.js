
var express = require('express');
var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://localhost:5432/posts';
var db = pgp(connectionString);
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./queries');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){
  if(req.query._method == 'DELETE') {
    req.method = 'DELETE';
    req.url = req.path;
  }
  next();

});


app.get('/', function(req, res, next){
  db.any('SELECT * FROM postings')
    .then(function(db){

      return res.render('index', {db:db});
    })
    .catch(function(err){
      return next(err);
    });
});


app.get('/posts/:id/edit', function(req,res,next){

  var id = parseInt(req.params.id);
  db.one('select * from postings where id = $1', id)
    .then(function (post) {
      res.render('edit', {post : post})
    });

});

app.get('/posts/:id', function(req, res, next){
  var id = parseInt(req.params.id);
  db.one('select * from postings where id = $1', id)
    .then(function (post) {
      res.render('view', {post:post})
    });
});


app.get('/newpost', function(req,res,next){
  res.render('newPost');
});


app.post('/newpost', function(req,res,next){
  users.createPost(req,res,next);
  res.redirect('/');
});


app.post('/posts/:id/edit', function(req,res,next){

  users.updatePost(req, res, next);
  res.redirect('/');
});

app.post('/posts/:id', function(req, res, next){
  users.removePost(req, res, next);
  res.redirect('/');
});



module.exports = app;
