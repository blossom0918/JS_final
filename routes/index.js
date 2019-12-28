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

router.get('/result', function(req, res, next) {
  var docRef = db.collection("product");
  var productList = [];
  var productId = [];
  if(req.query.type!=undefined){
    if(req.query.order!=undefined && req.query.d!=undefined){
      docRef.where("type","==",req.query.type).orderBy(req.query.order,req.query.d).get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          productList.push(doc.data());
          productId.push(doc.id);
        });
        res.render('index', { title: '首頁', data: productList, id: productId });
      })
    }else{
      docRef.where("type","==",req.query.type).get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          productList.push(doc.data());
          productId.push(doc.id);
        });
        res.render('index', { title: '首頁', data: productList, id: productId });
      })
    }
  }else if(req.query.order!=undefined && req.query.d!=undefined){
    docRef.orderBy(req.query.order,req.query.d).get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        productList.push(doc.data());
        productId.push(doc.id);
      });
      res.render('index', { title: '首頁', data: productList, id: productId });
    })
  }
});

router.post('/result', function(req, res, next) {
  var docRef = db.collection("product");
  var productList = [];
  var productId = [];
  docRef.where("name","==",req.body.keyword).get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      productList.push(doc.data());
      productId.push(doc.id);
    });
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
  var memberRef = db.collection('member');
  res.render('login', {
    title: '登入',
    memberId: req.session.memberId
  });
});

router.post('/login', function(req, res, next) {
  var memberRef = db.collection("member");
  if(req.body.id != "" && req.body.password != ""){
    memberRef.where('id', '==', req.body.id).get().then(function (querySnapshot) { 
      querySnapshot.forEach(function (doc) {
        if(doc.data().password == req.body.password){
          req.session.memberId = doc.id;
          res.redirect('/')
        }else{
          console.log("密碼輸入錯誤，兩秒後重新載入登入畫面");
          setTimeout(function () {res.redirect("/login")}, 2000);
        }
      });
    });             
  }else{
    console.log("還有欄位尚未填寫喔！");
  } 
});

/* GET signup page. */
router.get('/signup', function(req, res, next) {
  res.render('signup', { title: '註冊'});
});

router.post('/signup', function(req, res, next) {
  var memberRef = db.collection("member");
  var emailRegxp = /[\w-]+@([\w-]+\.)+[\w-]+/;
  let flag = 0;

  if(req.body.name != "" && req.body.id != "" && req.body.email != "" && req.body.password != ""){
    memberRef.get().then(function (querySnapshot) { 
      querySnapshot.forEach(function (doc) {
        if(doc.data().id == req.body.id){
          console.log("此帳號已被註冊");
          setTimeout(function () {res.redirect("/signup")}, 2000);
          flag = 1;
        }else if(doc.data().email == req.body.email){
          console.log("此信箱已被註冊");
          setTimeout(function () {res.redirect("/signup")}, 2000);
          flag = 1;
        }else if(emailRegxp.test(req.body.email) != true){
          console.log("請輸入正確信箱格式");
          setTimeout(function () {res.redirect("/signup")}, 2000);
          flag = 1;
        }

        if(flag == 0){
          memberRef.add({
            "name": req.body.name,
            "id": req.body.id,
            "email": req.body.email,
            "password": req.body.password
          }).then(function(){ 
            console.log("註冊成功！兩秒後跳轉登入畫面");
            setTimeout(function () {res.redirect("/login")}, 2000);
          }).catch(function (error) {
            console.error("註冊失敗原因： ", error);
          });
        }
      });
    });             
  }else{
    console.log("還有欄位尚未填寫喔！");
  } 
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
