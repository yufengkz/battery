<template>
	<div class="searched">
		<div class="inputy">
			<yd-search
					v-model="searched"
					:on-submit="submitHandler"
					placeholder="请输入订单号搜索"
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
		<div id="scroll" class="debt-order-box tab-con" v-show="!flag">
			<ul v-for="(item,index) in newsList" class="oul">
				<li>
					<span>回收单号:</span>
					<span>{{item.order_number}}</span>
				</li>
				<li>
					<span>扫码人员:</span>
					<span>{{item.linkman}} {{item.mobile}}</span>
				</li>
				<li>
					<span>回收站名称:</span>
					<span>{{item.service_station_name}}</span>
				</li>
				<li>
					<span>回收时间:</span>
					<span>{{item.add_time}}</span>
				</li>
				<li>
					<span>回收电池总量:</span>
					<span>{{item.rated_battery_count}}</span>
				</li>
				<li>
					<div>
						<span>异常电池:</span>
						<span class="red">{{item.storage_battery_count}}</span>
					</div>
					<div @click="orderDetail(item)" >
						<span class="blue">查看详情 》</span>
					</div>
				</li>
			</ul>
		</div>
		<input type="button" class="btn-block btn-hollow" id="J_Loading" value="Loading" style="visibility: hidden"/>

		<div v-show="noData" style="text-align: center;height:2rem;line-height:2rem;">- 没有查询到数据 -</div>
	</div>
</template>

<script>
	import util from '../../assets/js/util'

	export default {
		name: "war-sch",
		data() {
			return {
				searched: '',
				rest: 0,
				sessionlist: [],
				newsList: [],
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
		methods: {
			orderDetail(obj){
				localStorage.setItem('orderDetail', JSON.stringify(obj))
				this.$router.push({path: '/batFac/batLis'})
			},
			//数据获取
			getDataList() {
				let that = this;
				let userInfo = this.$store.state.userInfo.account_id ? this.$store.state.userInfo : JSON.parse(util.getCookie('userInfo'))
				let account_id = userInfo.account_id;

				let storageType = ''
				let obj = {
					accountId: account_id,
					storageType: storageType,
					current_page: 1,
					page_size: 10,
					order_number: this.searched
				}
				this.$axios.get(`charge_factory/storage_record`, {
					params: obj
				}).then((data) => {
					let res = data.data;
					if(res.code == 200){
						that.newsList = res.data
					}else{
						this.$dialog.toast({
							mes: res.message,
							timeout: 1500,
							callback: () => {
								console.log(res);
							}
						})
					}

				});
			},
			//历史搜索
			submitHistory(e) {
				//获取当前列表的内容
				var that = this;
				this.searched = e.target.innerHTML;
				this.$dialog.loading.open('加载中...');
				//数据获取
				this.getDataList();

				setTimeout(() => {
					this.$dialog.loading.close();
					/* 移除loading */
					this.flag = false;
                    if (that.newsList.length == 0) {
                        setTimeout(() => {
                            that.noData = true;
                        }, 2000)
                    } else {
                        that.noData = false
                    }
				}, 2000);
			},
			//搜索
			submitHandler(value) {
				this.rest++;
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
                        if (this.newsList.length == 0) {
                            setTimeout(() => {
                                this.noData = true;
                            }, 2000)
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
	.searched {
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
		#scroll {
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
					color: #999;
				}
				span.red {
					color: red;
				}
				.blue {
					color: @color;
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
	}
</style>
