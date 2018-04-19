<template>
	<div class="loading-mask">
		<div class="loader font">
			<span>好&nbsp;</span>
			<span class="span3">嘞&nbsp;</span>
			<span class="span4">易&nbsp;</span>
			<span class="span5">换&nbsp;</span>
			<span class="span2">电&nbsp;</span>
			<span class="span6">.&nbsp;</span>
			<span class="span7">.&nbsp;</span>
		</div>
	</div>
</template>

<script>
	import util from '../../../assets/js/util'
	import md5 from 'js-md5'

	export default {
		name: "login",
		data() {
			return {
				account_name: '',
				account_pass: '',
				openId: '',
				urlKey: ''
			}
		},
		created() {
		},
		mounted() {
			//
			this.openId = this.$route.query.openId
			this.urlKey = this.$route.query.key
			console.log('xx openId: ' + this.openId);
			console.log('xx urlKey: ' + this.urlKey);
			this.getUserInfo()
		},
		methods: {
			getUserInfo() {
				//打开loading
				if(! this.openId) {
					this.$dialog.toast({
						mes: '由于网络原因，暂无法和微信服务器通讯，请稍后再试',
						timeout: 20000000000000000000000000000000,
						callback: () => {
							//do something

						}
					})
					return
				}
				let url = `http://batteryweb.haolei100.com/wx/check?openId=${this.openId}`
				this.$axios.get(url).then((data) => {
					console.log(data);

					let res = data.data;
					//data = null 说明用户没有绑定手机号 去绑定页面绑定手机号
					if (res.accessToken == 'unbind') {
						setTimeout(() => {
							//帐号未绑定手机号
							//跳转到绑定手机号页面 /user/relatedphone
							console.log('当前帐号已被绑定，请联系运营人员！');
							this.$router.replace({path: `/user/relatedphone/${this.openId}`})
						}, 2000)
					} else if (res.accessToken == 'error') {
						setTimeout(() => {
							//跳转到绑定手机号页面 /user/relatedphone
							console.log('执行到这了  没有绑定手机号');
							this.$router.replace({path: `/user/relatedphone/${this.openId}`})

						}, 2000)
					} else {
						setTimeout(() => {

							//拿到数据  进行存储  权限判断
							let userInfo = {
								account_id: res.userId,
								account_name: res.userName,
								account_type: res.userType,
								wx_open_id: res.openId,
								openId: res.openId,
								loginCount: res.loginCount,
								access_info: {
									access_token: res.accessToken
								}
							}

							//派发user信息给store
							this.$store.commit('setUserInfo', userInfo);
							//在Cookie中添加User信息
							util.addCookie('userInfo', JSON.stringify(userInfo));
							//在Cookie中添加token
							util.addCookie('access_token', res.accessToken);

							setTimeout( () => {
								if (this.urlKey != 'user') {
									//权限判断
									if (userInfo.account_type === 'charge_factory') {
										//配电工厂
										this.$router.replace({path: '/batFac'})
									} else if (userInfo.account_type === 'transporter') {
										//运输员
										this.$router.replace({path: '/batTra'})
									} else if (userInfo.account_type === 'service_station') {
										//服务站
										this.$router.replace({path: '/serKio'})
									} else {
										//
										this.$dialog.toast({
											mes: '您的帐号没有权限，请联系相关人员进行开通！',
											timeout: 3000,
											callback: () => {
												//do something
											}
										})
									}
								} else {
									this.$router.replace({path: '/user'})
								}
							}, 1000)

						}, 2000)
					}
				}).catch(err => {
					this.$dialog.toast({
						mes: err,
						timeout: 5000,
						icon: 'error',
						callback: () => {
							//do something
						}
					})
				})
			}
		},
		filters: {
			formatDate(time) {
				if (!time) return ' ——'
				var date = new Date(time);
				return formatDate(date, 'yyyy-MM-dd hh:mm')
			}
		},
	}
</script>

