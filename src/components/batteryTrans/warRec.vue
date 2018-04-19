<template>
    <div class="tra_war_rec">
        <!--这个是batteryFactory组件的子组件Warehousing record-->
        <!--搜索框-->

        <div class="ser">
            <router-link to="/batTra/warSch1" tag="div">
                <yd-search  fullpage placeholder="电池编号、骑手、配送人员、单号、服务站"></yd-search>
            </router-link>

        </div>
        <!--body-->
        <div class="nav">
            <div class="tab-item" v-for="(item,index) in tabList" v-model="debtLibraryTabIndex" v-bind:class="{active:(currentIndex == index)}" @click="onItemClick(index)">
                <span class="tab-link">{{item}}</span>
            </div>
        </div>
        <!-- 满电入库 -->
        <div id="mescroll0" class="debt-order-box tab-con mescroll" v-show="currentIndex==0">
            <div id="dataList0">
                <ul v-for="(item,index) in newsList0" class="oul">
                    <li>
                        <span>电池来源:</span>
                        <span>{{item.factory_name}}</span>
                    </li>
                    <li>
                        <span>配送人员:</span>
                        <span>{{item.transporter_name}}{{item.transporter_mobile}}</span>
                    </li>
                    <li>
                        <span>入库时间:</span>
                        <span>{{item.add_time}}</span>
                    </li>
                    <li>
                        <span>电池总数量:</span>
                        <span>{{item.storage_count}}</span>
                    </li>
                    <li>
                        <span>正常数量:</span>
                        <span>{{item.storage_count-item.abnormal_count}}</span>
                    </li>
                    <li>
                        <div>
                            <span>异常数量:</span>
                            <span class="red"> {{item.abnormal_count}}</span>
                        </div>
                        <div @click="jumpBatList(index)"><span class="blue">查看详情 》</span></div>
                    </li>
                </ul>
            </div>
        </div>
        <!-- 低电待充 -->
        <div id="mescroll1" class="debt-order-box tab-con mescroll" v-show="currentIndex==1">
            <div id="dataList1">
                <ul v-for="(item,index) in newsList1" class="oul">
                    <li>
                        <span>电池来源:</span>
                        <span>{{item.factory_name}}</span>
                    </li>
                    <li>
                        <span>配送人员:</span>
                        <span>{{item.linkman}}</span>
                    </li>
                    <li>
                        <span>入库时间:</span>
                        <span>{{item.add_time}}</span>
                    </li>
                    <li>
                        <span>电池总数量:</span>
                        <span>{{item.storage_count}}</span>
                    </li>
                    <li>
                        <span>正常数量:</span>
                        <span>{{item.storage_count-item.abnormal_count}}</span>
                    </li>

                    <li>
                        <div>
                            <span>异常数量:</span>
                            <span class="red"> {{item.abnormal_count}}</span>
                        </div>
                        <div @click="jumpBatList(index)"><span class="blue">查看详情 》</span></div>
                    </li>
                </ul>
            </div>
        </div>
    </div>

</template>


