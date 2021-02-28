global.globalKey = '123456'
const jwtUtil = require('../utils/jwtUtils')
const redisUtils = require('../utils/redisUtils')
module.exports = class extends require('../model/user_mod'){

    static async Login(req,resp){
        console.log(req.body.username)  //拿到前端发过来的数据
        let body = req.body
        let loginData = await this.LoginUser(body.username,body.password,body.type)  //调用父类LoginUser方法

        if(loginData.length != 0){
            let jwt_token = jwtUtil.sign({
                id:loginData[0].id,
                username:loginData[0].username,
                head:loginData[0].head,
                type:loginData[0].type,
                classes:loginData[0].classes,
                sex:loginData[0].sex,
                address:loginData[0].address,
                password:loginData[0].password,
                createtime:loginData[0].createtime
            },global.globalKey,3600) //token要保存哪些信息？  3600内有效
            resp.send({loginData,jwt_token}) //给前端返回值
        }else resp.status(500).send("用户名或密码错误")
    }


    static async getUserDataByToken(req,resp){
        let result = await jwtUtil.verifysync(req.query.token,global.globalKey)
        resp.send(result)
    }

    static async getUserDataByTypePage(req,resp){
        let query = req.query
        let data = await this.getUserDataByTypePageMod(query.type,query.pageNum,query.currPage)
        let total = await this.getUserDataByTypeTotal(query.type,query.pageNum,query.currPage)
        resp.send({data,total:total[0].count})
    }

    static async getUserInfoById(req,resp){
        let id = Number(req.query.id)
        let data = await this.getUserInfoByIdMod(id)

        resp.send(data)
    }

    static async delUserdata(req,resp){
        let results = await this.delUserdataMod(req.query.u_id) + await this.delRead(req.query.u_id)
        resp.send(results)
    }

    static async upUserdata(req,resp){
        let body = req.body
        let u_id = body.u_id
        //这里的u_id  指的是数据库里的id
        let username = body.username
        let sex = body.sex
        let address = body.address
        let type = body.type

        let result = await this.upUserdataMod(u_id,username,sex,address,type)
        resp.send(result)
    }

    static async setXlsxData(req,resp){
        let xlsxData = await redisUtils.get("xlsxData")
        let AllUsers = await this.getAllUserX()
        if(xlsxData == 'err'){
            resp.send("导入失败，不是标准文件(.xlsx)文件格式")
            return
        }
        console.log("################################")
        xlsxData = JSON.parse(xlsxData)[0].data
        console.log(xlsxData)

        let innerXlsxArr = []

        if(xlsxData[0].length != 8) resp.send("导入的表格数据格式错误")

        for(var i = 1;i < xlsxData.length;i ++){ //从1开始才是数据
            if(xlsxData[i][0] != 0){
                let innerflag = true
                let flag = true
                let xlsxObj = {}
                if(xlsxData[i][0] == null || xlsxData[i][1] == null || xlsxData[i][2] == null ||xlsxData[i][4] == null
                ||xlsxData[i][5] == null || xlsxData[i][6] == null|| xlsxData[i][7] == null){
                    innerflag = false  //有一个必填项是空的 则不能插入
                }
                xlsxObj.userid = xlsxData[i][0]
                xlsxObj.username = xlsxData[i][1]
                xlsxObj.password = xlsxData[i][2]
                xlsxObj.head = xlsxData[i][3] || '头像.png'
                xlsxObj.address = xlsxData[i][4]
                xlsxObj.sex = xlsxData[i][5]
                xlsxObj.classes = xlsxData[i][6]
                xlsxObj.type = xlsxData[i][7]

                for(let j = 0;j < AllUsers.length;j ++){

                    if(xlsxObj.userid == AllUsers[j].userid) {
                        console.log("重复数据！")
                        flag = false  //重复数据，不能插入
                        break;
                    }
                } //如果是已有数据 则不添加

                if(flag && innerflag) innerXlsxArr.push(xlsxObj)
            }
        }

        if(innerXlsxArr.length != 0){
            this.innerXlsxData(innerXlsxArr)
            console.log("导入数据成功")
            resp.send("导入数据成功")
        }else{
            console.log("导入失败")
            resp.status(500).send("导入文件中部分数据格式错误")
        }

    }

    static async upPwd(req,res){
        //req.body 是 post 方法  req.query 是 get 方法

        let verify = await jwtUtil.verifysync(req.body.token,globalKey)
        let u_id = verify.id
        let trueOldPw = verify.password
        let oldpw = req.body.oldpassword
        let newpw = req.body.newpassword
        if(oldpw != trueOldPw){
            res.send("旧密码错误！")
            return
        }else{
            let results = await this.upPwdMod(u_id,newpw)
            console.log(results)
            res.send(results)
        }

    }
}
