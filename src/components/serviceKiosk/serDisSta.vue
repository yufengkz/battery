<template>
    <div class="ser_debtmanage">
        <div class="nav">
            <div class="tab-item"
                 v-for="(item,index) in tabList"
                 v-model="debtLibraryTabIndex"
                 v-bind:class="{active:(currentIndex == index)}"
                 @click="onItemClick(index)">
                <span class="tab-link">{{item}}</span>
            </div>
        </div>
        <!--数据scroll盒子-->
        <!-- 使用中 -->
        <div id="mescroll0" class="mescroll" v-show="currentIndex==0">
            <div id="dataList0">
                <div  v-for="(item,key,index) in newsList0">
                    <ul class="oul">
                        <li>
                            <span>电池编号:</span>
                            <span>{{item.battery_number}}</span>
                        </li>
                        <li>
                            <span>电池电量:</span>
                            <span>{{item.battery_power}}</span>
                        </li>
                        <li>
                            <div>
                                <span>电池状态:</span>
                                <span v-if="item.is_abnormal == 1" class="red">异常</span>
                                <span v-else class="blue" >正常</span>
                            </div>
                        </li>
                        <li>
                            <div>
                                <span>租用人:</span>
                                <span>{{item.transporter_name}}</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <!-- 使用异常 -->
        <div id="mescroll1" class="mescroll" v-show="currentIndex==1">
            <div id="dataList1">
                <div id="warn">
                    <img src="../../assets/img/fwz_03.png">
                    <span>
                         以下车手3天内未更换电池，存在风险。点击“远程关闭”按钮关闭电池
                    </span>
                </div>
                <div  v-for="(item,key,index) in newsList1">
                    <ul class="oul">
                        <li>
                            <span>电池编号:</span>
                            <span>{{item.battery_number}}</span>
                        </li>
                        <li>
                            <span>电池电量:</span>
                            <span>{{item.battery_power}}</span>
                        </li>
                        <li>
                            <div>
                                <span>电池状态:</span>
                                <span v-if="item.is_abnormal==0" class="red">异常</span>
                                <span v-else class="blue" >正常</span>
                            </div>
                        </li>
                        <li>
                            <div>
                                <span>租用人:</span>
                                <span>{{item.transporter_name}}</span>
                            </div>
                        </li>
                    </ul>
                    <div class="yuanch" v-if="item.is_abnormal==0">
                        <div class="m-button">
                            <input type="button" class="yuan_btn" v-show="item.is_close==1"  value="远程关闭" @click="closeBat(item)"/>
                            <input type="button" class="yuan_btn yuan_btn_jihuo" v-show="item.is_close==0" value="远程激活" @click="openBat(item)"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 待租用 -->
        <div id="mescroll2" class="mescroll" v-show="currentIndex==2">
            <div id="dataList2">
                <div  v-for="(item,key,index) in newsList2">
                    <ul class="oul">
                        <li>
                            <span>电池编号:</span>
                            <span>{{item.battery_number}}</span>
                        </li>
                        <li>
                            <span>电池电量:</span>
                            <span>{{item.battery_power}}</span>
                        </li>
                        <li>
                            <div>
                                <span>电池状态:</span>
                                <span v-if="item.is_abnormal == 1" class="red">异常</span>
                                <span v-else class="blue" >正常</span>
                            </div>
                        </li>
                        <li>
                            <div>
                                <span>租用人:</span>
                                <span>{{item.transporter_name}}</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <!-- 待充电 -->
        <div id="mescroll3" class="mescroll" v-show="currentIndex==3">
            <div id="dataList3">
                <div  v-for="(item,key,index) in newsList3">
                    <ul class="oul">
                        <li>
                            <span>电池编号:</span>
                            <span>{{item.battery_number}}</span>
                        </li>
                        <li>
                            <span>电池电量:</span>
                            <span>{{item.battery_power}}</span>
                        </li>
                        <li>
                            <div>
                                <span>电池状态:</span>
                                <span v-if="item.is_abnormal == 1" class="red">异常</span>
                                <span v-else class="blue" >正常</span>
                            </div>
                        </li>
                        <li>
                            <div>
                                <span>租用人:</span>
                                <span>{{item.transporter_name}}</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <!-- 电池异常 -->
        <div id="mescroll4" class="mescroll" v-show="currentIndex==4">
            <div id="dataList4">
                <div  v-for="(item,key,index) in newsList4">
                    <ul class="oul">
                        <li>
                            <span>电池编号:</span>
                            <span>{{item.battery_number}}</span>
                        </li>
                        <li>
                            <span>电池电量:</span>
                            <span>{{item.battery_power}}</span>
                        </li>
                        <li>
                            <div>
                                <span>电池状态:</span>
                                <span v-if="item.is_abnormal == 1" class="red">异常</span>
                                <span v-else class="blue" >正常</span>
                            </div>
                        </li>
                        <li>
                            <div>
                                <span>租用人:</span>
                                <span>{{item.transporter_name}}</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import MeScroll from 'mescroll.js'
    import util from '@/assets/js/util'
    import ToTopImg from '../../assets/img/mescroll-totop.png'
    export default {
        name: 'ser-debtManage',
        data() {
            return {
                userwarp: 'vip',
                tabList: ['使用中', '使用异常', '待租用',"待充电","电池异常"],
                debtLibraryTabIndex: 0,
                currentIndex: 0,
                mescrollArr: new Array(5),		//5个菜单所对应的5个mescroll对象
                newsList0: [],
                newsList1: [],
                newsList2: [],
                newsList3: [],
                newsList4: [],
                tabIndex: 0,
                longClose:false,  //远程关闭按钮
                statueList: ['使用中', '使用异常', '待使用',"低电待配送","电池异常"],//电池状态切换
                battery_id:'' ||null
            }
        },
        created() {

        },
        mounted() {
            //根据tabIndex初始化首页
            let num = Number(this.$route.params.tabindex)
            this.tabIndex = num == 9 ? 0 : num || 0
            this.currentIndex = this.tabIndex
            this.debtLibraryTabIndex = this.tabIndex
            this.mescrollArr[this.tabIndex] = this.initMescroll("mescroll" + this.tabIndex, "dataList" + this.tabIndex)
        },
        methods: {
            //弹窗
            closeBat(item){
                let using_time = item.using_time
                this.$dialog.confirm({
                    title: ' ',
                    mes: '该车辆'+using_time+'未发生移动，是否确认关闭',
                    opts: () => {
                        let is_close = item.is_close == 0 ? 1 : 0
                        this.$axios.patch(`station_batterys?battery_id=${item.battery_id}&is_close=${is_close}`).then((data)=>{
                            let res = data.data;
                            item.is_close = res.data;
                            res.data = 0;
                        })
                    }
                });
            },
            openBat(item){
                this.closeBat(item)
            },
            onItemClick(index) {
                if (this.currentIndex != index) {
                    this.currentIndex = index;
                    if (this.mescrollArr[index] == null) {
                        this.mescrollArr[index] = this.initMescroll("mescroll" + index, "dataList" + index);
                    }
                }
            },
            initMescroll(mescrollId, clearEmptyId) {
                //创建MeScroll对象,内部已默认开启下拉刷新,自动执行up.callback,刷新列表数据;
                let mescroll = new MeScroll(mescrollId, {
                    //上拉加载的配置项
                    up: {
                        callback: this.getListData, //上拉回调,此处可简写; 相当于 callback: function (page) { getListData(page); }
                        isBounce: false, //是否允许ios的bounce回弹;默认true,允许回弹; 此处配置为false,可解决微信,QQ,Safari等等iOS浏览器列表顶部下拉和底部上拉露出浏览器灰色背景和卡顿2秒的问题
                        page: {
                            num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
                            size: 10, //每页数据条数
                            time: null //加载第一页数据服务器返回的时间; 防止用户翻页时,后台新增了数据从而导致下一页数据重复;
                        },
                        noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
                        empty: {
                            warpId: clearEmptyId,
                            icon: "", //图标,默认null
                            tip: "暂无数据...", //提示
                            // btntext: "去逛逛 >", //按钮,默认""
                            // btnClick: function () {//点击按钮的回调,默认null
                            // 	alert("点击了按钮,具体逻辑自行实现");
                            // }
                        },
                        // clearEmptyId: clearEmptyId, //相当于同时设置了clearId和empty.warpId; 简化写法;默认null
                        toTop: { //配置回到顶部按钮
                        	src: "ToTopImg", //默认滚动到1000px显示,可配置offset修改
                        },
                        htmlNodata: '<p class="upwarp-nodata">-- 没有更多数据 --</p>', //无数据的布局
                    },
                    down: {
                        isLock: true
                    },
                });
                return mescroll;
            },
            getListData(page) {
                //联网加载数据
                var self = this;
                var dataIndex = this.currentIndex;
                //记录当前联网的nav下标,防止快速切换时,联网回来curNavIndex已经改变的情况;
                this.getListDataFromNet(dataIndex, page.num, page.size, function (pageData) {
                    self.mescrollArr[dataIndex].endSuccess(pageData.length);
                    self.setListData(pageData, dataIndex, page);
                }, function () {
                    //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
                    self.mescrollArr[dataIndex].endErr();
                });
            },
            /*设置列表数据
			 * pageData 当前页的数据
			 * dataIndex 数据属于哪个nav */
            setListData(pageData, dataIndex, page) {
                //更新列表数据
                switch (dataIndex) {
                    case 0:
                        if (page.num == 1) this.newsList0 = [];
                        this.newsList0 = this.newsList0.concat(pageData);
                        break;
                    case 1:
                        if (page.num == 1) this.newsList1 = [];
                        this.newsList1 = this.newsList1.concat(pageData);
                        break;
                    case 2:
                        if (page.num == 1) this.newsList2 = [];
                        this.newsList2 = this.newsList2.concat(pageData);
                        break;
                    case 3:
                        if (page.num == 1) this.newsList3 = [];
                        this.newsList3 = this.newsList3.concat(pageData);
                        break;
                    case 4:
                        if (page.num == 1) this.newsList4 = [];
                        this.newsList4 = this.newsList4.concat(pageData);
                        break;
                }
            },
            /*联网加载列表数据*/
            getListDataFromNet(curNavIndex, pageNum, pageSize, successCallback, errorCallback) {
                // debugger;
                //延时一秒,模拟联网
                let that = this;
                // let debtData = {
                //     curNavIndex: curNavIndex,
                //     verifyState: 1,
                // }
                setTimeout(() => {
                    let userInfo = this.$store.state.userInfo.account_id ? this.$store.state.userInfo : JSON.parse(util.getCookie('userInfo'));
                    let account_id = userInfo.account_id;
                    var listData = [];
                    if (that.currentIndex == 1){
                        that.$axios.get(`station_batterys/exception/${account_id}`).then((data)=>{
                            let res = data.data;
                            console.log(res);
                            if (res.code === 200) {
                                listData = res.data;
                                successCallback && successCallback(listData);
                            }else{
                                errorCallback
                                /*this.$dialog.toast({
                                    mes: res.message,
                                    timeout: 3000,
                                    icon: 'error',
                                    callback: () => {
                                        //do something
                                        errorCallback
                                    }
                                })*/
                            }
                        },()=>{errorCallback})
                    }else{
                        that.$axios.get(`station_batterys/${account_id}?battery_status=${that.statueList[curNavIndex]}`).then( (data) => {
                            let res = data.data;
                            if (res.code === 200) {
                                listData = res.data;
                                successCallback && successCallback(listData);
                            }else{
                                errorCallback
                                /*this.$dialog.toast({
                                    mes: res.message,
                                    timeout: 3000,
                                    icon: 'error',
                                    callback: () => {
                                        //do something
                                    }
                                })*/
                            }
                        }, () => {
                            errorCallback
                        }).catch(err => {
                            this.$dialog.toast({
                                mes: err,
                                timeout: 5000,
                                icon: 'error',
                                callback: () => {
                                    //do something
                                    errorCallback
                                }
                            })
                        })
                    }
                }, 500)
            }
        },
    }
