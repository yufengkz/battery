<template>
	<div class="distribution">
		<div id="mescroll0" class="mescroll" v-show="currentIndex==0">
			<div id="dataList0">
				<ul v-for="(item,index) in newsList0" class="oul">
					<li>
						<span>配送单号:</span>
						<span>{{item.record_number}}</span>
					</li>
					<li>
						<span>配送服务站:</span>
						<span>{{item.trans}}</span>
					</li>
					<li>
						<span>配送人员:</span>
						<span>{{item.transporter_name}}{{item.transporter_mobile}}</span>
					</li>
					<li>
						<span>配送开始时间:</span>
						<span>{{item.begin_time}}</span>
					</li>
					<li>
						<span>配送结束时间:</span>
						<span>{{item.end_time}}</span>
					</li>
					<li>
						<span>电池总数量:</span>
						<span style="color:#00CFB5;">{{item.total_count}}</span>
					</li>
					<li>
						<span>正常数量:</span>
						<span style="color:#00CFB5;">{{item.total_count-item.exception_count}}</span>
					</li>
					<li>
						<div>
							<span>异常数量:</span>
							<span style="color:#fe5958;"> {{item.exception_count}}</span>
						</div>
						<!--<router-link to="/batTra/warRec1/batLis1"><span style="color:#00CFB5;">查看详情 》</span></router-link>-->
						<a href="javascript:;"><span style="color:#00CFB5;"
						                             @click="recordDetails(item)">查看详情 》</span></a>
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
		//配送记录
		name: "tra-distribution",
		data() {
			return {
				newsList0: [],
				mescrollArr: new Array(1),
				currentIndex: 0,
				tabIndex: 0,
				debtLibraryTabIndex: 0,
			}
		},
		mounted() {
			let transporter_id = this.$store.state.transporter_id ? this.$store.state.transporter_id : localStorage.getItem("transporter_id")

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
					// console.log("dataIndex=" + dataIndex + ", curNavIndex=" + self.currentIndex + ", page.num=" + page.num + ", page.size=" + page.size + ", pageData.length=" + pageData.length);

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
				if (curNavIndex == 0) battery_status = '满电待配送'
				if (curNavIndex == 1) battery_status = '待充电'
				if (curNavIndex == 2) battery_status = '异常'
				setTimeout(() => {
					var listData = []
					let url = `findTransportRecord`

					that.$axios.get(url, {
						params: {
							current_page: pageNum,
							page_size: pageSize,
							//battery_status: battery_status
						}
					}).then((data) => {
						let res = data.data
						if (res.code === 200) {
							console.log(res.data.data);
							listData = res.data.data

							successCallback && successCallback(listData);
						} else {
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
				}, 500)
			},

			//查看详情
			recordDetails(item) {
				localStorage.setItem("recordInfoDeatils", JSON.stringify(item))
				this.$router.push("/batTra/warRec1/batLis1")
			}
		},


	}
</script>

<style lang="less" scoped>
	@color: #00CFB5;
	.distribution {
		.mescroll {
			position: fixed;
			top: 0rem;
			bottom: 0;
			height: auto;
			width: 100%;
			max-width: 750px;
			padding-top: 0;
		}
		.oul {
			margin-top: .2rem;
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
		.oul:nth-of-type(1) {
			margin-top: 0;
		}
	}
</style>
