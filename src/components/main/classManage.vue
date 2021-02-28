<template>
    <div>
        <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">

                <el-row :gutter="20">
                    <el-col :span="12">
                        <span>现有班级</span>
                    </el-col>
                    <el-col :span="12">
                        <el-input
                                placeholder="请输入班级名称"
                                v-model="input1"
                                clearable
                                style="width: 15rem">
                        </el-input>
                        <el-button type="primary" @click="select" round style="margin-left: 10px">查找</el-button>
                    </el-col>
                </el-row>
            </div>
            <el-table
                    :data="tableData"
                    border

                    style="width: 100%"
                    :header-cell-style="{'text-align':'center'}"
                    :cell-style="{'text-align':'center'}"

                    size="small">
                <el-table-column
                        prop="c_id"
                        sortable
                        label="班级编号">
                </el-table-column>
                <el-table-column
                        prop="classname"
                        label="班级名称">
                </el-table-column>
                <el-table-column
                        prop="headMasterName"
                        label="班主任">
                </el-table-column>
                <el-table-column
                        prop="classSize"
                        label="班级人数">
                </el-table-column>
            </el-table>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage1"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="10"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    style="margin-top: 2rem;text-align: center">
            </el-pagination>
        </el-card>
        <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
                <span>添加班级</span>
            </div>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-input
                            placeholder="请输入要添加的班级名称"
                            v-model="input"
                            clearable
                            style="width: 15rem">
                    </el-input>
                    <el-button type="primary" @click="add" round style="margin-left: 10px">添加</el-button>
                </el-col>
<!--                <el-col :span="12">-->
<!--                    <el-input-->
<!--                            placeholder="请输入查找内容"-->
<!--                            v-model="input1"-->
<!--                            clearable-->
<!--                            style="width: 15rem">-->
<!--                    </el-input>-->
<!--                    <el-button type="primary" @click="select" round style="margin-left: 10px">查找</el-button>-->
<!--                </el-col>-->
            </el-row>
        </el-card>
        <el-divider></el-divider>

    </div>
</template>

<script>
    export default {
        pageSize:10,
        pageNo:1,
        data(){
            return{
                total:0,
                currentPage1: 0,
                tableData:[],
                input:'',
                input1:''
            }
        },
        created(){
            this.getclass();
        },
        watch:{
            tableData:{
                deep:true,
                handler(){
                    var that = this
                    function getHMIAndCP(i) {
                        if(i == that.tableData.length) return
                        that.$Axios({
                            url:"/admin/getHMIAndCP",
                            method:"get",
                            data:{
                                id:that.tableData[i].headmasterId,
                                classname:that.tableData[i].classname
                            },
                            success: res=>{
                                that.$set(that.tableData[i],'headMasterName',res.HMI.username)
                                that.$set(that.tableData[i],'classSize',res.CP)
                                getHMIAndCP(i+1)
                            }
                        })

                    }
                    getHMIAndCP(0)
                }
            }
        },
        methods:{
            /**
             * 添加班级
             Classes:this.input
             */
            add(){
                if (!this.input) this.open3("提交添加班级名称不可为空")
                else{
                    var flag = 1
                    for(var i = 0;i < this.tableData.length;i ++){
                        if(this.tableData[i].classname == this.input){
                            flag = 0
                            break
                        }
                    }
                    if(flag == 1){
                        this.$axiosjwt({
                            url:"/admin/addClasses",
                            method:"post",
                            data:{
                                classname:this.input
                            },success:(result)=>{
                                this.open2("添加班级成功")
                                this.getclass()
                            }
                        })
                    }else{
                        this.open3("已有 " + this.input)
                    }
                }

            },
            /**
             * 模糊查询
             inputText:this.input1,
             this.tableData=result.data;
             this.total=result.data.length;
             */
            select(){
                if (!this.input1) this.open3("请填写要查找的内容!!!!!!!")
                else{
                    this.$axiosjwt({
                        url:"/admin/getClassesSear",
                        method:"get",
                        data:{
                            inputText:this.input1,
                            currPage:0,
                            pageNum:10
                        },success:(result)=>{
                            this.tableData=result.data;
                            this.total=result.data.length;
                        }
                    })
                }

            },
            /**
             * 获取班级信息
             this.tableData=result.data;
             this.total=result.data.length;
             */
            getclass(){
                this.$axiosjwt({
                    url:"/admin/getClasses",
                    method:"get",
                    data:{ },
                    success:(result)=>{
                        console.log(result)
                        this.tableData = result;
                        this.total = result.length;
                    }
                })

            },
            handleSizeChange(val) {
                // console.log(`每页 ${val} 条`);
                this.pageSize=val;
                //自行添加分页
            },
            handleCurrentChange(val) {
                // console.log(`当前页${val} `);
                this.pageNo=val;
            },
            open1(v) {
                this.$message(v);
            },
            open2(v) {
                this.$message({
                    message:v,
                    type: 'success'
                });
            },
            open3(v) {
                this.$message({
                    message:v,
                    type: 'warning'
                });
            },
            open4(v) {
                this.$message.error(v);
            }
        }
    }
</script>

<style scoped>

</style>
