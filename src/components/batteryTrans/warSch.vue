<template>
    <div class="tra_searched">
        <div class="inputy">
            <yd-search
                v-model="searched"
                :on-submit="submitHandler"
                placeholder="请输入要查询的单号"
                :on-cancel="cancelHandler"
            ></yd-search>
        </div>
        <div v-show="flag" class="history_box">
            <div class="indexhead">
                <div class="head_left">
                    历史搜索
                </div>
                <div class="head_right">
                    <img src="../../assets/img/lese.png" alt="" @click="allempty">
                </div>
            </div>
            <div class="histy">
                <ul class="hislist">
                    <li v-for="(item,index) in sessionlist" @click="submitHistory">{{item}}</li>
                </ul>
            </div>
        </div>
        <div id="mescroll0" class=" tab-con " v-show="!flag">
            <ul id="dataList0" v-for="(item,index) in dataList" class="oul">
                <li>
                    <span>电池来源:</span>
                    <span style="color:#999999;">{{item.factory_name}}</span>
                </li>
                <li>
                    <span>配送人员:</span>
                    <span style="color:#999999;">{{item.transporter_name}}{{item.transporter_mobile}}</span>
                </li>
                <li>
                    <span>入库时间:</span>
                    <span style="color:#999999;">{{item.add_time}}</span>
                </li>
                <li>
                    <span>电池总数量:</span>
                    <span style="color:#999999;">{{item.storage_count}}</span>
                </li>
                <li>
                    <span>正常数量:</span>
                    <span style="color:#00CFB5;">{{item.storage_count-item.abnormal_count}}</span>
                </li>
                <li>
                    <div>
                        <span>异常数量:</span>
                        <span style="color:#fe5958;">{{item.abnormal_count}}</span>
                    </div>
                    <router-link to="/batTra/warRec1/traBatLis1" tag="div">
                        <span>查看详情 》</span>
                    </router-link>
                </li>
            </ul>
        </div>
        <input type="button" class="btn-block btn-hollow" id="J_Loading" value="Loading" style="visibility: hidden"/>

        <div v-show="noData" class="nodata">- 没有更多数据 -</div>
    </div>
</template>

<script>
    import util from '../../assets/js/util'

    export default {
        name: "tra-sch",
        data() {
            return {
                searched: '',
                rest: null || 0,
                sessionlist: [],
                dataList: [],
                flag: true,
                noData: false
            }
        },
        created() {
            //获取本地存储
            for (var i = 0; i < 8; i++) {
                if (sessionStorage.getItem("key" + i) != null) {
                    this.sessionlist.unshift(sessionStorage.getItem("key" + i))
                }
            }
        },
        mounted() {

        },
        methods: {
            //数据获取
            getDataList() {
                var that = this;
                let order_number = this.searched;
                let userInfo = this.$store.state.userInfo.account_id ? this.$store.state.userInfo : JSON.parse(util.getCookie('userInfo'))
                let account_id = userInfo.account_id;
                let url = `findRecord?account_id=${account_id}&current_page=1&page_size=10&order_number=${order_number}`
                this.$axios.post(url).then((data) => {
                    let res = data.data;
                    console.log(res.data);
                    if (res.code == 200) {
                        that.dataList = res.data.data;
                    }

                });
            },
            //历史搜索
            submitHistory(e) {
                //获取当前列表的内容
                var that = this;
                this.noData = false
                this.searched = e.target.innerHTML;
                this.$dialog.loading.open('加载中...');
                //数据获取
                this.getDataList();

                setTimeout(() => {
                    this.$dialog.loading.close();
                    /* 移除loading */
                    this.flag = false;
                    if (that.dataList.length == 0) {
                        that.noData = true;
                    } else {
                        that.noData = false
                    }
                }, 2000);
            },
            //搜索
            submitHandler(value) {
                this.rest++;
                //隐藏提醒
                this.noData = false
                //获取输入内容
                var val = this.searched;
                //本地存储
                var ian = "key" + this.rest;
                if (val == "") {
                    this.$dialog.toast({mes: `请输入内容`});
                } else {
                    sessionStorage.setItem(ian, val);
                }
                //失去焦点后切换成列表
                if (value != "") {
                    this.$dialog.loading.open('很快加载好了');
                    //数据获取
                    this.getDataList()

                    setTimeout(() => {
                        this.$dialog.loading.close();
                        /* 移除loading */
                        this.flag = false;
                        if (this.dataList.length == 0) {
                            this.noData = true;
                        } else {
                            this.noData = false
                        }
                    }, 2000);
                }
            },
            //取消
            cancelHandler() {
                //搜索框取消按钮
                history.back()
            },
            //清空
            allempty() {
                sessionStorage.clear()
                this.sessionlist = [];
            }
        }
    }
</script>

<style scoped lang="less">
    @color: #00CFB5;
    .tra_searched {
        height: 100%;
        background: #efefef;
        .inputy {
            position: fixed;
            top: 0;
            width: 100%;
            max-width: 750px;
        }
        .tab-con {
            margin-top: 1.1rem;
        }
        #mescroll0 {
            padding-top: 0;
        }
        .indexhead {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: .94rem;
            background: #fff;
            padding: .24rem;
            .head_left {
                font-size: .34rem;
            }
        }
        .indexhead img {
            height: .6rem;
            width: .6rem;
        }
        .history_box {
            margin-top: 1rem;
        }
        .histy {
            background: #ffffff;
        }
        .hislist {
            display: flex;
            flex-wrap: wrap;
            padding: .1rem 0;
            > li {
                background: #efefef;
                height: .64rem;
                max-width: 2rem;
                min-width: 1rem;
                overflow: hidden;
                line-height: .64rem;
                font-size: .24rem;
                color: #333;
                margin: .12rem;
                padding: 0 .24rem;
                border-radius: 4px;
                &:nth-of-type(1) {
                    margin-left: .24rem;
                }
            }
        }
        .oul {
            background: #fff;
            padding: .15rem 0;
            border-top: .2rem solid #efefef;
            > li {
                height: .6rem;
                font-size: .30rem;
                padding: 0 .15rem;
                span:nth-of-type(2) {
                    margin-left: .2rem;
                }
                &:nth-of-type(5) {
                    span:nth-of-type(2) {
                        display: inline;
                        color: @color;
                    }
                }
                &:last-child {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    > div:last-child {
                        span {
                            color: @color;
                        }
                    }
                }
            }
        }
        .nodata{
            text-align: center;
            width:100%;
            max-width:750px;
            height:2rem;
            line-height:2rem;
            position:fixed;
            bottom:1rem;
        }
    }
</style>
