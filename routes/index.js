var express = require('express');
var router = express.Router();

/* GET home page. */
//router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Express' });
//});




var db = require('../queries');

router.get('/api/posts', db.getAllPosts);
router.get('/api/posts/:id', db.getSinglePost);
router.post('/api/posts', db.createPost);
router.put('/api/posts/:id', db.updatePost);
router.delete('/api/posts/:id', db.removePost);

module.exports = router;
