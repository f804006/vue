var express = require('express');
var router = express.Router();
const admin = require('../dao/admin_dao')


router.get('/', function(req, res, next) {
    res.send('admin进入路由目录');
});


router.get('/getUsersByTypeAndChar', function(req, res, next) {
    admin.getUsersByTypeAndChar(req,res)
});

router.post('/announce',function (req, res, next) {
   admin.announce(req,res)
})

router.get('/getAllNotice',function (req,res) {
    admin.getAllNotice(req,res)
})

router.get('/getHighRiskManInfo',function (req,res) {
    admin.getHighRiskManInfo(req,res)
})

router.post('/delNotice',function (req,res) {
    admin.delNotice(req,res)
})

router.get('/NoticeDetails',function (req,res) {
    admin.NoticeDetails(req,res)
})
/**
 * 获得所有用户信息
 */
router.get('/getPageUser',function (req,res) {
    admin.getPageUser(req,res)
})
/**
 * 获取班级信息
 */
router.get('/getClasses',function (req,res) {
    admin.getClasses(req,res)
})

/**
 * getHMasterInfoAndClassPopulation
 */
router.get('/getHMIAndCP',function (req,res) {
    admin.getHMIAndCP(req,res)
})
/**
 * 添加班级信息
 */
router.post('/addClasses',function (req,res) {
    admin.addClasses(req,res)
})

/**
 * 模糊查询班级
 */
router.get('/getClassesSear',function (req,res) {
    admin.getClassesSear(req,res)
})

router.get('/getLeave',function (req,res) {
    admin.getLeave(req,res)
})

router.post('/upLeaveState',function (req,res) {
    admin.upLeaveState(req,res)
})

/**
 * 更新班级管理人员
 * @type {Router}
 */
router.post('/upClassManage',function (req,res) {
    admin.upClassManage(req,res)
})
module.exports = router;
