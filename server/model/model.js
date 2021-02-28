const mysql = require('mysql')
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password:'123456',
    port: '3306',
    database: 'vue_test'
})


/**
 * 封装一个数据库模型类
  * @type {Model}
 */
module.exports = class Model{
    /**
     * 通用的查询方法
     * @param sql    要执行的sql语句
     * @param params  语句参数
     */
    static query(sql,params){
        return new Promise((resolve,reject)=>{
           pool.getConnection(function (err,connection) {
               if(err){
                   console.log(err)
                   connection.release()  //记得释放
               }else{
                   //query执行sql语句
                   connection.query(sql,params,(err,results)=>{
                       if(err){
                           console.log(err)
                           reject(err)
                       }else{
                           resolve(results)
                       }
                       //会话结束，释放连接
                       connection.release()
                   })
               }
           })
        })
    }

    static formatParams(){
        let array = []
        for(let i = 0,l = arguments.length; i < l;i ++){
            array.push(arguments[i]);
        }//argunments传来的数据集合
        return array
    }

    static getNowAndLastDate(){
        let date = new Date()
        let Month = ""
        if((date.getMonth() + 1 < 10)) {
            Month = "0" + String((date.getMonth() + 1))
        }else{
            Month = (date.getMonth() + 1) + ""
        }
        let nowDate = "" + date.getFullYear() + Month + date.getDate()
        let lastDate = "" + date.getFullYear() + Month + (date.getDate() + 1)
        let nowMonth = "" + date.getFullYear() + Month + "01"

        var str = ""
        if(date.getMonth() == 1) str = "28"
        else if(date.getMonth() == 0 || date.getMonth() == 2 || date.getMonth() == 4 || date.getMonth() == 6
        ||date.getMonth() == 7 || date.getMonth() == 9 ||date.getMonth() == 11) str = "31"
        else str = "30"
        let lastMonth = "" + date.getFullYear() + Month + str

        return {nowDate,lastDate,nowMonth,lastMonth}
    }
}