<script type="text/babel">
    import MeScroll from 'mescroll.js'
    import util from '../../assets/js/util'
    export default {
        name:'tra-rec',
        data() {
            return {
                tabList:['接收满电','低电返厂'],
                debtLibraryTabIndex: 0,
                currentIndex:0,
                mescrollArr:new Array(2),
                newsList0: [],
                newsList1: []
            }
        },
        mounted: function() {
            //根据tabIndex初始化首页
            let num = Number(this.$route.params.tabindex)
            this.tabIndex = num == 9 ? 0 : num || 0
            this.currentIndex = this.tabIndex
            this.debtLibraryTabIndex = this.tabIndex
            this.mescrollArr[this.tabIndex] = this.initMescroll("mescroll" + this.tabIndex, "dataList" + this.tabIndex)
        },

        methods: {
            onItemClick(index){
                if(this.currentIndex != index){
                    this.currentIndex = index;
                    if(this.mescrollArr[index]==null){
                        this.mescrollArr[index]=this.initMescroll("mescroll"+index, "dataList"+index);
                    }
                }
            },
            initMescroll(mescrollId,clearEmptyId){
                //创建MeScroll对象,内部已默认开启下拉刷新,自动执行up.callback,刷新列表数据;
                let mescroll = new MeScroll(mescrollId, {
                    //上拉加载的配置项
                    up: {
                        callback: this.getListData, //上拉回调,此处可简写; 相当于 callback: function (page) { getListData(page); }
                        isBounce: false, //是否允许ios的bounce回弹;默认true,允许回弹; 此处配置为false,可解决微信,QQ,Safari等等iOS浏览器列表顶部下拉和底部上拉露出浏览器灰色背景和卡顿2秒的问题
                        page: {
                            num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
                            size: 6, //每页数据条数
                            time: null //加载第一页数据服务器返回的时间; 防止用户翻页时,后台新增了数据从而导致下一页数据重复;
                        },
                        noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
                        empty: {
                            warpId: clearEmptyId,
                            icon: "", //图标,默认null
                            tip: "暂无数据...", //提示
                            // btntext: "暂无数据 >", //按钮,默认""
                            // btnClick: function () {//点击按钮的回调,默认null
                                // 	alert("点击了按钮,具体逻辑自行实现");
                            // }
                        },
                        // clearEmptyId: clearEmptyId, //相当于同时设置了clearId和empty.warpId; 简化写法;默认null
                        toTop: { //配置回到顶部按钮
                            src: "", //默认滚动到1000px显示,可配置offset修改
                        },
                        htmlNodata: '<p class="upwarp-nodata">-- 没有更多数据 --</p>', //无数据的布局
                    },
                    down:{
                        isLock:true
                    }
                });
                return mescroll;
            },
            getListData(page) {
                //联网加载数据
                var self = this;
                var dataIndex=this.currentIndex;
                //记录当前联网的nav下标,防止快速切换时,联网回来curNavIndex已经改变的情况;
                this.getListDataFromNet(dataIndex,page.num, page.size, function(pageData) {
                    self.mescrollArr[dataIndex].endSuccess(pageData.length);
                    self.setListData(pageData,dataIndex,page);
                }, function() {
                    //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
                    self.mescrollArr[dataIndex].endErr();
                });
            },
            setListData(pageData,dataIndex,page){
                //更新列表数据
                switch(dataIndex){
                    case 0:
                        if(page.num == 1) this.newsList0 =[];
                        this.newsList0 = this.newsList0.concat(pageData);
                        break;
                    case 1:
                        if(page.num == 1) this.newsList1 =[];
                        this.newsList1 = this.newsList1.concat(pageData);
                        break;
                }
            },
            getListDataFromNet(curNavIndex, pageNum, pageSize, successCallback, errorCallback) {
                //延时一秒,模拟联网
                let that = this;
                setTimeout(() => {
                    var listData = [];
                    //获取运输员信息
                    let userInfo = this.$store.state.userInfo.account_id ? this.$store.state.userInfo : JSON.parse(util.getCookie('userInfo'));
                    let account_id = userInfo.account_id;
                    let storage_type;
                    if (that.currentIndex == 0 ) {storage_type = "满电入库"}
                    if (that.currentIndex == 1 ) {storage_type = "低电返厂"}
                    let url = `findRecord?account_id=${account_id}&current_page=1&page_size=10&storage_type=${storage_type}`;
                    that.$axios.post(url).then( (data) => {
                        let res = data.data;
                        console.log(res);
                        if (res.code === 200) {
                            listData = res.data.data;
                            successCallback && successCallback(listData);
                        }else{
                            this.$dialog.toast({
                                mes: res.message,
                                timeout: 10000,
                                icon: 'error',
                                callback: () => {
                                    //do something
                                }
                            })
                        }
                    }, () => {
                        errorCallback
                    }).catch( err => {
                        this.$dialog.toast({
                            mes: err,
                            timeout: 10000,
                            icon: 'error',
                            callback: () => {

                            }
                        })
                    })
                }, 500)
            },
            jumpBatList(index){
                let details;
                if (this.currentIndex == 0){
                    details = this.newsList0[index];
                }else if (this.currentIndex == 1){
                    details = this.newsList1[index];
                }
                localStorage.setItem('details', JSON.stringify(details));
                this.$router.push('/batTra/warRec1/traBatLis1')
            }
        }
    }

</script>

<style lang="less" scoped>
    @color: #00CFB5;
    .tra_war_rec {
        height:100%;
        position:relative;
        .ser {
            position: fixed;
            top: 0;
            /*left: 0;*/
            z-index:10;
            width: 100%;
            max-width:750px;
        }
        .nav {
            z-index: 999;
            position: fixed;
            top: 1.1rem;
            width: 100%;
            max-width:750px;
            text-align: center;
            background-color: #efefef;
            font-size: 0.28rem;
            padding-top:.2rem;
            display: flex;
            border-bottom:1px solid #ddd;
        }
        /*菜单*/
        .nav .tab-item {
            flex-grow: 1;
            font-size: .34rem;
            line-height: .88rem;
            color: #747474;
            background-color: #ffffff;
        }
        .nav .tab-item .tab-link {
            display: inline-block;
            position: relative;
            top: 1px;
            padding: 0 0.2rem;
            height: 0.88rem;
        }
        .nav .active {
            color: @color;
            background-color: #ffffff;

            .tab-link {
                border-bottom: 2px solid @color;
            }
        }
        /*列表*/
        .mescroll {
            position: absolute;
            top: 2.2rem;
            width:100%;
            max-width:750px;
            .mescroll-upwarp {
                padding-bottom: 0.15rem;
            }
        }
        .mescroll, .mescroll-bar {
            &:last-child {
                div {
                    display: inline;
                    &:last-child {
                        float: right;
                        color: @color;
                    }
                }
            }
        }
        /*隐藏*/
        .hide {
            display: none;
        }
        /*列表模块样式*/
        .oul {
            margin-top:.2rem;
            background: #fff;
            padding: .15rem 0;
            > li {
                height: .6rem;
                line-height: .6rem;
                font-size: .30rem;
                padding: 0 .15rem;
                a {
                    display: inline-block;
                    float: right;
                }
                span:nth-of-type(2) {
                    margin-left: .2rem;
                    color:#999;
                }
                span.red{
                    color:#fe5958;
                }
                &:nth-of-type(5) {
                    span:nth-of-type(2) {
                        display: inline;
                        color: @color;
                    }
                }
                &:last-child {
                    div {
                        display: inline;
                        &:last-child {
                            float: right;
                            color: @color;
                        }
                    }
                }
            }
        }
        .oul:nth-of-type(1){
            margin-top:0;
        }
    }
</style>
