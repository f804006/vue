const tools = require("../utils/tools")

module.exports = class user_mod extends require('./model.js'){
    /**
     * 登陆查询类
     * @param username
     * @param password
     * @param type
     * @returns {Promise<unknown>}
     */
    static LoginUser(username,password,type){
        type = Number(type)
        return new Promise((resolve,reject)=>{
            let sql = "select * from user where username=\"" + username + "\" and password=\"" + password + "\" and type=" + type
            console.log(sql)
            this.query(sql).then(result=>{
                resolve(result)
            }).catch(err=>{
                reject('登陆失败')
            })
        })
    }

    // static LoginUserById(id,passwword,type){
    //     type = Number(type)
    //     return new Promise((resolve,reject)=>{
    //         let sql = "select * from user where id=" + id + "\" and password=\"" + password + "\" and type=" + type
    //         console.log(sql)
    //         this.query(sql).then(result=>{
    //             resolve(result)
    //         }).catch(err=>{
    //             reject('登陆失败')
    //         })
    //     })
    // }


    /**
     * 获取所有用户信息
     * @returns {Promise<unknown>}
     */
    static getAllUserX(){
        return new Promise((resolve, reject) => {
            let sql = "select * from user"
            this.query(sql).then(result=>{
                resolve(result)
            }).catch(err =>{
                reject(err)
            })
        })
    }

    /**
     * 插入redis中不重复的信息插入
     * @param innerXlsxArr
     */
    static innerXlsxData(innerXlsxArr){
        console.log("进入innerXlsxData")
        return new Promise((resolve, reject) => {
            for(var i = 0;i < innerXlsxArr.length;i ++){
                let sql = "insert into user (userid,username,password,head,address,sex,classes,type) values('"
                    + innerXlsxArr[i].userid + "','" + innerXlsxArr[i].username + "','" + innerXlsxArr[i].password
                +"','"+ innerXlsxArr[i].head + "','" + innerXlsxArr[i].address + "','" + innerXlsxArr[i].sex + "','" + innerXlsxArr[i].classes
                +"',"+ innerXlsxArr[i].type + ")"

                console.log(sql)
                this.query(sql).then(result => {
                    resolve(result)
                }).catch(err => {
                    reject(err)
                })
            }
        })
    }
    /**
     * 根据用户类型进行用户信息获取（分页获取总数量和数据）
     * @param type
     * @param pageNum  每页几条数据
     * @param currPage 当前页面
     */
    static getUserDataByTypePageMod(type,pageNum,currPage){
        pageNum = Number(pageNum)
        currPage = Number(currPage)
        currPage = Number(currPage * pageNum)
        return new Promise((resolve,reject)=>{
            let sql = 'select * from user where type='+ type + ' order by modifytime desc LIMIT ?,?'
            //根据最后修改时间排序
            console.log(sql)
            console.log(this.formatParams(currPage,pageNum))
            this.query(sql,this.formatParams(currPage,pageNum)).then(result=>{

                resolve(result)
            }).catch(err=>{
                reject(err)
            })
        })
    }

    /**
     * 返回类型用户数量
     * @param type
     * @param pageNum
     * @param currPage
     * @returns {Promise<unknown>}
     */
    static getUserDataByTypeTotal(type,pageNum,currPage){
        return new Promise((resolve, reject) => {
            let sql = "select count(1) as count from user where type=" + type
            console.log(sql)
            this.query(sql).then(result=>{
                resolve(result)
            }).catch(err=>{
                reject(err)
            })
        })
    }


    static getUserInfoByIdMod(id){
        return new Promise((resolve, reject) => {
            let sql = "select * from user where id="+id
            this.query(sql).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    }
    /**
     * 删除用户表用户
     * @param id
     * @returns {Promise<unknown>}
     */
    static delUserdataMod(id){
        return new Promise((resolve, reject) => {
            let sql = 'delete from user where id=' + id
            console.log(sql)
            this.query(sql).then(result => {
                resolve("删除用户表用户成功")
            }).catch(err => {
                reject("删除用户表用户失败")
            })
        })
    }

    static delRead(id){
        return new Promise((resolve, reject) => {
            let sql = "delete from read_ where u_id=" + id
            console.log(sql)
            this.query(sql).then(result => {
                resolve(",删除阅读表用户成功")
            }).catch(err => {
                reject(",删除阅读表用户失败")
            })
        })
    }

    /**
     * 更新用户信息
     * @param u_id
     * @param username
     * @param sex
     * @param address
     * @param type
     * @returns {Promise<unknown>}
     */
    static upUserdataMod(u_id,username,sex,address,type){
        let currTime = tools.getDate19()
        return new Promise((resolve, reject) => {
            let sql = "update user set username='" + username + "',sex='" + sex + "',address='"
            + address + "',type=" + type + ",modifytime='" + currTime + "' where id=" + u_id
            console.log(sql)
            this.query(sql).then(result => {
                resolve("更新成功")
            }).catch(err => {
                reject("更新失败")
            })
        })
    }

    static upPwdMod(u_id,newpw){
        return new Promise((resolve, reject) => {
            u_id = Number(u_id)
            let sql = "update user set password='" + newpw + "' where id=" + u_id
            console.log(sql)
            this.query(sql).then(res => {
                resolve("密码修改成功")
            }).catch(err => {
                reject("更新失败")
            })
        })
    }

}
