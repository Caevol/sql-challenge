var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://localhost:5432/posts';
var db = pgp(connectionString);

// add query functions

module.exports = {
  getAllPosts: getAllPosts,
  getSinglePost: getSinglePost,
  createPost: createPost,
  updatePost: updatePost,
  removePost: removePost
};

function getAllPosts(req, res, next) {
  db.any('select * from postings')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL posts'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSinglePost(req, res, next) {
  var postID = parseInt(req.params.id);
  db.one('select * from postings where id = $1', postID)
    .then(function (data) {
      res.status(200)
        .json({
            status: 'success',
            data: data,
            message: 'Retrieved ONE post'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function createPost(req, res, next){
  req.body.age = parseInt(req.body.age);
  db.none('insert into postings(postName, postContents)' + 'values(${postName}, ${postContents})', req.body)
    .then(function() {
      res.status(200)
        .json({
          status: 'success',
          message: 'Insterted one post'
        });
    })
    .catch(function(err) {
      return next(err);
    });
    res.redirect('/');
}

function updatePost(req, res, next) {
  db.none('update postings set postName=$1, postContents=$2 where id=$3',
    [req.body.postName, req.body.postContents, parseInt(req.params.id)])
    .then(function() {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated post'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function removePost(req, res, next) {
  var postID = parseInt(req.params.id);
  db.result('delete from postings where id = $1', postID)
    .then(function (results) {
        res.redirect('/');
    })
    .catch(function (err) {
      return next(err);
    })
    res.redirect('/');
}
