<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="24" v-if="show">
                <el-card shadow="hover">
                    <div slot="header" style="text-align: center">
                        <span>填写通知</span>
                    </div>
                    <div style="display: flex;justify-content: center;margin-right: 10px;">
                        <!--<span style="margin: auto 0">主题</span>-->
                        <el-row :gutter="24">
                            <el-col :span="10"><div style="margin: auto 0"><el-input v-model="input" placeholder="主题"></el-input></div></el-col>
                            <el-col :span="10">                        <div style="margin: auto 0">
                                <el-select v-model="value" multiple placeholder="班级（多选）">
                                    <el-option
                                            v-for="item in options"
                                            :key="item.c_id"
                                            :label="item.classname"
                                            :value="item.classname">
                                    </el-option>
                                </el-select>
                            </div></el-col>
                            <el-col :span="4"><div style="margin: auto 0"><el-button type="primary" @click="noticeSend" round>发布</el-button></div></el-col>

                        </el-row>

                        <!--<span style="margin: auto 0">班级</span>-->


                    </div>
                </el-card>
            </el-col>

        </el-row>
<!--        <el-divider><i class="el-icon-loading"></i></el-divider>-->
        <el-row :gutter="20">
            <el-col :span="24">
                <el-card v-if="!show" shadow="hover">
                    <div slot="header" class="clearfix" style="text-align: center">
                        <span>通知详情查看</span>
                        <el-button style="float: right; padding: 3px 0" type="text" @click="cls">关闭</el-button>
                    </div>
                    <el-table
                            :data="tableData1"
                            border
                            style="width: 100%"
                            :header-cell-style="{'text-align':'center'}"
                            :cell-style="{'text-align':'center'}"
                            size="mini">
                        <el-table-column
                                prop="n_id"
                                label="序列号">
                        </el-table-column>
                        <el-table-column
                                label="通知的班级">
                            <template slot-scope="scope">
                                <p v-for="(item,index) in scope.row.class">
                                    <el-tag effect="plain" type="success" size="mini">
                                        {{ item }}
                                    </el-tag>
                                </p>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="title"
                                label="主题">
                        </el-table-column>

                        <el-table-column
                                label="发布时间">
                            <template slot-scope="scope">{{ scope.row.createtime | date}}</template>
                        </el-table-column>
                    </el-table>

                    <el-row :gutter="20" style="margin-top: 10px">
                        <el-col :span="8">
                            <el-card style="height: 300px" shadow="hover">
                                <ve-pie :data="chartData"
                                        :settings="Settings"
                                        :legend-visible="false">
                                </ve-pie>
                            </el-card>
                        </el-col>
                        <el-col :span="16">
                            <el-card shadow="hover" >
                                <div slot="header" class="clearfix" style="text-align: center">
                                    <div style="display: flex;justify-content: space-between;align-items: center">
                                        <span>访问记录</span>
                                        <el-select v-model="selectvalue" multiple placeholder="班级（多选）" @change="selectPart">
                                            <el-option
                                                    v-for="item in selectItem"
                                                    :key="item.c_id"
                                                    :label="item.classname"
                                                    :value="item.classname">
                                            </el-option>
                                        </el-select>
                                    </div>

                                </div>
                                <el-row :gutter="35"style="overflow-y: scroll;height: 12.5rem;padding-left: 50px">


                                    <el-col :span="5"  v-for="(item,index) in users" :key="index" class="ca" style="margin-bottom: 3rem;margin-top: 0.7rem;"
                                            :class="{mohu: (selectvalue.length == 0 || selectvalue.includes(item.classes)) ? false : true}" >
                                        <el-tooltip placement="top" >
                                            <div slot="content">来自{{item.classes}},阅读时间：{{ item.readtime | date}}</div>
                                            <el-card shadow="hover" :body-style="{ padding: '0px' }" style="min-height: 3rem;" class="imgcar">

                                                <img :src="imgPath+item.head" class="img-circle elevation-2 " alt="User Image" style="width: 3rem;height: 3rem;">

                                                <p class="time">{{  item.username }}</p>
                                            </el-card>
                                        </el-tooltip>
                                    </el-col>
                                </el-row>
                            </el-card>
                        </el-col>
                    </el-row>
                </el-card>
                <el-card v-else shadow="hover">
                    <el-table
                            :data="tableData"
                            border
                            style="width: 100%"
                            :header-cell-style="{'text-align':'center'}"
                            :cell-style="{'text-align':'center'}"
                            size="mini">
                        <el-table-column
                                prop="n_id"
                                sortable
                                label="序列号">
                            <template slot-scope="scope">
                                {{  scope.row.n_id < 10 ? "00" : "0"}}{{ scope.row.n_id }}
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="通知的班级">
                            <template slot-scope="scope">
                                <p v-for="(item,index) in scope.row.class">
                                    <el-tag effect="plain" type="success" size="mini">
                                        {{ item }}
                                    </el-tag>
                                </p>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="title"
                                label="主题">
                        </el-table-column>
                        <el-table-column
                                label="创建时间">
                            <template slot-scope="scope">{{ scope.row.createtime | date}}</template>
                        </el-table-column>
                        <el-table-column
                                label="操作">
                            <template slot-scope="scope">
                                <el-button
                                        size="mini"
                                        @click="selectshow(scope.$index, scope.row)">通知详情</el-button>
                                <el-button
                                        size="mini"
                                        type="danger"
                                        @click="open(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="block" style="text-align:center;margin-top:20px">
                        <el-pagination
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :current-page="currentPage"
                                :page-sizes="[10, 20, 30, 40,50]"
                                :page-size="10"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="UserSize">
                        </el-pagination>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                Settings: {
                    offsetY: 120,
                    radius: 60,
                    // level: [],
                    itemStyle: {
                        center: ['20%', '10%'],

                    },
                    label: {
                        normal: {
                            fontSize: 10,
                            formatter: '{b}' + '\n\r' + '{c}' + '\n\r' + '({d}%)'
                        }
                    },
                    roseType:'radius'

                },
                imgPath:this.basePath+"/file/",
                show:true,
                input:'',
                UserSize:0,
                currentPage: 1,
                tableData: [],
                tableData1: [],
                pageSize:10,
                pageNo:1,
                value: '',
                //先写死数据
                options: [{"classes":"1班"},{"classes":"2班"},{"classes":"3班"}],
                users:[],
                readtime:[],
                chartData: {
                    columns: ['类型', '用户'],
                    rows: []
                },
                textarea:"dasdsadasdads",
                selectItem:[],
                selectvalue:''
            }
        },
        filters:{
            date(time){
                var dt = new Date(time);
                // yyyy-mm-dd
                var y = dt.getFullYear();
                var m = dt.getMonth() + 1;
                var d = dt.getDate();
                var hh = dt.getHours();
                var mm = dt.getMinutes();
                var ss = dt.getSeconds();
                return y + "-" + m + "-" + d + "  " + hh + ":" + mm + ":" + ss
            },
        },
        created(){
            /**
             * 获取班级表(增值功能)
             */
            this.$axiosjwt({
                url:"/admin/getClasses",
                method:"get",
                data:{},
                success:(result)=>{
                    console.log(this.options)
                    this.options = result
                    this.selectItem = JSON.parse(JSON.stringify(this.options))
                }
            })

            /**
             * 调用获取所有通知
             */
            this.getAllnotice(this.pageSize,this.pageNo)


        },
        filters:{
            date(time){
                var dt = new Date(time);
                // yyyy-mm-dd
                var y = dt.getFullYear();
                var m = dt.getMonth() + 1;
                var d = dt.getDate();
                var hh = dt.getHours();
                var mm = dt.getMinutes();
                var ss = dt.getSeconds();
                return y + "-" + m + "-" + d + "  " + hh + ":" + mm + ":" + ss
            }
        },
        methods:{
            selectPart(){
                console.log(this.selectvalue)
            },
            //关闭
            cls(){
                let arr=[];
                this.chartData.rows=arr
                this.show=true;
            },

            open2(message) {
                this.$message({
                    message: message||'恭喜你，这是一条成功消息',
                    type: 'success'
                });
            },
            open3(v) {
                this.$message({
                    message: v,
                    type: 'warning'
                });
            },
            open(index, row) {
                this.$confirm('此操作将继续, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.delNotice(index,row);
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            /**
             * 查看通知详情(增值功能)
             n_id:row.n_id,
             * */
            selectshow(index,row){
                this.$axiosjwt({
                    url:"/admin/NoticeDetails",
                    method:"get",
                    data:{
                        n_id:row.n_id,
                    },
                    success:(result)=> {
                        let arr =[];
                        this.tableData1 = result.data
                        this.tableData1.forEach(item => {
                            item.class = item.class.split(';')
                        })
                        this.users=result.users;
                        this.readtime=result.idAndtime
                        this.chartData.rows.push(
                            { '类型': '已读', '用户': result.readNum },
                            { '类型': '未读', '用户': result.total-result.readNum },
                        )
                        this.show=false;
                    }
                });
            },
            /**
             * 删除通知(增值功能,后期实现)
             n_id:row.n_id,
             this.pageSize,this.pageNo
             * */
            delNotice(index,row){
                this.$axiosjwt({
                    url:"/admin/delNotice",
                    method:"post",
                    data:{
                        n_id:row.n_id,
                    },
                    success:(result)=>{
                        this.getAllnotice(this.pageSize,this.pageNo)
                    }
                })
            },

            /**
             * 分页获取所有通知
             * @param pageNum
             * @param currPage
             *
             pageNum:pageNum,
             currPage:currPage-1
             this.tableData=result.data;
             this.UserSize = result.total
             */
            getAllnotice(pageNum,currPage){
                console.log("getAllnotice")
                this.$axiosjwt({
                    url:'/admin/getAllNotice',
                    method:'get',
                    data:{
                        pageNum:pageNum,
                        currPage:currPage-1
                    },
                    success:(result)=> {
                        this.tableData = result.data;
                        this.tableData.forEach(item => {
                            item.class = item.class.split(';')
                        })
                        this.UserSize = result.total
                    }
                });
            },
            /**
             * 发布通知
             *   title:this.input,
                 classes:s,
             */
            noticeSend(){
                if (this.value.length==0|| !this.input){
                    this.open3("输入不可为空,请输入内容再发布")
                }else{
                    let s = this.value.join(";")
                    this.$axiosjwt({
                        url:"/admin/announce",
                        method:"post",
                        data:{
                            title:this.input,
                            classes:s,
                        },success:(result)=>{
                            this.input=""
                            this.value=""
                            this.open2(result)
                            this.getAllnotice(this.pageSize,this.pageNo)
                        }
                    })
                }




            },



            //分页
            handleSizeChange(val) {
                this.pageSize=val;
                this.getAllnotice(this.pageSize,this.pageNo)
            },
            handleCurrentChange(val) {
                this.pageNo=val;
                this.getAllnotice(this.pageSize,this.pageNo)
            }
        },
    }
</script>

<style scoped lang="scss">
    ::-webkit-scrollbar{
        display: none
    }
    /* .ca{
         height:15rem ;
     }*/
    .imgcar{
        min-height:11rem;
        display: flex;
        flex-flow: column;
        align-items: center;
        /*margin-top: 2rem;*/

    }
    .time {
        font-size: 13px;
        color: #999;
        text-align: center;
    }

    .bottom {
        margin-top: 13px;
        line-height: 12px;
    }

    .button {
        padding: 0;
        float: right;
    }

    .image {
        width: 40px;
        height: 40px;
        display: block;
        margin-right: 10px;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }

    .Mycenter{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
    }

    .mohu{
        filter: blur(2px);
    }
</style>
