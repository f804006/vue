<template>
    <div class="common">
        <nav class="main-header navbar navbar-expand navbar-white navbar-light">
            <!-- Left navbar links -->
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
                </li>
                <li class="nav-item d-none d-sm-inline-block">
                    <router-link tag="a" to="/admin/home" class="nav-link" style="font-size:10px">回到主页面</router-link>
                </li>
            </ul>

            <div style="margin-left: 20%">
                <el-carousel indicator-position="outside" height="50px" arrow="never" style="width: 300px">
                    <el-carousel-item v-for="item in Carousel" :key="item" >
                        <div style="text-align: center;font-size: 10px;margin-top: 10%">{{ item }}</div>
<!--                        <h3>{{ item }}</h3>-->
                    </el-carousel-item>
                </el-carousel>
            </div>

            <!-- Right navbar links -->
            <ul class="navbar-nav ml-auto">
                <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
                <el-dropdown>
                  <span class="el-dropdown-link">
                       <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="el-icon-s-tools"></i></a>
                  </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item><i class="el-icon-switch-button"></i><el-button type="text" @click="outlogin">退出登录</el-button></el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                        <div class="dropdown-divider"></div>
            </ul>
        </nav>
        <!-- /.navbar -->

        <!-- Main Sidebar Container -->
        <aside class="main-sidebar sidebar-dark-primary elevation-4" style="background-color: RGB(44,46,47)">
            <!-- Brand Logo -->
            <a to="/admin/home" class="brand-link">
                <span v-text="type" class="brand-text font-weight-light nav-sidebarFont" style="margin-left: 5%"></span>
            </a>
            <!-- Sidebar -->
            <div class="sidebar">
                <!-- Sidebar user panel (optional) -->
                <div class="user-panel mt-3 pb-3 mb-3 d-flex">
                    <div class="image">
                        <img :src="touxiang" class="img-circle elevation-2" alt="User Image" style="width: 3rem;height: 3rem">
                    </div>
                    <div class="info">
                        <a href="#" v-text="username" class="d-block"></a>
                    </div>
                </div>

                <!-- Sidebar Menu -->
                <nav class="mt-2">
                    <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                        <router-link tag="li" v-for="(item,index) in navActive"  :key= "index"  class="nav-item" :to="item.path" style="font-size:10px">
                            <a class="nav-link nav-sidebarFont" >
                                <i :class="item.icon" ></i>
                                <p  >
                                    {{item.title}}
                                    <!--<span class="right badge badge-danger">New</span>-->
                                </p>
                            </a>
                        </router-link>

                    </ul>
                </nav>
                <!-- /.sidebar-menu -->
            </div>
            <!-- /.sidebar -->
        </aside>

        <!-- Content Wrapper. Contains page content -->
        <div class="content-wrapper">
            <!-- Content Header (Page header) -->

            <div class="content-header">
                <div class="container-fluid">
                    <div class="row mb-2">
                        <div class="col-sm-6">
                            <h5 class="m-0 text-dark"></h5>
                        </div><!-- /.col -->

                        <!--<div class="col-sm-6">-->
                            <!--<ol class="breadcrumb float-sm-right">-->
                                <!--<li class="breadcrumb-item"><a href="#">Home</a></li>-->
                                <!--<li class="breadcrumb-item active">Dashboard v1</li>-->
                            <!--</ol>-->
                        <!--</div>&lt;!&ndash; /.col &ndash;&gt;-->

                    </div><!-- /.row -->
                </div><!-- /.container-fluid -->
            </div>

            <!-- /.content-header -->

            <!-- Main content -->
            <section class="content" style="height: 34.5rem;overflow-y: scroll">
                <div class="container-fluid">
                    <el-row style="padding: 10px 10px">
                        <el-col :span="24">
                            <transition name="el-fade-in-linear" mode="out-in">
                                <router-view ></router-view>
                            </transition>
                        </el-col>
                    </el-row>
                </div>
            </section>
            <!-- /.content -->
        </div>
        <!-- /.content-wrapper -->
        <footer class="main-footer">
            <strong>@FWJ-2021 <a href="#">疫情管理系统</a>.</strong>
            All rights reserved.
            <div class="float-right d-none d-sm-inline-block">
                <b>Version
                    <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
                </b> 1.0.0
            </div>
        </footer>

        <!-- Control Sidebar -->
        <aside class="control-sidebar control-sidebar-dark">
            <!-- Control sidebar content goes here -->
        </aside>
        <!-- /.control-sidebar -->
    </div>
</template>

<script>

    export default {
        name: 'Admin',
        data () {
            return {
                type:'',
                touxiang:'',
                username:'',
                navActive:[
                    {
                    path:'/admin/student',
                    title:'学生管理',
                    icon:'nav-icon fa fa-user-circle fa-2x'
                    },
                    {   path:'/admin/teacher',
                        title:'教师管理',
                        icon:'nav-icon fa fa-user-circle'
                    },
                    {   path:'/admin/noticeSend',
                        title:'通知管理',
                        icon:'nav-icon fa fa-envelope'
                    },
                    {   path:'/admin/class',
                        title:"班级管理",
                        icon:'nav-icon fa fa-users'
                    }
                ],
                Carousel:['高危人员是指当日体温超过37.5℃的人员','公共场所注意戴口罩,努力做好个人防护','未进行健康打卡的人员请及时打卡','Carousel4']
            }
        },

        created(){
            /**
             * 渲染菜单信息
             this.touxiang 头像路径
             this.username 用户名
             this.type 显示的类型
             */
            this.$axiosjwt({
                url:'/users/getUserDataByToken',
                method:'get',
                data:{},
                success:(result)=>{
                    if (result.type == 1) this.type = "管理员"
                    else if (result.type == 2) this.type = "学生"
                    else if (result.type == 3) this.type = "教师"
                    this.username=result.username
                    this.touxiang= this.basePath+"/file/"+result.head
                }
            })
        },

        methods: {
            outlogin(){
                window.location.href = "http://localhost:80/#/Login";
            }
        }
    }
</script>
<style lang="scss" scoped>
    .content::-webkit-scrollbar {display:none}

    .el-carousel__item h3 {
        color: red;
        font-size: 18px;
        opacity: 0.75;
        line-height: 300px;
        margin: 0;
    }

    .el-carousel__item:nth-child(2n) {
        background-color: white;
    }

    .el-carousel__item:nth-child(2n+1) {
        background-color: white;
    }

    .nav-sidebarFont{
        color: rgb(151,152,152)
    }
    .nav-sidebarFont:hover{
        color: white;
    }
</style>
