var express = require('express');
var router = express.Router();


const user = require('../dao/users_dao')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('users进入路由目录');
});

router.post('/login',function (req,res) {
  user.Login(req,res)
})

router.get('/getUserDataByToken',function (req,res) {
  user.getUserDataByToken(req,res)
})

router.get('/getUserDataByTypePage',function (req,res) {
  user.getUserDataByTypePage(req,res)
})

router.get('/getUserInfoById',function (req,res) {
  user.getUserInfoById(req,res)
})

router.get('/delUserdata',function (req,res) {
  if(req.query.u_id == 0) res.send("您不能删除管理员")
  else user.delUserdata(req,res)
})

router.post('/upUserdata',function (req,res) {
  user.upUserdata(req,res)
})

router.post('/setXlsxData',function (req,res) {
  user.setXlsxData()
})
/******修改密码*****************/
router.post('/upPwd',function (req,res) {
  user.upPwd(req,res)
})

/******修改头像************/
router.post('/upicon',function (req,res) {
    user.upicon(req,res)
})
module.exports = router;
