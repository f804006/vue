

const jwtUtil = require('../utils/jwtUtils')
module.exports = class admin_dao extends require('../model/admin_mod') {
    /**
     * 根据用户类型与查询字段模糊查询 (数据与总数量返回)
     * @param req
     * @param resp
     * @returns {Promise<void>}
     */
    static async getUsersByTypeAndChar(req, resp) {
        let query = req.query
        let type = query.type
        let inputText = query.inputText
        let CharType = query.CharType
        let pageNum = query.pageNum
        let currPage = query.currPage

        let data = await this.getUsersByTypeAndCharMod(type, inputText, CharType, pageNum, currPage)
        let total = await this.getUsersByTypeAndCharTotal(type, inputText, CharType);
        resp.send({data, total: total[0].count})
    }

    /**
     * 获得所有用户信息
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    static async getPageUser(req, res) {
        let pageNum = req.query.pageNum
        let currPage = req.query.currPage
        let data = await this.getPageUserMod(pageNum, currPage)
        let total = await this.getAllUserTotal();
        res.send({data, total: total[0].count})
    }

    /**
     * 获得当日健康表中高风险的人
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    static async getHighRiskManInfo(req, res) {
        let startTime = await this.getNowAndLastDate().nowDate
        let endTime = await this.getNowAndLastDate().lastDate

        let pageNum = req.query.pageNum
        let currPage = req.query.currPage

        let data = await this.getHighRiskManInfoMod(currPage, pageNum, startTime, endTime)
        let total = await this.getHighRiskManInfoTotal(startTime, endTime)

        for (var i = 0; i < data.length; i++) {
            let userinfo = await this.getUserInfoById(data[i].u_id)

            data[i] = Object.assign(data[i], userinfo[0])
        }
        res.send({data, total: total[0].count})
    }

    /**
     * 发布公告
     * @param req
     * @param resp
     * @returns {Promise<void>}
     */
    static async announce(req, resp) {
        let title = req.body.title
        let classes = req.body.classes
        let results = await this.announceMod(title, classes)
        resp.send(results)
    }

    /**
     * 公告详情
     * @returns {Promise<void>}
     * @constructor
     */
    static async NoticeDetails(req, res) {
        let n_id = req.query.n_id
        let users = []

        //1.获得该公告已读的人数
        let readNum = await this.getReadNum(n_id)
        readNum = readNum[0].count

        // //2.获取公告已读人员的id，并通过id查询用户的信息
        let readIdArr = await this.getReadUserId(n_id)

        if (readIdArr.length != 0) {
            users = await this.getReadUserInfoById(readIdArr)
        }


        //3.获取当前通知的详细信息
        let data = await this.NoticeDetailsMod(n_id)

        //4.获得收到该通知的总人数
        let total = await this.NoticeDetailsTotal(data[0].class)
        total = total[0].count


        //5.获取已读人的阅读时间与u_id
        let idAndTime = await this.getReadTime(n_id)

        //将阅读时间附加到users中
        for (var i = 0; i < idAndTime.length; i++) {
            for (var j = 0; j < users.length; j++) {
                if (users[i].id == idAndTime[j].u_id) {
                    users[i].readtime = idAndTime[j].readtime
                }
            }
        }


        res.send({
            data,
            readNum,
            total,
            users
        })
    }

    static async getAllNotice(req, resp) {
        let pageNum = req.query.pageNum
        let currPage = req.query.currPage
        let data = await this.getAllNoticeMod(pageNum, currPage);
        let total = await this.getNoticeTotal()
        resp.send({data, total: total[0].count})
    }

    /**
     * 删除指定通知
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    static async delNotice(req, res) {

        let results = this.delNoticeMod(req.body.n_id)
        res.send(results)
    }

    /**
     * 获取现有的班级
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    static async getClasses(req, res) {
        let sql = "select * from class_"
        this.query(sql).then(results => {


            for (var i = 0; i < results.length; i++) {
                let sql2 = "select * from user where id=" + results[i].head
            }

            res.send(results)
        }).catch(err => {
            res.send("获取失败")
        })
    }

    /**
     * 获得班主任信息与班级人数
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    static async getHMIAndCP(req, res){
        let HMI_id = Number(req.query.id)
        let classname = req.query.classname

        let HMI = await this.getHMI(HMI_id)
        let CP = await this.getCP(classname)

        res.send({HMI:HMI[0],CP:CP[0].count})
    }



    /**
     * 添加班级
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    static async addClasses(req,res){
        let results = await this.addClassesMod(req.body.classname)
        res.send(results)
    }

    /**
     * 模糊查询班级
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    static async getClassesSear(req,res){
        let keywords = req.query.inputText
        let pageNum = req.query.pageNum
        let currPage = req.query.currPage

        let data = await this.getClassesSearMod(keywords,pageNum,currPage)

        let total = await this.getClassesSearTotal(keywords)


        res.send({data,total:total[0].count})
    }

    /**
     * 获得老师所在班级请假信息
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    static async getLeave(req,res){
        let verify = await jwtUtil.verifysync(req.query.token,globalKey)

        let classArr =  verify.classes.split(';')//一个老师带多个班
        let data = await this.getLeaveMod(classArr,req.query.currPage,req.query.pageNum)

        let total = await this.getLeaveTotal(classArr)

        res.send({data,total:total[0].count})
    }

    /**
     * 审批请假条
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    static async upLeaveState(req,res){
        let results = await this.upLeaveStateMod(req.body.l_id,req.body.upState)

        res.send(results)
    }

    static async upClassManage(req,res){
        let result1 = await this.upUserManage(req.body.u_id,req.body.newDuties)
        let result2 = await this.upClassManageMod(req.body.classname)

        res.send(result1 + "," +result2)
    }
}
