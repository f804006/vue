<template>
    <div>
        <div class="row">
            <div class="col-lg-3 col-6">
                <!-- small box -->
                <div class="small-box bg-success">
                    <div class="inner">
                        <h3 v-text="fill"></h3>
                        <p>今日已填报人数</p>
                    </div>
                    <div class="icon">
                        <i class="ion ion-stats-bars"></i>
                    </div>
                    <a href="#" class="small-box-footer" @click="drawer1 = true">More info <i class="fas fa-arrow-circle-right"></i></a>
                </div>
            </div>
            <el-drawer
                    :title="title1"
                    :visible.sync="drawer1"
                    :direction="direction"

                    size="50%">
                <el-table
                        :data="userInfo"
                        style="width: 100%"
                        border
                        :header-cell-style="{'text-align':'center'}"
                        :cell-style="{'text-align':'center'}"

                        size="small"
                >

                    <el-table-column
                            prop="userid"
                            label="工号/学号"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="classes"
                            label="班级"
                            :filters="classInfo"
                            :filter-method="filterTag"
                            filter-placement="bottom-end"
                    >
                        <!--                        <template slot-scope="scope">-->
                        <!--                            <p v-for="(item,index) in scope.row.classes">-->
                        <!--                                <el-tag-->
                        <!--                                        :key="item"-->
                        <!--                                        closable-->
                        <!--                                        :disable-transitions="false"-->
                        <!--                                        @close="handleClose(item,scope.row.index)"-->
                        <!--                                        size="mini">-->
                        <!--                                    {{item}}-->
                        <!--                                </el-tag>-->
                        <!--                            </p>-->

                        <!--                        </template>-->
                    </el-table-column>
                    <el-table-column
                            prop="username"
                            label="姓名"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="address"
                            label="地址">
                    </el-table-column>
                    <el-table-column  label="今日是否填报">
                        <template slot-scope="scope">
                            <el-tag type="success" v-if="scope.row.report == true">已填报</el-tag>
                            <el-tag type="danger" v-else  >未填报</el-tag>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="block" style="text-align:center;margin-top:20px">
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-sizes="[5, 6, 7, 8,9]"
                            :page-size="5"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="usercount">
                    </el-pagination>
                </div>
            </el-drawer>
            <!-- ./col -->
            <div class="col-lg-3 col-6">
                <!-- small box -->

                <div class="small-box bg-danger">
                    <div class="inner">
                        <h3 v-text="hotTmp"></h3>
                        <p>今日高危人数</p>
                    </div>
                    <div class="icon">
                        <i class="ion ion-pie-graph"></i>
                    </div>
                    <a href="#" class="small-box-footer" @click="drawer2 = true">More info <i class="fas fa-arrow-circle-right"></i></a>
                </div>
            </div>
            <el-drawer
                    :title="title2"
                    :visible.sync="drawer2"
                    direction="ltr"

                    size="60%">
                <el-table
                        :data="highRiskManInfo"
                        style="width: 100%"
                        border
                        :header-cell-style="{'text-align':'center'}"
                        :cell-style="{'text-align':'center'}"

                        size="small"
                >
                    <el-table-column
                            prop="userid"
                            label="工号/学号"
                    >
                    </el-table-column>
                    <el-table-column prop="username" label="姓名">
                    </el-table-column>
                    <el-table-column prop="classes" label="所属班级">
                    </el-table-column>
                    <el-table-column prop="temperature" label="体温(℃)">
                        <template slot-scope="scope">
                            <i class="fa fa-thermometer-three-quarters" style="margin-right: 10px"></i>
                            <span v-if="scope.row.temperature > 37.5 && scope.row.temperature < 38.0" style="color: #F78181;font-weight:bold">{{ scope.row.temperature }}</span>
                            <span v-else-if="scope.row.temperature > 38.0 && scope.row.temperature < 38.5" style="color: #DF0101;font-weight:bold">{{ scope.row.temperature }}</span>
                            <span v-else style="color: #610B0B;font-weight:bold">{{ scope.row.temperature }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="goHighRisk" label="是否去过高风险地区">
                    </el-table-column>
                    <el-table-column prop="goHighRisk" label="是否做过核酸检测">
                    </el-table-column>
                    <el-table-column prop="phone" label="手机号">
                    </el-table-column>

                </el-table>
                <div class="block" style="text-align:center;margin-top:20px">
                    <el-pagination
                            @size-change="handleSizeChange2"
                            @current-change="handleCurrentChange2"
                            :current-page="currentPage2"
                            :page-sizes="[5, 6, 7, 8,9]"
                            :page-size="5"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="usercount2">
                    </el-pagination>
                </div>
            </el-drawer>
            <div class="col-lg-3 col-6">
                <!-- small box -->

                <div class="small-box bg-warning">
                    <div class="inner">
                        <h3 v-text="goHighRisk"></h3>
                        <p>今日经过高危地区人数</p>
                    </div>
                    <div class="icon">
                        <i class="ion ion-person-add"></i>
                    </div>
                    <a class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
                </div>
            </div>

            <!-- ./col -->
            <div class="col-lg-3 col-6">
                <!-- small box -->
                <div class="small-box bg-info">
                    <div class="inner">
                        <h3 v-text="UserSize"></h3>
                        <p>总检测人数</p>
                    </div>
                    <div class="icon">
                        <i class="ion ion-bag"></i>
                    </div>
                    <a href="#" class="small-box-footer">More info<i class="fas fa-arrow-circle-right"></i></a>
                </div>
            </div>
        </div>



        <div class="row">
            <div class="col-lg-6" style="width: 50%">
                <el-card shadow="hover">
                    <div slot="header" class="clearfix">
                        <span>今日汇报情况</span>
                    </div>
                    <ve-line :data="chartData3" height="20rem" :extend="setObject3"></ve-line>
                </el-card>
            </div>
            <div class="col-lg-6" style="width: 50%">
                <el-card shadow="hover">
                    <div slot="header" class="clearfix">
                        <span>本月汇报情况</span>
                    </div>
                    <ve-line :data="chartData" height="20rem" :extend="setObject"></ve-line>
                </el-card>
            </div>
        </div>
        <br/>
        <div class="row">
            <div class="col-lg-6" style="width: 50%">
                <el-card shadow="hover">
                    <div slot="header" class="clearfix">
                        <span>今日口罩情况</span>
                    </div>
                    <ve-pie :data="chartData1">
                    </ve-pie>
                </el-card>
            </div>
            <div class="col-lg-6" style="width: 50%">
                <el-card shadow="hover">
                    <div slot="header" class="clearfix">
                        <span>今日核酸检测</span>
                    </div>
                    <ve-pie :data="chartData2">
                    </ve-pie>
                </el-card>
            </div>
        </div>
    </div>
</template>

<script>
    import teacherAdmin from "../main/teacherAdmin";

    export default {
        data() {
            return {
                UserSize:'',
                fill:'',
                hotTmp:'',
                goHighRisk:'',
                chartData1: {
                    columns: ['类型', '访问用户'],
                    rows: []
                },
                chartData2: {
                    columns: ['类型', '访问用户'],
                    rows: []
                },
                chartData: {
                    columns: ['日','填报人数'],
                    rows: []
                },
                chartData3: {
                    columns: ['小时','填报人数'],
                    rows: []
                },
                setObject:{
                    yAxis: {
                        type: 'value',
                        minInterval: 1
                    },
                    xAxis:{
                        axisLabel:{
                            rotate: 45
                        }
                    }
                },
                setObject3:{
                    yAxis: {
                        type: 'value',
                        minInterval: 1
                    },
                    xAxis:{
                        axisLabel:{
                            rotate: 45
                        }
                    }
                },
                userInfo:[],
                MoreInfo1:'',
                MoreInfo2:'',
                MoreInfo3:'',
                /** 模态框参数 **/
                drawer1: false,
                drawer2: false,
                drawer3: false,
                direction: 'rtl',
                title1:"今日填报一览",
                title2:"今日高危人员详情",
                /**
                 * 后缀带2的是与高危人员有关的实例
                 */
                currentPage:1, //已填报人数MoreInfo
                currentPage2:1, ///高危人数MoreInfo
                usercount:0,
                usercount2:0,  //高危人员总数
                pageSize: 5,
                pageSize2: 5,
                pageNo: 1,
                pageNo2: 1,
                classInfo:[],
                highRiskManInfo:[],


            }
        },
        created(){
            //包括给予每一条数据一个report属性，来记载是否当天进行了填报
            this.getAllUserInfo(this.pageSize, this.pageNo)

            this.getMonth()

            this.getClassInfo()

            this.getPieDayInfo()

            this.getHighRiskManInfo(this.pageSize2,this.pageNo2)
        },
        methods:{
            showAlluser(){
                this.$Axios({
                    url:'/admin/getAllUser',
                    method:'get',
                    success: res=>{
                        console.log(res)
                    }
                })
            },
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
            },
            getHighRiskManInfo(pageNum,currPage){
                this.$axiosjwt({
                    url:"/admin/getHighRiskManInfo",
                    method:"get",
                    data:{
                        pageNum,
                        currPage: currPage - 1
                    },
                    success: res => {
                        this.highRiskManInfo = res.data
                        this.usercount2 = res.total
                    }
                })
            },
            getAllUserInfo(pageNum,currPage){
                /**
                 *获取一页数据
                 */
                this.$Axios({
                    url:"/admin/getPageUser",
                    method:"get",
                    data:{
                        pageNum: pageNum,
                        currPage: currPage - 1
                    },
                    success:(result)=> {
                        console.log(result)
                        this.UserSize = this.usercount = result.total
                        this.userInfo = result.data
                        let stuNum = 0
                        let teacherNum = 0
                        this.userInfo.forEach(item => {
                            if(item.type == 2) stuNum++;
                            else if(item.type == 3) teacherNum++;


                            item.report = false
                            item.classes = item.classes.split(';')
                        })
                        this.getDay()

                    },
                    error: err => {
                        console.log(err)
                    }
                })
            },
            getDay(){
                /**
                 * 获取当天健康表信息
                 */
                this.$Axios ({
                    url:"/student/gethealthNowDay",
                    method:"get",
                    data:{},
                    success:(result)=> {
                        console.log(result)
                        for(let index = 0;index < result.length;index ++){
                            let reportU_id = result[index].u_id
                            this.userInfo.forEach(item => {
                                if(item.id == reportU_id) {
                                    item.report = true
                                }
                            })
                        }
                        let date = new Date()
                        let Month = ""
                        if((date.getMonth() + 1 < 10)) {
                            Month = "0" + String((date.getMonth() + 1))
                        }else{
                            Month = (date.getMonth() + 1) + ""
                        }
                        let nowDate = "" + date.getFullYear() + "-" + Month + "-" +date.getDate()
                        this.title1 = "今日填报一览 ( " + nowDate + ",  总填报率:" + (result.length / this.usercount * 100).toFixed(2) + '' + "% )"
                        console.log(this.title1)
                    }
                });
            },
            getMonth(){
                /**
                 * 获取当月所有报表
                 */
                this.$Axios({
                    url:"/student/getHealthNowMonth",
                    method:"get",
                    data:{},

                    success:(result)=> {
                        let time0=0;
                        let time1=0;
                        let time2=0;
                        let time3=0;
                        let time4=0;
                        let time5=0;
                        let time6=0;
                        let time7=0;
                        let time8=0;
                        let time9=0;
                        let time10=0;
                        let time11=0;
                        let time12=0;
                        let time13=0;
                        let time14=0;
                        let time15=0;
                        let time16=0;
                        let time17=0;
                        let time18=0;
                        let time19=0;
                        let time20=0;
                        let time21=0;
                        let time22=0;
                        let time23=0;
                        let time24=0;
                        let time25=0;
                        let time26=0;
                        let time27=0;
                        let time28=0;
                        let time29=0;
                        let time30=0;
                        let time31=0;
                        result.forEach((value,index)=>{
                            let date = value.createtime;
                            let newdate = new Date(date);
                            let newdate1 = newdate.getDate();
                            if(newdate1==1){time1++};
                            if(newdate1==2){time2++};
                            if(newdate1==3){time3++};
                            if(newdate1==4){time4++};
                            if(newdate1==5){time5++};
                            if(newdate1==6){time6++};
                            if(newdate1==7){time7++};
                            if(newdate1==8){time8++};
                            if(newdate1==9){time9++};
                            if(newdate1==10){time10++};
                            if(newdate1==11){time11++};
                            if(newdate1==12){time12++};
                            if(newdate1==13){time13++};
                            if(newdate1==14){time14++};
                            if(newdate1==15){time15++};
                            if(newdate1==16){time16++};
                            if(newdate1==17){time17++};
                            if(newdate1==18){time18++};
                            if(newdate1==19){time19++};
                            if(newdate1==20){time20++};
                            if(newdate1==21){time21++};
                            if(newdate1==22){time22++};
                            if(newdate1==23){time23++};
                            if(newdate1==24){time24++};
                            if(newdate1==25){time25++};
                            if(newdate1==26){time26++};
                            if(newdate1==27){time27++};
                            if(newdate1==28){time28++};
                            if(newdate1==29){time29++};
                            if(newdate1==30){time30++};
                            if(newdate1==31){time31++};
                        })
                        this.chartData.rows.push(

                            { '日': '01号', '填报人数': time1},
                            { '日': '02号', '填报人数': time2},
                            { '日': '03号', '填报人数': time3},
                            { '日': '04号', '填报人数': time4},
                            { '日': '05号', '填报人数': time5},
                            { '日': '06号', '填报人数': time6},
                            { '日': '07号', '填报人数': time7},
                            { '日': '08号', '填报人数': time8},
                            { '日': '09号', '填报人数': time9},
                            { '日': '10号', '填报人数': time10},
                            { '日': '11号', '填报人数': time11 },
                            { '日': '12号', '填报人数': time12},
                            { '日': '13号', '填报人数': time13 },
                            { '日': '14号', '填报人数': time14},
                            { '日': '15号', '填报人数': time15},
                            { '日': '16号', '填报人数': time16 },
                            { '日': '17号', '填报人数': time17 },
                            { '日': '18号', '填报人数': time18 },
                            { '日': '19号', '填报人数': time19 },
                            { '日': '20号', '填报人数': time20},
                            { '日': '21号', '填报人数': time21 },
                            { '日': '22号', '填报人数': time22 },
                            { '日': '23号', '填报人数': time23 },
                            { '日': '24号', '填报人数': time24 },
                            { '日': '25号', '填报人数': time25 },
                            { '日': '26号', '填报人数': time26 },
                            { '日': '27号', '填报人数': time27 },
                            { '日': '28号', '填报人数': time28 },
                            { '日': '29号', '填报人数': time29 },
                            { '日': '30号', '填报人数': time30 },
                            { '日': '31号', '填报人数': time31 },
                        );
                    }
                })
            },
            getClassInfo(){
                this.$Axios({
                    url:"/admin/getClasses",
                    method:'get',
                    success: res => {
                        for(var i = 0;i < res.length;i ++){
                            this.classInfo.push({"text":res[i].classname,"value":res[i].classname})
                        }


                    }
                })
            },
            getPieDayInfo(){
                this.$Axios({
                    url:"/student/gethealthNowDay",
                    method:"get",
                    data:{},
                    success: result => {
                        this.fill=result.length;
                        let tim0=0;
                        let tim1=0;
                        let tim2=0;
                        let tim3=0;
                        let tim4=0;
                        let tim5=0;
                        let tim6=0;
                        let tim7=0;
                        let tim8=0;
                        let tim9=0;
                        let tim10=0;
                        let tim11=0;
                        let tim12=0;
                        let tim13=0;
                        let tim14=0;
                        let tim15=0;
                        let tim16=0;
                        let tim17=0;
                        let tim18=0;
                        let tim19=0;
                        let tim20=0;
                        let tim21=0;
                        let tim22=0;
                        let tim23=0;
                        let i = 0;
                        let j = 0;
                        let maskNo=0;
                        let maskY=0;
                        let hesuanY=0;
                        let hesuanNo=0;
                        result.forEach((value,index)=>{
                            if(value.temperature<=35 || value.temperature>=38)  i++
                            if(value.goHighRisk=="是")   j++

                            let date = result[index].createtime;
                            let newdate = new Date(date);
                            let newdate1 = newdate.getDate();
                            let newdate2 = newdate.getHours();
                            if(newdate2==0){tim0++};
                            if(newdate2==1){tim1++};
                            if(newdate2==2){tim2++};
                            if(newdate2==3){tim3++};
                            if(newdate2==4){tim4++};
                            if(newdate2==5){tim5++};
                            if(newdate2==6){tim6++};
                            if(newdate2==7){tim7++};
                            if(newdate2==8){tim8++};
                            if(newdate2==9){tim9++};
                            if(newdate2==10){tim10++};
                            if(newdate2==11){tim11++};
                            if(newdate2==12){tim12++};
                            if(newdate2==13){tim13++};
                            if(newdate2==14){tim14++};
                            if(newdate2==15){tim15++};
                            if(newdate2==16){tim16++};
                            if(newdate2==17){tim17++};
                            if(newdate2==18){tim18++};
                            if(newdate2==19){tim19++};
                            if(newdate2==20){tim20++};
                            if(newdate2==21){tim21++};
                            if(newdate2==22){tim22++};
                            if(newdate2==23){tim23++};
                            if(result[index].mask=="是"){
                                maskY++
                            }
                            if(result[index].mask=="否"){
                                maskNo++
                            }
                            if(result[index].hesuan=="是"){
                                hesuanY++
                            }
                            if(result[index].hesuan=="否"){
                                hesuanNo++
                            }
                        });
                        this.hotTmp=i;
                        this.goHighRisk=j;
                        this.chartData3.rows.push(
                            { '小时': '00:00', '填报人数': tim0},
                            { '小时': '01:00', '填报人数': tim1},
                            { '小时': '02:00', '填报人数': tim2},
                            { '小时': '03:00', '填报人数': tim3},
                            { '小时': '04:00', '填报人数': tim4},
                            { '小时': '05:00', '填报人数': tim5},
                            { '小时': '06:00', '填报人数': tim6},
                            { '小时': '07:00', '填报人数': tim7},
                            { '小时': '08:00', '填报人数': tim8},
                            { '小时': '09:00', '填报人数': tim9},
                            { '小时': '10:00', '填报人数': tim10},
                            { '小时': '11:00', '填报人数': tim11 },
                            { '小时': '12:00', '填报人数': tim12},
                            { '小时': '13:00', '填报人数': tim13 },
                            { '小时': '14:00', '填报人数': tim14},
                            { '小时': '15:00', '填报人数': tim15},
                            { '小时': '16:00', '填报人数': tim16 },
                            { '小时': '17:00', '填报人数': tim17 },
                            { '小时': '18:00', '填报人数': tim18 },
                            { '小时': '19:00', '填报人数': tim19 },
                            { '小时': '20:00', '填报人数': tim20},
                            { '小时': '21:00', '填报人数': tim21 },
                            { '小时': '22:00', '填报人数': tim22 },
                            { '小时': '23:00', '填报人数': tim23 }
                        );
                        this.chartData1.rows.push(
                            { '类型': '口罩充足', '访问用户': maskY },
                            { '类型': '口罩不充足', '访问用户': maskNo },
                        );
                        this.chartData2.rows.push(
                            { '类型': '已核酸检测', '访问用户': hesuanY },
                            { '类型': '未核酸检测', '访问用户': hesuanNo },
                        )
                    }
                })
            },
            handleSizeChange(val) {
                this.pageSize = val;
                //当输入框等不为空搜索,否则全部分页显示
                if (this.keywords && this.selectIndex) {
                    this.select()
                } else {
                    this.getAllUserInfo(this.pageSize, this.pageNo)
                }
            },
            handleCurrentChange(val) {
                this.pageNo = val;
                // console.log(`当前页: ${val}`);
                //分页
                if (this.keywords && this.selectIndex) {
                    this.select()
                } else {
                    this.getAllUserInfo(this.pageSize, this.pageNo)
                }
            },
            handleSizeChange2(val) {
                this.pageSize2 = val;
                //当输入框等不为空搜索,否则全部分页显示
                if (this.keywords && this.selectIndex) {
                    this.select()
                } else {
                    this.getHighRiskManInfo(this.pageSize2, this.pageNo2)
                }
            },
            handleCurrentChange2(val) {
                this.pageNo2 = val;
                // console.log(`当前页: ${val}`);
                //分页
                if (this.keywords && this.selectIndex) {
                    this.select()
                } else {
                    this.getHighRiskManInfo(this.pageSize2, this.pageNo2)
                }
            },
            clearFilter() {
                console.log("clear")
                this.$refs.filterTable.clearFilter();
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {

                return row.classes.includes(value);

            },
        }
    }
</script>

<style scoped lang="scss">
/deep/ :focus {
    outline: 0;
}
/*1.显示滚动条：当内容超出容器的时候，可以拖动：*/
.el-drawer__body {
    overflow: auto;
}
/*2.隐藏滚动条，太丑了*/
.el-drawer__container ::-webkit-scrollbar{
    display: none;
}
.el-drawer.rtl {
    overflow: scroll
}
</style>
