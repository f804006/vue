var express = require('express');
var router = express.Router();

let fs = require('fs')
let fromidable = require('formidable')
let xlsx = require('node-xlsx')
let http = require('http')
let util = require('util')
let path = require('path')
let favicon = require('serve-favicon')
let bodyParser = require('body-parser')
const redisUtils = require('../utils/redisUtils')
const fileUp = require('../utils/fileUtils')

router.post('/upload',function (req,res) {

    console.log("##############################  POST / UPLOAD  ##############################")
    let fileTypeError = false
    let target_path = '.\\public\\upload'
    let form = new fromidable.IncomingForm();
    form.encoding = 'utf-8'
    form.keepExtensions = true
    form.maxFieldsSize = 10 * 1024 * 1024
    form.uploadDir = target_path

    let files  = []
    let fields = []


    console.log("来到了这里1")

    form.on('field',function (field,value) {
        console.log("来到了这里2")
        fields.push([field,value])
    })

    form.on('file',function (field,file) {
        console.log('fileName:' + file.name) //要上传文件的名字
        let filext = file.name.substring(file.name.lastIndexOf("."),file.name.length) //截取后缀名
        if(filext != '.xlsx'){
            redisUtils.set('xlsxData','err',3600) //redis存数据
            fileTypeError = true
        }else{
            fileTypeError = false
            return
        }
        files.push([field,file])
    })

    form.on('end',async function () {
        let fileName = ''
        let obj = ''
        let exfalg = true
        let folder_exists = await fs.existsSync(target_path)

        if(folder_exists){
            let dirList = await fs.readdirSync(target_path)
            console.log("dirList:",dirList)
            dirList.forEach(item => {
                if(!fs.statSync(target_path + '\\' + item).isDirectory()){
                    fileName = target_path + '\\' + item
                    if(!fileTypeError){
                        obj = xlsx.parse(fileName)
                        redisUtils.set("xlsxData",JSON.stringify(obj),3600)
                        res.send({"status":"成功导入数据","data":obj})
                    }else{
                        //解析失败
                        res.send({"status":"导入数据失败,文件格式错误"})
                        exfalg = false
                    }
                    fs.unlinkSync(fileName)
                }else{
                    res.send({"rtnCode":"1","rtnInfo":"系统错误"})
                    return
                }
            })
        }
    })

    form.on('error',function (err) {
        res.send({"rtnCode":"1","rtnInfo":"上传出错"})
    })

    form.on('aborted',function () {
        res.send({"rtnCode":"1","rtnInfo":"放弃上传"})
    })

    form.parse(req)

})




module.exports =  router
