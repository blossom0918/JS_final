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
  var docRef = db.collection("product");
  var productList = [];
  var productId = [];
  docRef.get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      productList.push(doc.data());
      productId.push(doc.id);
    });
    console.log(productList);
    res.render('index', { title: '首頁', data: productList, id: productId });
  })
});

/* GET detail page. */
router.get('/detail', function(req, res, next) {
  var docRef = db.collection("product").doc(req.query.id);
  var productData;
  docRef.get().then(function (doc) {
    productData = doc.data();
    console.log(productData);
    res.render('detail', { title: '商品明細', data: productData});
  })
});

/* GET favorite page. */
router.get('/favorite', function(req, res, next) {
  res.render('favorite', { title: '我的最愛'});
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: '登入'});
});

/* GET signup page. */
router.get('/signup', function(req, res, next) {
  res.render('signup', { title: '註冊'});
});

/* GET manage page. */
router.get('/manage', function(req, res, next) {
  res.render('manage', { title: '新增商品'});
});

/* GET manage page. */
router.post('/manage', function(req, res, next) {
  var addData = {
    "name": req.body.name,
    "price": parseInt(req.body.price),
    "type": req.body.type,
    "image": req.body.image,
    "image2": req.body.image2
  };
  console.log(addData);
  db.collection("product").add(addData)
  .then(function (docRef) {
    res.redirect("/");
  })
  .catch(function (error) {
    console.error("新增失敗原因： ", error);
  });
});

module.exports = router;
