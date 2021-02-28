

const jwtUtil = require('../utils/jwtUtils')
module.exports = class student_dao extends require('../model/student_mod'){
    /**
     * 分页获取通知
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    static async getNotice(req,resp){
        let verify = await jwtUtil.verifysync(req.query.token,globalKey)  //token解密
        let u_classes = verify.classes
        let pageNum = req.query.pageNum
        let currPage = req.query.currPage
        let data = await this.getNoticeMod(u_classes,pageNum,currPage)
        let total = await this.getNoticeTotal(u_classes)

        resp.send({data,total:total[0].count})
    }

    /**
     * 获取用户的所有阅读数据
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    static async getNoticeRead(req,res){
        let verify = await jwtUtil.verifysync(req.query.token,globalKey)  //token解密
        let id = verify.id//数据库user表里面的id字段 并非userid字段
        let data = await this.getNoticeReadMod(id)

        res.send(data)
    }

    /**
     * 已读转未读
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    static async goweidu(req,res){
        let verify = await jwtUtil.verifysync(req.query.token,globalKey)
        let id = verify.id
        let results = await this.goweiduMod(id,req.query.n_id)

        res.send(results)
    }

    /**
     * 未读转已读
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    static async goyidu(req,res){
        let verify = await jwtUtil.verifysync(req.query.token,globalKey)
        let id = verify.id
        let results = await this.goyiduMod(id,req.query.n_id)

        res.send(results)
    }

    /**
     * 健康填报表
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    static async sethealth(req,res){
        let body = req.body
        let token = body.token
        let temperature = body.temperature
        let hot = body.hot
        let goHighRisk = body.goHighRisk
        let isHighRisk = body.isHighRisk
        let fever = body.fever
        let leave = body.leave
        let hesuan = body.hesuan
        let mask = body.mask
        let maskRemaining = body.maskRemaining
        let kill = body.kill

        let verify = await jwtUtil.verifysync(token,globalKey)
        let u_id = verify.id
        console.log({u_id,temperature,hot,goHighRisk,isHighRisk,fever,leave,hesuan,mask,maskRemaining,kill})
        let data = await this.sethealthMod(u_id,temperature,hot,goHighRisk,isHighRisk,fever,leave,hesuan,mask,maskRemaining,kill)
        res.send(data)
    }

    /**
     * 分页获取当天填报表与总数量
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    static async gethealthNowDayPage(req,res){
        let date = new Date()
        let Month = ""
        if((date.getMonth() + 1 < 10)) {
            Month = "0" + String((date.getMonth() + 1))
        }else{
            Month = (date.getMonth() + 1)
        }
        let nowDate = "" + date.getFullYear() + Month + date.getDate()
        let lastDate = "" + date.getFullYear() + Month + (date.getDate() + 1)

        let currPage = req.query.currPage
        let pageNum = req.query.pageNum
        let data = await this.gethealthNowDayPageMod(nowDate,lastDate,currPage,pageNum)
        let total = await this.gethealthNowDayPageTotal(nowDate,lastDate)

        res.send({data,total:total[0].count})
    }

    /**
     * 获取当天某用户报表
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    static async getHealthNowDayByid(req,res){
        let verify = await jwtUtil.verifysync(req.query.token,globalKey)
        let u_id = verify.id

        let nowDate = this.getNowAndLastDate().nowDate
        let lastDate = this.getNowAndLastDate().lastDate

        let data = await this.getHealthNowDayByidMod(u_id,nowDate,lastDate)
        res.send(data)
    }

    /**
     * 获取当天所有报表
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    static async getHealthNowDay(req,res){
        let nowDate = this.getNowAndLastDate().nowDate
        let lastDate = this.getNowAndLastDate().lastDate
        console.log(nowDate + "  " + lastDate)
        let data = await this.getHealthNowDayMod(nowDate,lastDate)

        res.send(data)
    }

    /**
     * 获取本月所有报表
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    static async getHealthNowMonth(req,res){
        let nowDate = this.getNowAndLastDate().nowMonth
        let lastDate = this.getNowAndLastDate().lastMonth
        console.log(nowDate + "  " + lastDate)
        let data = await this.getHealthNowMonthMod(nowDate,lastDate)

        res.send(data)
    }

    static async getAllHealth(req,res){
        let data = await this.getAllHealthMod()

        res.send(data)
    }

    /**
     * 请假
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    static async setLeave(req,res){
        let token = req.body.token
        let verify = await jwtUtil.verifysync(token,globalKey)
        let u_id = verify.id
        let classes = verify.classes
        let reason = req.body.reason
        let leavetype = req.body.leavetype
        let starttime = req.body.starttime
        let endtime = req.body.endtime

        let results = await this.setLeaveMod(u_id,classes,reason,leavetype,starttime,endtime)

        res.send(results)
    }

    /**
     * 获取某用户所有请假信息
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    static async getuserLeave(req,res){
        let verify = await jwtUtil.verifysync(req.query.token,globalKey)
            let u_id = verify.id
        let currPage = req.query.currPage
        let pageNum = req.query.pageNum

        let data = await  this.getuserLeaveMod(u_id,currPage,pageNum)
        let total = await  this.getuserLeaveTotal(u_id)

        res.send({data,total:total[0].count})
    }
}
