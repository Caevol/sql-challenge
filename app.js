
var express = require('express');
var router = express.Router();

var db = require('./queries');

router.get('/api/posts', db.getAllPosts);
router.get('/api/posts/:id', db.getSinglePost);
router.post('/api/posts', db.createPost);
router.put('/api/posts/:id', db.updatePost);
router.delete('/api/posts/:id', db.removePost);

module.exports = router;

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
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function(req, res, next){
  db.any('SELECT * FROM postings')
    .then(function(db){
      return res.render('index', {db: db})
    })
    .catch(function(err){
      return next(err);
    });
});


module.exports = app;
