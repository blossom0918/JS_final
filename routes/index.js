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
  docRef.get().then(function(querySnapshot){
    querySnapshot.forEach(function(doc){
      console.log(doc.data());
      productList.push(doc.data());
    });
    res.render('index', { title: 'Express', data: productList});
  });
});

module.exports = router;
