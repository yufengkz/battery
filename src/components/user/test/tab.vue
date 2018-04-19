<template>
	<div class="debtmanage">
		<!-- 	 <tab style="background-color:#eeeeee;" custom-bar-width="60px" active-color="#fc6123" v-model="debtLibraryTabIndex">
			 <tab-item style="font-size:0.43rem;" :selected="debtLibraryTabIndex==index" v-for="(item,index) in tabList" @onclick="onItemClick(index)" :key="index">{{item}}</tab-item>
			</tab> -->

		<div class="tab">
			<div class="tab-item" v-for="(item,index) in tabList" v-model="debtLibraryTabIndex" v-bind:class="{active:(currentIndex == index)}" @click="onItemClick(index)">
				<span class="tab-link">{{item}}</span>
			</div>
		</div>


		<!-- 待接单tab盒子 -->
		<div id="mescroll0" class="debt-order-box tab-con mescroll" v-show="currentIndex==0">
			<div id="dataList0">
				<div class="debt-order-item"  v-for="item in newsList0">
					<router-link class="g-block" :to="{ path:'/RemoveDebt/debtmanage/debtdetail', query: { id:item.id,debtLibrary:true,debtState:item.debtState}}">
						<div class="db-orderbox" style="">
							<div class="db-order-num">
								<div class="g-inblcok" ><h4>编号：<span>{{item.debtNumber}}</span></h4></div>
							</div>
							<div class="db-order-i">
								<div>资产类型：<span>房产</span></div>
								<div class="db-order-c">资产地址：<span>{{item.provinceText}}{{item.cityText}}</span></div>
							</div>
							<div class="db-order-i">
								<div>期望价格：<span>{{item.expectedPrice}}</span></div>
								<div class="db-order-c">评估价格：<span>{{item.evaluatedPrice}}</span></div>
							</div>
						</div>
					</router-link>
				</div>
			</div>


		</div>
		<!-- 解债中tab盒子 -->
		<div id="mescroll1" class="debt-order-box tab-con mescroll" v-show="currentIndex==1">
			<div id="dataList1">
				<div class="debt-order-item" v-for="item in newsList1">
					<router-link class="g-block" :to="{ path:'/RemoveDebt/debtmanage/debtdetail', query: { id:item.id,debtLibrary:true,debtState:item.debtState}}">
						<div class="db-orderbox" style="">
							<div class="db-order-num">
								<div class="g-inblcok" ><h4>编号：<span>{{item.debtNumber}}</span></h4></div>
							</div>
							<div class="db-order-i">
								<div>资产类型：<span>房产</span></div>
								<div class="db-order-c">资产地址：<span>{{item.provinceText}}{{item.cityText}}</span></div>
							</div>
							<div class="db-order-i">
								<div>期望价格：<span>{{item.expectedPrice}}</span></div>
								<div class="db-order-c">评估价格：<span>{{item.evaluatedPrice}}</span></div>
							</div>
						</div>
					</router-link>
				</div>
			</div>
		</div>
		<!-- 已完成tab盒子 -->
		<div id="mescroll2" class="debt-order-box tab-con mescroll" v-show="currentIndex==2">
			<div id="dataList2">
				<div class="debt-order-item" v-for="item in newsList2">
					<router-link class="g-block" :to="{ path:'/RemoveDebt/debtmanage/debtdetail', query: { id:item.id,debtLibrary:true,debtState:item.debtState}}">
						<div class="db-orderbox" style="">
							<div class="db-order-num">
								<div class="g-inblcok" ><h4>编号：<span>{{item.debtNumber}}</span></h4></div>
							</div>
							<div class="db-order-i">
								<div>资产类型：<span>房产</span></div>
								<div class="db-order-c">资产地址：<span>{{item.provinceText}}{{item.cityText}}</span></div>
							</div>
							<div class="db-order-i">
								<div>期望价格：<span>{{item.expectedPrice}}</span></div>
								<div class="db-order-c">评估价格：<span>{{item.evaluatedPrice}}</span></div>
							</div>
						</div>
					</router-link>
				</div>
			</div>
		</div>

	</div>
</template>


<script>
	import MeScroll from 'mescroll.js'
	export default{
		name:'debtManage',
		data() {
			return{
				userwarp:'vip',
				tabList:['待接单','解债中','已完成'],
				debtLibraryTabIndex: 0,
				currentIndex:0,
				// newsList0:''
				mescrollArr:new Array(3),		//4个菜单所对应的4个mescroll对象
				newsList0:[],
				newsList1:[],
				newsList2:[],

			}
		},
		created(){

		},
		mounted: function() {
			//初始化首页
			this.mescrollArr[0]=this.initMescroll("mescroll0", "dataList0");
		},
		methods:{
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
						page:{
							size:6
						},
						noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
						empty: {
							warpId : clearEmptyId ,
							icon: "", //图标,默认null
							tip: "暂无相关数据~", //提示
							btntext: "去逛逛 >", //按钮,默认""
							btnClick: function(){//点击按钮的回调,默认null
								alert("点击了按钮,具体逻辑自行实现");
							}
						},
						// clearEmptyId: clearEmptyId, //相当于同时设置了clearId和empty.warpId; 简化写法;默认null
						toTop:{ //配置回到顶部按钮
							src : "", //默认滚动到1000px显示,可配置offset修改
						}
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
				var dataIndex=this.currentIndex; //记录当前联网的nav下标,防止快速切换时,联网回来curNavIndex已经改变的情况;
				this.getListDataFromNet(dataIndex,page.num, page.size, function(pageData) {
					console.log("dataIndex="+dataIndex+", curNavIndex="+self.currentIndex+", page.num="+page.num+", page.size="+page.size+", pageData.length="+pageData.length);

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
					case 2:
						if(page.num == 1) this.newsList2 =[];
						this.newsList2 = this.newsList2.concat(pageData);
						break;
				}
			},
			/*联网加载列表数据*/
			getListDataFromNet(curNavIndex,pageNum,pageSize,successCallback,errorCallback) {
				// debugger;
				//延时一秒,模拟联网
				let that = this;
				let pageNp=pageNum-1;
				//let url = common.QZ+'/debtMatter/debtMatter.do?action=queryDebtMatterListWithAsset&pageIndex='+pageNp+'&pageSize='+pageSize;
				let debtData = {
					curNavIndex:curNavIndex,
					verifyState:1,
				};
				console.log(debtData);

				setTimeout(function () {
					// $.ajax({
					// 	url:url,
					// 	type:'get',
					// 	dataType:'json',
					// 	data:{data:JSON.stringify(debtData)},
					// 	success:function(data){
					// 		console.log(data.data);
					// 		var listData=[];
					//
					// 		if(curNavIndex==0){
					// 			listData=data.data;
					// 		}else if(curNavIndex==1){
					// 			listData=data.data;
					// 		}else if(curNavIndex==2){
					//
					// 			listData=data.data;
					//
					// 		}
					// 		//回调
					// 		successCallback && successCallback(listData);
					// 	}
					// })
					var listData = []
					for (var i = 0, j = 10; i < j; i++) {
						listData.push({ name: curNavIndex + i });
					}
					successCallback && successCallback(listData);
				},500)
			}


		},
	}
</script>
<style>
	.tab{
		display: flex;
		align-items: center;
		justify-content: center;
		.tab-item{
			flex: 1;
			width: 100%;
			line-height: 0.8rem;
		}
	}
	.mescroll{
		position: fixed;
		top: 74px;
		bottom: 0;
		height: auto;
		padding-top: 10px;

	}

</style>
>>>>>>> 459832f5dd19bcb894981d988fae331ecb28f779
