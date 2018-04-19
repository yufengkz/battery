<template>
    <div class="debtmanage">
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
        <!-- 已充电 -->
        <div id="mescroll0" class="  mescroll" v-show="currentIndex==0">
            <div id="dataList0">
                <ul v-for="(item,index) in newsList0" class="oul">
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
                            <span class="blue">{{item.battery_status}}</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <!-- 待充电 -->
        <div id="mescroll1" class="  mescroll" v-show="currentIndex==1">
            <div id="dataList1">
                <ul v-for="(item,index) in newsList1" class="oul">
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
                            <span class="blue">{{item.battery_status}}</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <!-- 异常 -->
        <div id="mescroll2" class=" mescroll" v-show="currentIndex==2">
            <div id="dataList2">
                <ul v-for="(item,index) in newsList2" class="oul" :key="index">
                    <li>
                        <span>电池编号:</span>
                        <span>{{item.battery_number}}</span>
                    </li>
                    <li>
                        <span>电池电量:</span>
                        <span>{{item.battery_power}}%</span>
                    </li>
	                <li>
		                <div>
			                <span>电池状态:</span>
			                <span class="red"> {{item.battery_status}}</span>
		                </div>
		                <router-link :data-battery_id="item.battery_id" :to="'/batFac/details/'+ item.battery_id" tag="a" class="red" >查看详情 》
		                </router-link>
	                </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
	import util from '../../assets/js/util'
    import MeScroll from 'mescroll.js'
	import ToTopImg from '../../assets/img/mescroll-totop.png'

    export default {
        name: 'debtManage',
        data() {
            return {
                userwarp: 'vip',
                tabList: ['已充电', '待充电', '异常'],
                debtLibraryTabIndex: 0,
                currentIndex: 0,
                mescrollArr: new Array(3),		//4个菜单所对应的4个mescroll对象
                newsList0: [],
                newsList1: [],
                newsList2: [],
                tabIndex: 0,
	            factory_id: ''
            }
        },
	    created(){
		    this.factory_id = this.$store.state.factory_id ? this.$store.state.factory_id : JSON.parse(util.getCookie('factory_id'))
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
                        	src: ToTopImg, //默认滚动到1000px显示,可配置offset修改
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
                var dataIndex = this.currentIndex; //记录当前联网的nav下标,防止快速切换时,联网回来curNavIndex已经改变的情况;
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
	            //根据tab判断字段名称
	            let battery_status = ''
	            if(curNavIndex == 0) battery_status = '满电待配送'
	            if(curNavIndex == 1) battery_status = '待充电'
	            if(curNavIndex == 2) battery_status = '异常'
                setTimeout(() => {
                    var listData = []
	                let url = `charge_factory/batterys/${this.factory_id}`

                    that.$axios.get(url, {params: {
		                    current_page: pageNum,
		                    page_size: pageSize,
		                    battery_status: battery_status
	                    }}).then( (data) => {
                        let res = data.data
                        if (res.code === 200) {
                        	console.log(res.data.data);
                            listData = res.data.data

                            successCallback && successCallback(listData);
                        }else{
	                        this.$dialog.toast({
		                        mes: res.message,
		                        timeout: 3000,
		                        icon: 'error',
		                        callback: () => {
			                        //do something
			                        errorCallback
		                        }
	                        })
                        }
                    }, () => {
                        errorCallback
                    }).catch( err => {
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
                }, 500)
            }
        },
    }
</script>
<style scoped lang="less">
    @color: #00CFB5;
    /*模拟的标题*/
    .debtmanage {
        .nav {
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9;
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
            font-size: .34rem;
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
        }
        /*列表模块样式*/
        .oul {
            background: #fff;
            padding: .15rem 0;
            margin-top: .2rem;
            > li {
                height: .6rem;
                line-height: .6rem;
                font-size: .28rem;
                padding: 0 .15rem;
                span:nth-of-type(2) {
                    margin-left: .2rem;
                }
                &:last-child {
                    div {
                        display: inline;
                    }
	                a {
		                float: right;
		                color: @color;
	                }
                }
            }
        }
    }
</style>