<style scoped lang="less">
	.loading-mask {
		width: 100%;
		height: 100%;
		background: #f2f2f2;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 998;
	}

	.loader {
		overflow: hidden;
		font-size: .4rem;
		text-align: center;
		display: inline-block;
		min-width: 1.5rem;
		position: absolute;
		top: 45%;
		left: 50%;
		margin-left: -1rem;
	}

	.loader span {
		-moz-animation: loading 1s linear infinite -0.8s;
		-webkit-animation: loading 1s linear infinite -0.8s;
		animation: loading 1s linear infinite -0.8s;
		float: left;
	}

	.loader .span2 {
		-moz-animation: loading 1s linear infinite -0.2s;
		-webkit-animation: loading 1s linear infinite -0.2s;
		animation: loading 1s linear infinite -0.2s;
	}

	.loader .span3 {
		-moz-animation: loading 1s linear infinite -0.5s;
		-webkit-animation: loading 1s linear infinite -0.5s;
		animation: loading 1s linear infinite -0.5s;
	}

	.loader .span4 {
		-moz-animation: loading 1s linear infinite -1.1s;
		-webkit-animation: loading 1s linear infinite -1.1s;
		animation: loading 1s linear infinite -1.1s;
	}

	.loader .span5 {
		-moz-animation: loading 1s linear infinite -0.36s;
		-webkit-animation: loading 1s linear infinite -0.36s;
		animation: loading 1s linear infinite -0.36s;
	}

	.loader .span6 {
		-moz-animation: loading 1s linear infinite -0.65s;
		-webkit-animation: loading 1s linear infinite -0.65s;
		animation: loading 1s linear infinite -0.65s;
	}

	.loader .span7 {
		-moz-animation: loading 1s linear infinite -0.93s;
		-webkit-animation: loading 1s linear infinite -0.93s;
		animation: loading 1s linear infinite -0.93s;
	}

	.font {
		font-family: "Comic Sans MS", sans-serif;
		font-weight: bold;
		color: #02c8b4;
	}

	@-moz-keyframes loading {
		0%,
		100% {
			-moz-transform: scale(1) rotateZ(0deg);
			transform: scale(1) rotateZ(0deg);
			opacity: 1;
		}
		26% {
			-moz-transform: scale(1.1) rotateZ(12deg);
			transform: scale(1.1) rotateZ(12deg);
			opacity: .2;
		}
		76% {
			-moz-transform: scale(0.8) rotateZ(-8deg);
			transform: scale(0.8) rotateZ(-8deg);
			opacity: .6;
		}
	}

	@-webkit-keyframes loading {
		0%,
		100% {
			-webkit-transform: scale(1) rotateZ(0deg);
			transform: scale(1) rotateZ(0deg);
			opacity: 1;
		}
		26% {
			-webkit-transform: scale(1.1) rotateZ(12deg);
			transform: scale(1.1) rotateZ(12deg);
			opacity: .2;
		}
		76% {
			-webkit-transform: scale(0.8) rotateZ(-8deg);
			transform: scale(0.8) rotateZ(-8deg);
			opacity: .6;
		}
	}

	@keyframes loading {
		0%,
		100% {
			-moz-transform: scale(1) rotateZ(0deg);
			-ms-transform: scale(1) rotateZ(0deg);
			-webkit-transform: scale(1) rotateZ(0deg);
			transform: scale(1) rotateZ(0deg);
			opacity: 1;
		}
		26% {
			-moz-transform: scale(1.1) rotateZ(12deg);
			-ms-transform: scale(1.1) rotateZ(12deg);
			-webkit-transform: scale(1.1) rotateZ(12deg);
			transform: scale(1.1) rotateZ(12deg);
			opacity: .2;
		}
		76% {
			-moz-transform: scale(0.8) rotateZ(-8deg);
			-ms-transform: scale(0.8) rotateZ(-8deg);
			-webkit-transform: scale(0.8) rotateZ(-8deg);
			transform: scale(0.8) rotateZ(-8deg);
			opacity: .6;
		}
	}
</style>
