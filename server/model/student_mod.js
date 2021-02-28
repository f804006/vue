


module.exports = class student_mod extends require('./model.js'){

    static getNoticeMod(u_classes,pageNum,currPage){
        pageNum = Number(pageNum)
        currPage = Number(currPage)
        currPage = Number(currPage * pageNum)

        return new Promise((resolve, reject) => {
            let sql = "select * from notice where class like '%" +  u_classes + "%' order by createtime desc limit ?,?"
            console.log(sql)
            this.query(sql,this.formatParams(currPage,pageNum)).then(results => {
                resolve(results)
            }).catch(err => {
                reject(err)
            })
        })
    }

    static getNoticeTotal(u_classes){
        return new Promise((resolve, reject) => {
            let sql = "select count(1) as count from notice where class like '%" + u_classes + "%'"
            this.query(sql).then(results => {
                resolve(results)
            }).catch(err => {
                reject(err)
            })
        })
    }

    static getNoticeReadMod(id){
        return new Promise((resolve, reject) => {
            let sql = "select * from read_ where u_id='" + id + "'"
            console.log(sql)
            this.query(sql).then(results => {
                resolve(results)
            }).catch(err => {
                reject(err)
            })
        })
    }

    static goweiduMod(u_id,n_id){
        return new Promise((resolve, reject) => {
            let sql = "delete from read_ where u_id=" + u_id + " and n_id=" + n_id
            console.log(sql)
            this.query(sql).then(results => {
                resolve(results)
            }).catch(err => {
                console.log("转换失败")
                reject(err)
            })
        })
    }

    static goyiduMod(u_id,n_id){
        return new Promise((resolve, reject) => {
            let sql = "insert into read_ (u_id,n_id) values (" + u_id + "," + n_id + ")"
            console.log(sql)
            this.query(sql).then(results => {
                resolve(results)
            }).catch(err => {
                console.log("转换失败")
                reject(err)
            })
        })
    }

    static sethealthMod(u_id,temperature,hot,goHighRisk,isHighRisk,fever,leave,hesuan,mask,maskRemaining,kill){
        return new Promise((resolve, reject) => {
            let sql = "insert into health (u_id,temperature,hot,goHighRisk,isHighRisk,fever,leaveout,hesuan,mask,maskRemaining,kills) value (?,?,?,?,?,?,?,?,?,?,?)"
            console.log(sql)
            this.query(sql,this.formatParams(u_id,temperature,hot,goHighRisk,isHighRisk,fever,leave,hesuan,mask,maskRemaining,kill)).then(res => {
                resolve("健康填报表提交成功")
            }).catch(err => {
                reject("健康填报表提交失败")
            })
        })
    }

    static gethealthNowDayPageMod(nowDate,lastDate,currPage,pageNum){
        currPage = Number(currPage)
        pageNum = Number(pageNum)
        currPage = Number(currPage * pageNum)
        return new Promise((resolve, reject) => {
            let sql = "select * from health where createtime between ? and ? LIMIT ?,?"
            this.query(sql,this.formatParams(nowDate,lastDate,currPage,pageNum)).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    }

    static gethealthNowDayPageTotal(nowDate,lastDate){
        return new Promise((resolve, reject) => {
            let sql = "select count(*) as count from health where createtime between ? and ?"
            this.query(sql,this.formatParams(nowDate,lastDate)).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    }

    static getHealthNowDayByidMod(u_id,nowDate,lastDate){
        return new Promise((resolve, reject) => {
            let sql = "select * from health where (createtime between ? and ?) and u_id=?"
            this.query(sql,this.formatParams(nowDate,lastDate,u_id)).then(res => {
                resolve(res)
            }).catch(err => {
                reject("查询失败")
            })
        })
    }

    static getHealthNowDayMod(nowDate,lastDate){
        return new Promise((resolve, reject) => {
            let sql = "select * from health where createtime between ? and ?"
            this.query(sql,this.formatParams(nowDate,lastDate)).then(res => {
                console.log(res)
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    }

    static getHealthNowMonthMod(nowDate,lastDate){
        return new Promise((resolve, reject) => {
            let sql = "select * from health where createtime between ? and ?"
            this.query(sql,this.formatParams(nowDate,lastDate)).then(res => {

                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    }

    static getAllHealthMod(){
        return new Promise((resolve, reject) => {
            let sql = "select * from health"
            this.query(sql).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    }

    static setLeaveMod(u_id,classes,reason,leavetype,starttime,endtime){
        return new Promise((resolve, reject) => {
            let sql = "insert into leave_ (u_id,class,reason,leavetype,starttime,endtime,state) value (?,?,?,?,?,?,0)"
            this.query(sql,this.formatParams(u_id,classes,reason,leavetype,starttime,endtime)).then(res => {
                resolve("插入成功")
            }).catch(err => {
                reject("插入失败")
            })
        })
    }

    static getuserLeaveMod(u_id,currPage,pageNum){
        pageNum = Number(pageNum)
        currPage = Number(currPage)
        currPage = Number(currPage * pageNum)
        return new Promise((resolve, reject) => {
            let sql = "select * from leave_ order by createtime desc LIMIT ?,?"
            this.query(sql,this.formatParams(currPage,pageNum)).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    }

    static getuserLeaveTotal(u_id){
        return new Promise( (resolve, reject) => {
            let sql = "select count(*) from leave_ where u_id=" + u_id
            console.log(sql)
            this.query(sql).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    }


}
