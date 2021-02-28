<template>
    <div class="back">
        <div style="width: 25%;position:absolute;top:50%;left:50%;transform: translate(-50%,-50%);border-radius: 1px">
            <transition name="el-fade-in-linear">
                <el-card class="box-card" shadow="hover" style="text-align: center;"    @keyup.enter.native="login" >
                    <div slot="header" class="clearfix" style="text-align: center;">
                        <h2 style="font-size: 1rem;font-weight: bold">校园疫情管理系统</h2>
                    </div>
                    <el-input prefix-icon="el-icon-user-solid" v-model="input_user" placeholder="请输入用户名" class="inp"></el-input>
                    <div style="height: 1.3rem"></div>
                    <el-input prefix-icon="el-icon-lock" placeholder="请输入密码" v-model="input_pwd" show-password class="inp" ></el-input>
                    <el-radio-group v-model="radio3" size="small" style="display: flex;justify-content: space-around;margin-top: 1.3rem;">
                        <el-radio label="1" border>管理员</el-radio>
                        <el-radio label="2" border>学生</el-radio>
                        <el-radio label="3" border>教师</el-radio>
                    </el-radio-group>
                    <el-button type="primary" class="button" size="small"@click="login">登录</el-button>
                </el-card>
            </transition>
        </div>
    </div>


</template>
<script>
export default {
    name:'Login',
    data() {
    return {
        input_user: '',
        input_pwd:'',
        radio3: "1",
    }
  },
  methods:{
      /**
       * 登录
       * 用户名：username:this.input_user,
       * 密码：password:this.input_pwd,
       */
      login(){
          if (!this.input_user || !this.input_pwd){
                this.open3("用户名,密码不能为空")
              this.input_user=""
              this.input_pwd=""
          }else{
            this.$Axios({
                url:'http://localhost:3000/users/login',
                method:'post',
                data:{
                    username:this.input_user,
                    password:this.input_pwd,
                    type:this.radio3
                },
                success:(result)=>{
                 if (result=="用户名或密码错误"){
                     this.$message.error("用户名或者账号输入错误")
                     this.input_pwd=""
                     this.input_user=""
                 }else{
                     console.log(result)
                     window.localStorage.setItem("token",result.jwt_token)
                     if (this.radio3==1)  {
                         this.$router.push('/admin/home')
                     }
                     if (this.radio3==2)  {
                         this.$router.push('/student/home')
                     }
                     if (this.radio3==3)  window.location.href=' http://localhost:80/#/teacher/home'
                 }

                }
            })
          }
    },


      open3(v) {
          this.$message({
              message:v,
              type: 'warning'
          });
      },
  }
}
</script>
<style lang="scss" scoped>
    .login{
        h3{
            text-align: center;
            height: 60px;
            line-height: 20px;
            border-bottom: 1px solid rgb(170, 170, 170);
            color: rgb(92, 92, 92);
        }
            .inp{
            margin-top: 10px;
        }
        .button{
            margin-top: 20px;
            position: fixed;left:50%;transform: translateX(-50%);
        }
    }

    .back {
        width: 100vw;
        height: 100vh;
        color: #fff;
        background: linear-gradient(-45deg,rgb(173,201,248), rgb(189,164,245), rgb(231,193,235), #23D5AB);
        background-size: 400% 400%;
        /* -webkit-animation: Gradient 15s ease infinite; */
        animation: Gradient 15s ease infinite;
    }

    @-webkit-keyframes Gradient{
        0%{
            background-position: 0% 50%;
        }
        50%{
            background-position: 100% 50%;
        }
        100%{
            background-position: 0% 50%;
        }
    }

    @keyframes Gradient{
        0%{
            background-position: 0% 50%;
        }
        50%{
            background-position: 100% 50%;
        }
        100%{
            background-position: 0% 50%;
        }
    }


    h2 {
        font-weight: 400;
        font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
        text-align: center;

    }

    .container {
        height: 100%;
        /* 设置渐变色 */
        background-image: linear-gradient(to right, #fbc2eb, #a6c1ee);

    }
</style>
