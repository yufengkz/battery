<template>
	<div class="batfac">

		<!--头部-->
		<div class="indexhead">
			<div class="head_left">
				{{factoryInfo.factory_name}}
			</div>
			<router-link to="/user" class="head_right" tag="div">
				<img src="../../../assets/img/mine2.png" alt="">
			</router-link>
		</div>

		<!--电池汇总列表 标题-->
		<div class="facstate">
			<div class="indexhead">
				<div class="head_left">
					电池汇总(块)
				</div>
			</div>
			<!--电池汇总列表-->
			<div class="listone">
				<router-link to="/batFac/disSta/9" tag="div">
					<div class="liebiao">
						<div class="liezuo">
							<img src="../../../assets/img/432x.png" alt="">
						</div>
						<div class="lieyou">
							<div>电池总数</div>
							<div>{{factoryInfo.storage_battery_count}}</div>
						</div>
					</div>
				</router-link>
				<router-link to="/batFac/disSta/0" tag="div">
					<div class="liebiao">
						<div class="liezuo">
							<img src="../../../assets/img/442x.png" alt="">
						</div>
						<div class="lieyou">
							<div>已充电</div>
							<div>{{factoryInfo.power_max_count}}</div>
						</div>
					</div>
				</router-link>
				<router-link to="/batFac/disSta/1" tag="div">
					<div class="liebiao">
						<div class="liezuo">
							<img src="../../../assets/img/chong2.png" alt="">
						</div>
						<div class="lieyou">
							<div>待充电</div>
							<div>{{factoryInfo.power_min_count}}</div>
						</div>
					</div>
				</router-link>
				<router-link to="/batFac/disSta/2" tag="div">
					<div class="liebiao">
						<div class="liezuo">
							<img src="../../../assets/img/452x.png" alt="">
						</div>
						<div class="lieyou">
							<div>电池异常</div>
							<div>{{factoryInfo.abnormal_count}}</div>
						</div>
					</div>
				</router-link>
			</div>
		</div>

		<!--今日预计配送-->
		<router-link :factory_id="factory_id" :to="'/batFac/scaCha/' + factory_id" tag="div" class="ps_cpt">
			<div class="ps_left">今日预计配送:</div>
			<div class="ps_right">{{factoryExpNum}}</div>
		</router-link>
		<!--扫码-->
		<div class="saom">
			<figure @click="scanQRCode(1)" to="/batFac/confir/1" tag="figure" class="sm_left">
				<div><img src="../../../assets/img/462x.png" alt="低电待充" @click=""></div>
				<figcaption>低电待充</figcaption>
			</figure>
			<figure @click="scanQRCode(0)" to="/batFac/confir/0" tag="figure" class="sm_right">
				<div><img src="../../../assets/img/462x.png" alt="满电入库" @click=""></div>
				<figcaption>满电入库</figcaption>
			</figure>
		</div>
		<!--入库记录-->
		<div class="record" :style="styles">
			<router-link :to="'/batFac/warRec/' + factory_id" tag="div">入库记录</router-link>
		</div>
	</div>
</template>

