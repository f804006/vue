var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');  //引入路由
var adminRouter = require('./routes/admin')
var uploadRouter = require('./routes/upload')
var studentRouter = require('./routes/student')
var app = express();



// 跨域请求设置
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  if(req.method=="OPTIONS") res.send(200);/*让options请求快速返回*/
  else  next();
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


const jwtUtil = require('./utils/jwtUtils')
global.globalKey = '123456'
/**拦截器**/
app.use(async function (req,resp,next) {
    let path = req.path
    let token = "";
    if(req.body.token) token = req.body.token
    else token = req.query.token
    console.log("---------------------")
    /**
     * 拦截users
     */
    if(path.startsWith("/users")){
        if(path.startsWith("/users/login")){
          console.log("login放行")
          next()
          return
        }


        let results = await jwtUtil.verifysync(token,globalKey)
        if(results.err){
          console.log("users解密失败，拦截")
          jwtAlert(resp)
          return
        }else{
          console.log("users解密成功，放行")
          next()
        }

    }

  /**
   * 拦截Admin
   */
    if(path.startsWith('/admin')){
        if(path.startsWith('/admin/getPageUser') || path.startsWith('/admin/getClasses')
            || path.startsWith('/admin/getHMIAndCP')
        ){
            console.log("拦截admin")
            next()
            return
        }

        let results = await jwtUtil.verifysync(token,globalKey)
        if(results.err){
            console.log("admin解密失败，拦截")
            jwtAlert(resp)
            return
        }else{
            console.log("admin解密成功，放行")
            next()
        }
    }


  /**
   * 拦截student
   */
    if(path.startsWith('/student') ){
        if(path.startsWith('/student/getHealthNowMonth')||
           path.startsWith('/student/gethealthNowDay')){
            console.log("/student 不需要登陆的功能，放行")
            next()
            return
        }

        let results = await jwtUtil.verifysync(token,globalKey)
        if(results.err){
            console.log("student解密失败，拦截")
            jwtAlert(resp)
            return
        }else{
            console.log("student解密成功，放行")
            next()
        }

    }

    if(path.startsWith('/upload') ){
        next()
        return
    }



})

/**
 * 未授权返回状态提示
 * @param resp
 */
function jwtAlert(resp){
    resp.status(401).send("游客只提供部分功能，请前往登陆")
}

//挂载路由
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/upload',uploadRouter);
app.use('/student',studentRouter)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
