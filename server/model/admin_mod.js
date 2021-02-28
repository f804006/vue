

module.exports = class admin_mod extends require('./model.js'){
    /**
     *根据用户类型与查询字段模糊查询 (数据与总数量返回)
     * @param type      用户类型
     * @param inputText 关键字
     * @param CharType 查询的字段(籍贯: address 用户名: username 学号: id 班级: classes )
     * @param pageNum
     * @param currPage
     */
    static getUsersByTypeAndCharMod(type,inputText,CharType,pageNum,currPage){
        pageNum = Number(pageNum)
        currPage = Number(currPage)
        currPage = Number(currPage * pageNum)
        return new Promise((resolve,reject)=>{
            let sql = 'select * from user where ' + CharType + ' like "%' + inputText + '%" and type=' + type + ' order by modifytime desc LIMIT ?,?'
            //根据最后修改时间排序
            console.log(sql)

            this.query(sql,this.formatParams(currPage,pageNum)).then(result=>{
                // console.log(result)
                resolve(result) //返回
            }).catch(err=>{
                reject(err)
            })
        })
    }
    static getUsersByTypeAndCharTotal(type,inputText,CharType){
        return new Promise((resolve, reject) => {
            let sql = "select count(1) as count from user where type=" + type + ' and '+ CharType + ' like "%' + inputText + '%" '
            console.log(sql)
            this.query(sql).then(result=>{

                resolve(result)
            }).catch(err=>{
                reject(err)
            })
        })
    }

    static getHighRiskManInfoMod(currPage,pageNum,startTime,endTime){
        currPage = Number(currPage)
        pageNum = Number(pageNum)
        currPage = Number(currPage * pageNum)
        return new Promise((resolve, reject) => {
            let sql = "select * from health where (createtime between ? and ?) and temperature>38  order by createtime desc limit ?,?"
            console.log(sql)
            this.query(sql,this.formatParams(startTime,endTime,currPage,pageNum)).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    }

    static getUserInfoById(u_id){
        return new Promise((resolve, reject) => {
            let sql = "select * from user where id=" + u_id
            this.query(sql).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    }

    static getHighRiskManInfoTotal(startTime,endTime){
        return new Promise((resolve, reject) => {
            let sql = "select count(*) as count from health where (createtime between ? and ?) and temperature>38"
            this.query(sql,this.formatParams(startTime,endTime)).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    }

    static getPageUserMod(pageNum,currPage){
        pageNum = Number(pageNum)
        currPage = Number(currPage)
        currPage = Number(currPage * pageNum)
        return new Promise((resolve, reject) => {
            let sql = "select * from user order by modifytime LIMIT ?,?"
            this.query(sql,this.formatParams(currPage,pageNum)).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    }

    static getAllUserTotal(){
        return new Promise((resolve, reject) => {
            let sql = "select count(*) as count from user"
            this.query(sql).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    }

    static announceMod(title, classes){
        return new Promise((resolve, reject) => {
            let sql = "insert into notice (title,class) value (?,?)"
            this.query(sql,this.formatParams(title,classes)).then(results => {
                resolve("发布成功")
            }).catch(err => {
                console.log("发布公告出错：${ err.message }")
                reject("您的公告发送失败")
            })
        })
    }

    static getAllNoticeMod(pageNum,currPage){
        pageNum = Number(pageNum)
        currPage = Number(currPage)
        currPage = Number(currPage * pageNum)
        return new Promise((resolve, reject) => {
            let sql = "select * from notice order by createtime desc LIMIT ?,?"
            this.query(sql,this.formatParams(currPage,pageNum)).then(results => {
                resolve(results)
            }).catch(err => {
                reject(err)
            })
        })
    }

    static getNoticeTotal(){
        return new Promise((resolve, reject) => {
            let sql = "select count(1) as count from notice"
            this.query(sql).then(results => {
                resolve(results)
            }).catch(err => {
                reject("由于网络原因，获取通知个数失败")
            })
        })
    }

    static delNoticeMod(n_id){
        return new Promise((resolve, reject) => {
            let sql = "delete from notice where n_id=" + n_id
            console.log(sql)
            this.query(sql).then(res => {
                resolve("删除成功")
            }).catch(err => {
                reject("删除失败")
            })
        })
    }

    /**** 公告详情 **/
    /**
     * 获取该公告阅读人数
     * @param n_id
     * @returns {Promise<unknown>}
     */
    static getReadNum(n_id){
        n_id = Number(n_id)
        return new Promise((resolve, reject) => {
            let sql = "select count(*) as count from read_ where n_id=" + n_id
            this.query(sql).then(res => {
                resolve(res)
            }).catch(err => {
                resolve(err)
            })
        })
    }

    /**
     * 获取读了这条公告人员的ID
     * @param n_id
     * @returns {Promise<unknown>}
     */
    static getReadUserId(n_id){
        n_id = Number(n_id)
        return new Promise((resolve, reject) => {
            let sql = "select u_id from read_ where n_id=" + n_id
            this.query(sql).then(res => {
                resolve(res)
            }).catch(err => {
                resolve(err)
            })
        })
    }

    /**
     *
     * @param readIdArr
     */
    static getReadUserInfoById(readIdArr){
        let sql = ""
        for(let i = 0;i < readIdArr.length;i ++){
            if(i == 0)
                sql += "select id,username,head,classes,createtime from user where id=" + readIdArr[i].u_id
            else
                sql += ' or id=' + readIdArr[i].u_id
        }
        console.log(sql)
        return new Promise((resolve, reject) => {
            this.query(sql).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    }

    /**
     * 获得当前通知详细信息
     * @param n_id
     * @constructor
     */
    static NoticeDetailsMod(n_id){
        n_id = Number(n_id)
        return new Promise((resolve, reject) => {
            let sql = "select * from notice where n_id=" +n_id
            this.query(sql).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    }

    /**
     * 收到该通知的人数
     * @param classes
     * @returns {Promise<unknown>}
     * @constructor
     */
    static NoticeDetailsTotal(classes){
        classes = classes.split(';')
        let sql = ""
        for(let i = 0;i < classes.length;i ++){
            if(i == 0)
                sql += "select count(*) as count from user where classes='" + classes[i]
            else
                sql += "' or classes='" + classes[i]
        }
        sql += "'"
        console.log(sql)
        return new Promise((resolve, reject) => {
            this.query(sql).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    }

    static getReadTime(n_id){
        n_id = Number(n_id)
        return new Promise((resolve, reject) => {
            let sql = "select u_id,readtime from read_ where n_id="+n_id
            this.query(sql).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    }




    static addClassesMod(classname){
        return new Promise((resolve, reject) => {
            let sql = "insert into class_ (classname) value (?)"
            this.query(sql,this.formatParams(classname)).then(res => {
                resolve("添加成功")
            }).catch(err => {
                reject("添加失败")
            })
        })
    }

    static getClassesSearMod(keywords,pageNum,currPage){
        pageNum = Number(pageNum)
        currPage = Number(currPage)
        currPage = Number(pageNum*currPage)

        return new Promise((resolve, reject) => {
            let sql = "select * from class_ where classname like '%" + keywords + "%' order by createtime desc limit " + currPage + "," + pageNum
            console.log(sql)
            this.query(sql).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    }

    static getClassesSearTotal(keywords){
        return new Promise((resolve, reject) => {
            let sql = "select count(*) as count from class_ where classname like '%" + keywords + "%'"
            console.log(sql)
            this.query(sql).then(res => {
                console.log(res)
                resolve(res)
            }).catch(err => {
                reject("查询数量失败")
            })
        })
    }

    static getHMI(HMI_id){
        return new Promise((resolve, reject) => {
            let sql = "select * from user where id="+HMI_id
            this.query(sql).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    }

    static getCP(classname){
        return new Promise((resolve, reject) => {
            let sql = "select count(*) as count from user where classes='" + classname + "'"
            console.log(sql)
            this.query(sql).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })

        })
    }


    static getLeaveMod(classArr,currPage,pageNum){
        currPage = Number(currPage)
        pageNum = Number(pageNum)
        currPage = Number(currPage * pageNum)

        return new Promise((resolve, reject) => {
            let sql = "select * from leave_ where class="
            for(var i = 0;i < classArr.length; i++){
                if(i == 0) sql += "'" + classArr[i] + "' "
                else sql += " or class='" + classArr[i] + "' "
            }
            sql += " order by createtime desc limit " + currPage + ","+pageNum

            console.log(sql)
            this.query(sql).then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    }

    static getLeaveTotal(classArr){
        return new Promise((resolve, reject) => {
            let sql = "select count(*) as count from leave_ where class="
            for(var i = 0;i < classArr.length; i++){
                if(i == 0) sql += "'" + classArr[i] + "' "
                else sql += " or class='" + classArr[i] + "' "
            }


            console.log(sql)
            this.query(sql).then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    }

    static upLeaveStateMod(l_id,upState){
        return new Promise((resolve, reject) => {
            let sql = "update leave_ set state=" + upState + " where l_id=" + l_id
            console.log(sql)
            this.query(sql).then(res => {
                resolve("审批状态更新成功")
            }).catch(err => {
                reject("更新失败")
            })
        })
    }

    static upUserManage(u_id,newDuties){
        return new Promise((resolve, reject) => {
            let sql = "update user set classes='" + newDuties + "' where id="+u_id
            console.log(sql)
            this.query(sql).then(res => {
                resolve("User表更新成功！")
            }).catch(err =>{
                reject("User表更新失败！")
            })
        })
    }

    static upClassManageMod(classname){
        return new Promise((resolve, reject) => {
            let sql = "update class_ set headmasterId=0 where classname='" + classname + "'"
            console.log(sql)
            this.query(sql).then(res => {
                resolve("class_表更新成功！")
            }).catch(err => {
                reject("class_表更新失败")
            })
        })
    }
}