<script>
	import util from '../../../assets/js/util'
	import wx from 'weixin-js-sdk'

	export default {
		name: 'bat-fac',
		data() {
			return {
				styles: {},
				factoryInfo: {},
				factory_id: '' || null,
				factoryExpNum: 0
			}
		},
		computed: {
			isLoading() {
				return this.$store.state.isLoading
			}
		},
		mounted() {
			//根据id获取到user的工厂信息
			this.getFactoryInfo()

			//判断适口高度 定位最下面元素
			this.styles = this.getViewHeight()

			//获取微信配置文件
			this._wxConfig()
		},
		methods: {
			//获取微信配置文件
			_wxConfig() {
				let _this = this
				let root = '' //encodeURIComponent(window.location.href.split('#')[0])
				let url = `http://batteryweb.haolei100.com/wx/config?pathName=${root}`
				this.$axios.get(url).then((data) => {
					let res = data.data;
					console.log(data);
					let appId = res.appId;
					let nonceStr = res.nonceStr;
					let signature = res.signature;
					let timestamp = res.timestamp;
					wx.config({
						debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
						appId: appId, // 必填，公众号的唯一标识
						timestamp: timestamp, // 必填，生成签名的时间戳
						nonceStr: nonceStr, // 必填，生成签名的随机串
						signature: signature,// 必填，签名
						jsApiList: ['scanQRCode', 'previewImage', 'uploadImage', 'getLocalImgData'] // 必填，需要使用的JS接口列表 扫一扫 预览图片接口 上传图片接口 获取本地图片接口
					})

					//这个地方的好处就是wx.config配置错误，会弹出窗口哪里错误，然后根据微信文档查询即可。
					wx.error((res) => {
						_this.$dialog.toast({
							mes: '出错了:' + res.errMsg,
							timeout: 2000,
							icon: 'error',
							callback: () => {
								//do something
							}
						})
					})
				}).catch((err) => {
					this.$dialog.toast({
						mes: err,
						timeout: 2000,
						icon: 'error',
						callback: () => {
							//do something
						}
					})
				})
			},
			//根据id获取到user的工厂信息
			getFactoryInfo() {
				let userInfo = this.$store.state.userInfo.account_id ? this.$store.state.userInfo : JSON.parse(util.getCookie('userInfo'))
				let account_id = userInfo.account_id;
				let url = `charge_factory/account/${account_id}`;
				this.$axios.get(url).then((data) => {
					console.log('account_id:' + account_id);
					let res = data.data;
					if (res.code === 200) {
						this.factoryInfo = res.data;
						//派发工厂信息信息给store  id factoryInfo
						this.$store.commit('setFactoryInfo', res.data)
						this.$store.commit('setFactoryId', res.data.factory_id)
						//cookie添加 factoryInfo factory_id
						util.addCookie('factoryInfo', JSON.stringify(res.data), 1)
						util.addCookie('factory_id', JSON.stringify(res.data.factory_id), 1)
						//获取到工厂id时 查询该工厂今日配送信息
						if (res.data.factory_id) {
							this.factory_id = res.data.factory_id;
							console.log('factory_id :' + this.factory_id);
							this.getFactoryToday(this.factory_id)
						}
					} else if(res.code == 400) {
						this.$dialog.toast({
							mes: res.message,
							timeout: 500000000000000000,
							icon: 'error',
							callback: () => {
								//do something
								window.close()
							}
						})
					} else {
						this.$dialog.toast({
							mes: res.message,
							timeout: 2000,
							icon: 'error',
							callback: () => {
								//do something
							}
						})
					}
				})
			},

			//获取工厂今日配送数量
			getFactoryToday(factory_id) {
				let today = 'today'
				let url = `charge_factory/batterys/count?factory_id=${factory_id}&action=${today}`;
				this.$axios.get(url).then((data) => {
					let res = data.data
					if (res.code === 200) {
						this.factoryExpNum = res.data || '没有查询到数据'

					} else {
						this.$dialog.toast({
							mes: res.message,
							timeout: 2000,
							icon: 'error',
							callback: () => {
								//do something
							}
						})
					}
				})
			},

			//扫码
			scanQRCode(n) {
				let _this = this

				wx.ready(() => {
					wx.checkJsApi({
						jsApiList: ['scanQRCode'],
						success: function (res) {
							//
						}
					})

					wx.scanQRCode({
						needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
						scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
						success: (res) => {
							console.log(res);
							let result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
							if(result.indexOf('http') != -1){
								this.$dialog.toast({
									mes: '该二维码不是有效的二维码',
									timeout: 2000,
									callback: () => {
										//do something
									}
								})
								return
							}
							let battery_number = result
							// n=1 低电待充  n=0 满电入库
							//
							localStorage.setItem('s-battery_number', battery_number)
							if(result) {
								this.$router.push({path: `/confir/${n}`})
							}else{
								alert(result)
							}

						}
					})
				})

			},

			//判断适口高度 定位最下面元素
			getViewHeight() {
				let h = document.documentElement.clientHeight
				let obj = {
					position: 'inherit',
				}
				if (h < 520) {
					return obj
				} else {
					return null
				}
			}
		},
		beforeRouteEnter(to, from, next) {
			next()
		},
		beforeRouteLeave(to, from, next) {
			if(to.path == '/login'){
				if(util.isWeiXin()){
					WeixinJSBridge.call('closeWindow');
				}
			}
			next()
		},
		components: {}
	}
</script>

<style lang="less" scoped>
	@color: #00CFB5;
	.batfac {
        height:100%;
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
			height: .4rem;
			width: .4rem;
		}

		.facstate {
			margin: 10px 0;
			clear: both;
			.indexhead {
				border-bottom: 1px solid #ddd;
			}
		}

		.listone {
			box-sizing: border-box;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-wrap: wrap;
			height: 4rem;
			> div {
				width: 50%;
				height: 50%;
				background: #fff;
				display: flex;
				justify-content: center;
				align-items: center;
				&:nth-of-type(even) {
					border-left: 1px solid #ccc;
					border-bottom: 1px solid #ccc;
				}
				&:nth-of-type(odd) {
					border-bottom: 1px solid #ccc;
				}
				&:nth-of-type(3) {
					border-bottom: 0;
				}
				&:nth-of-type(4) {
					border-bottom: 0;
				}
			}
		}

		.county {
			color: @color;
		}

		.saom {
			display: flex;
			justify-content: space-around;
			align-items: center;
			height: 4rem;
			figure {
				text-align: center;
				img {
					height: 1.84rem;
					width: 1.84rem;
				}
				figcaption {
					font-size: .3rem;
					margin-top: .2rem;
				}
			}
		}

		.record {
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 1rem;
			display: flex;
			justify-content: center;
			align-items: center;
			> div {
				color: @color;
				font-size: .28rem;
			}
		}

		.ps_cpt {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 1rem;
			padding: 0 15px;
			background: #fff;
			.ps_left {
				font-size: 17px;
			}
			.ps_right {
				color: @color;
				font-size: 17px;
			}
		}

		.liebiao {
			width: 70%;
			height: 100%;
			display: flex;
			justify-content: space-around;
			align-items: center;
			img {
				height: 20px;
			}
		}

		.lieyou {
			> div:nth-of-type(1) {
				font-size: .3rem;
				margin-bottom: 10px;
			}
			> div:nth-of-type(2) {
				color: @color;
				font-size: .26rem;
			}
		}

		.yd-navbar-item {
			font-size: .34rem;
			img {
				width: .6rem;
				height: .6rem;
				display: block;
				margin: 0 auto .1rem;
			}
		}
	}

</style>
