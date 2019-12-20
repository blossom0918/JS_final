var express = require('express');
var router = express.Router();

const admin = require('firebase-admin');
let serviceAccount = require('../js-final-381dd-firebase-adminsdk-19shb-b3d93b1fb4.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express'});
});

/* GET detail page. */
router.get('/detail', function(req, res, next) {
  res.render('detail', { title: 'Detail'});
});

/* GET favorite page. */
router.get('/favorite', function(req, res, next) {
  res.render('favorite', { title: 'Favorite'});
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login'});
});

/* GET signup page. */
router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Signup'});
});

module.exports = router;
