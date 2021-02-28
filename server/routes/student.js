var express = require('express');
var router = express.Router();

const student = require('../dao/student_dao')

router.get('/',function (req,res) {
    res.send("进入student路由")
})

router.get('/getNotice',function (req,res) {
    student.getNotice(req,res)
})

router.get('/getNoticeRead',function (req,res) {
    student.getNoticeRead(req,res)
})

router.get('/goweidu',function (req,res) {
    student.goweidu(req,res)
})

router.get('/goyidu',function (req,res) {
    student.goyidu(req,res)
})


/************************填报表部分 **********************************/

router.post('/sethealth',function (req,res) {
    student.sethealth(req,res)
})
/**
 * 分页获取当天填报表与总数量
 */
router.get('/gethealthNowDayPage',function (req,res) {
    student.gethealthNowDayPage(req,res)
})
/**
 * 获取当天某用户报表
 */
router.get('/getHealthNowDayByid',function (req,res) {
    student.getHealthNowDayByid(req,res)
})
/**
 * 获取当天所有报表
 */
router.get('/getHealthNowDay',function (req,res) {
    student.getHealthNowDay(req,res)
})
/**
 * 获取当月所有报表
 */
router.get('/getHealthNowMonth',function (req,res) {
    student.getHealthNowMonth(req,res)
})
/**
 * 获取所有报表
 */
router.get('/getAllHealth',function (req,res) {
    student.getAllHealth(req,res)
})
/**
 * 填报请假表
 */
router.post('/setLeave',function (req,res) {
    student.setLeave(req,res)
})

router.get('/getuserLeave',function (req,res) {
    student.getuserLeave(req,res)
})
module.exports = router