</script>
<style scoped lang="less">
    @color: #00CFB5;
    .ser_debtmanage {
        position:relative;
        height:100%;
        #warn {
            background: #fff;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            padding:.24rem;
            img {
                margin-top:.05rem;
            }
            span{
                color: red;
                font-size: .3rem;
            }
        }
        .nav {
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9990;
            position: fixed;
            top: 0;
            /*left: 0;*/
            width: 100%;
            max-width: 750px;
            height: 1rem;
            background-color: #fff;
            font-size: 0.28rem;
        }
        /*菜单*/
        .nav .tab-item {
            flex: 1;
            line-height: 1rem;
            text-align: center;
            font-size: .3rem;
        }
        .nav .active {
            border-bottom: 1px solid @color;
            color: @color;
        }
        .mescroll {
            position: fixed;
            top: 1rem;
            bottom: 0;
            height: auto;
            width: 100%;
            max-width: 750px;
            padding-top:0;
            >div>div{
                background: #fff;
                padding: .15rem 0;
                margin-top: .2rem;
                display: flex;
                align-items: center;
                .oul{
                    flex:1;
                }
                .yuanch{
                    width:2.23rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .yuan_btn{
                        border:1px solid red;
                        color:red;
                        height:.64rem;
                        width:1.7rem;
                        line-height:.64rem;
                        text-align: center;
                        font-size:.3rem;
                        border-radius:.4rem;
                    }
                    .yuan_btn_jihuo{
                        border:1px solid @color;
                        color:@color;
                    }
                    .sky{
                        border-color:@color;
                        color:@color;
                    }
                }

            }
        }

        /*列表模块样式*/
        .oul {
            > li {
                height: .6rem;
                line-height: .6rem;
                font-size: .28rem;
                padding: 0 .15rem;
                span:nth-of-type(2) {
                    margin-left: .2rem;
                }
            }
        }
    }
</style>
