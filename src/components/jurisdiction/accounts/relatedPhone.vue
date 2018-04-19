<template>
	<div class="login_box">
		<div class="login_up">

		</div>
		<div class="login_accounts">
			<yd-cell-group>
				<yd-cell-item>
					<span slot="left"></span>
					<yd-input slot="right" required v-model="account_name" data-regex="mobile"
					          placeholder="请输入手机号码"></yd-input>
				</yd-cell-item>
				<yd-cell-item>
					<span slot="left"></span>
					<yd-input slot="right" type="password" v-model="account_pass" placeholder="请输入密码"></yd-input>
				</yd-cell-item>
			</yd-cell-group>
		</div>

		<div class="submit">
			<button @click="modifyPassword">绑定</button>
		</div>
	</div>
</template>

<script>
	import util from '../../../assets/js/util'
	import md5 from 'js-md5'

	export default {
		name: "related-phone",
		data() {
			return {
				account_name: '',
				account_pass: '',
				userInfo: this.$store.state.userInfo
			}
		},
		methods: {
			//绑定手机号
			modifyPassword() {
				if(this.account_name == '' ){
					this.$dialog.toast({
						mes: '帐号不能为空！',
						timeout: 1500,
						callback: () => {

						}
					})
					return
				}
				if(this.account_pass == '' ){
					this.$dialog.toast({
						mes: '密码不能为空！',
						timeout: 1500,
						callback: () => {

						}
					})
					return
				}
				//url上取openId
				let openId = this.$route.params.openId
				//绑定手机号 这里应该请求接口绑定帐号
				let url = `http://batteryweb.haolei100.com/bind/wechat`
				let obj = {
					account_name: this.account_name,
					account_pass: md5(this.account_pass).toUpperCase(),
					openId: openId
				}
				this.$axios.post(url, obj).then((data) => {
					console.log(data);
					let res = data.data;
					if(res.status == 'bindWechat'){
						this.$dialog.toast({
							mes: '微信账号被绑定过其他账号，请联系运营人员！',
							timeout: 5000
						})
					}else if(res.status == 'bindAccount'){
						this.$dialog.toast({
							mes: '账号绑定过其他微信号，请联系运营人员！',
							timeout: 5000
						})
					}else if(res.status == 'disable'){
						this.$dialog.toast({
							mes: '账号被禁用，请联系运营人员！',
							timeout: 5000
						})
					}else if(res.status == 'invalid'){
						this.$dialog.toast({
							mes: '密码无效，请重新输入！',
							timeout: 5000
						})
					} else {
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
						this.$store.commit('setUserInfo', userInfo)
						//在Cookie中添加User信息
						util.addCookie('userInfo', JSON.stringify(userInfo), 1)
						//在Cookie中添加token
						util.addCookie('access_token', res.accessToken, 1)

						this.$dialog.toast({
							mes: '绑定成功！',
							timeout: 1500,
							icon: 'success',
							callback: () => {
								//判断有没有设置密码 没有设置密码 则->设置密码
								if (!res.loginCount) {
									this.$dialog.confirm({
										title: '提示',
										mes: '您还未修改初始密码，请先修改！',
										opts: [
											{
												txt: '取消',
												color: false,
												callback: () => {
													//
													console.log(userInfo.account_type);
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
															timeout: 5000,
															callback: () => {
																//do something
															}
														})
													}
												}
											},
											{
												txt: '去修改',
												color: '#157efb',
												callback: () => {
													this.$dialog.loading.open('加载中...')

													setTimeout(() => {
														this.$dialog.loading.close()

														if (userInfo.account_type === 'charge_factory') {
															//配电工厂
															this.$router.replace({path: '/user/password'})
														} else if (userInfo.account_type === 'transporter') {
															//运输员
															this.$router.replace({path: '/user/password'})
														} else if (userInfo.account_type === 'service_station') {
															//服务站
															this.$router.replace({path: '/user/password'})
														} else {
															//
															this.$dialog.toast({
																mes: '您的帐号没有权限，请联系相关人员进行开通！',
																timeout: 5000,
																callback: () => {
																	//do something
																}
															})
														}

													}, 1000)
												}
											}
										]
									})
								}
							}
						})
					}
				})
			},
		}
	}
</script>

<style scoped lang="less">
	.login_box {
		height: 100%;
		background-color: #fff;
		.login_up {
			width: 100%;
			height: 5.51rem;
			background-image: url(../../../assets/img/login_bg.png);
			background-repeat: no-repeat;
			background-position: center;
			background-size: 7.5rem 5.51rem;
		}
		.login_accounts {
			padding-top: 0.2rem;
		}
		.submit {
			display: flex;
			justify-content: center;
			flex-direction: column;
			width: 100%;
			max-width: 750px;
			padding: 0 0.35rem;
			margin-top: 2rem;
			button {
				outline: none;
				border: none;
				width: 100%;
				height: 0.88rem;
				border-radius: 6px;
				background: #02c8b4;
				color: #fff;
				font-size: 0.36rem;
			}
			p {
				margin-top: 2rem;
				text-align: center;
				font-size: 0.24rem;
				color: #666666;
				a {
					color: #02c8b4;
				}
			}
		}
	}
</style>
