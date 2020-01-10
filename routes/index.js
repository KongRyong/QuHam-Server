const express = require('express');
const router = express.Router();
const path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  // 메인 이미지 보냄 
  res.sendfile(path.resolve('public/images/qu.jpeg'));
});

module.exports = router;
