<template>
	<div class="autt_box">
		<p class="autt_disc">{{disc}}</p>
		<div v-show="!showModal">
			<yd-cell-group>
				<yd-cell-item>
					<span slot="left">手机号：</span>
					<input type="text" slot="right" v-model="courier_mobile" placeholder="请输入手机号码" disabled>
					<!-- ↓↓关键代码是这里↓↓ -->
					<yd-sendcode slot="right"
					             init-str="获取验证码"
					             v-model="start"
					             @click.native="sendCode"
					             type="warning"
					></yd-sendcode> <!--storage-key="locked"-->
					<!--storage-key 页面刷新保存已发送状态-->
					<!-- ↑↑关键代码是这里↑↑ -->
				</yd-cell-item>
				<yd-cell-item>
					<span slot="left">验证码：</span>
					<yd-input slot="right" type="text" v-model="code" placeholder="请输入4位手机验证码"></yd-input>
				</yd-cell-item>
			</yd-cell-group>
			<div class="submit">
				<button @click="handleNext">下一步</button>
			</div>
		</div>
		<div v-show="showModal">
			<yd-cell-group>
				<yd-cell-item>
					<span slot="left">输入新密码：</span>
					<yd-input slot="right" type="password" v-model="password" placeholder="6位数字组合"></yd-input>
				</yd-cell-item>
				<yd-cell-item>
					<span slot="left">请再次输入：</span>
					<yd-input slot="right" type="password" v-model="repassword" placeholder="6位数字组合"></yd-input>
				</yd-cell-item>
			</yd-cell-group>
			<div class="submit">
				<button @click="handleSubmit">确认</button>
			</div>
		</div>
	</div>
</template>

<script>
	import util from '../../../assets/js/util'

	export default {
		name: 'authentication',
		data() {
			return {
				courier_mobile: '',  //手机号
				code: '', //验证码
				disc: '第一步  手机号验证',
				start: false,
				password: '',
				repassword: '',
				showModal: false,
			}
		},
		mounted() {
			let userInfo = this.$store.state.userInfo.account_id ? this.$store.state.userInfo : (util.getCookie('userInfo') ? JSON.parse(util.getCookie('userInfo')) : '')
			let courier_mobile = userInfo.account_name.substring(0, 3) + '****' + userInfo.account_name.substring(7)
			this.courier_mobile = courier_mobile
		},
		methods: {
			//发送验证码
			sendCode() {
				//手机号为空不能发送
				if (!this.courier_mobile) {
					this.$dialog.toast({
						mes: '请输入手机号',
						timeout: 2000,
						callback: () => {
							this.$dialog.loading.close()
						}
					})
					return
				}
				if (this.courier_mobile.length < 11) {
					this.$dialog.toast({
						mes: '请输入正确的手机号码',
						timeout: 2000,
						callback: () => {
							this.$dialog.loading.close()
						}
					})
					return
				}
				//发送
				this.$dialog.loading.open('发送中...')
				this.start = true
				setTimeout(() => {
					let url = `mobile`
					this.$axios.get(url).then((data) => {
						this.$dialog.loading.close()

						console.log(data);
						if (data.data.code == 200) {
							this.$dialog.toast({
								mes: '验证码发送成功',
								timeout: 1500,
								icon: 'success',
								callback: () => {
									//do something
									console.log('验证码发送成功');
								}
							})
						} else {
							this.$dialog.toast({
								mes: data.data.message,
								timeout: 1500,
								icon: 'error',
								callback: () => {
									//do something
									console.log('验证码没有发送成功');
								}
							})
						}
					}).catch((err) => {
						this.$dialog.loading.close()
						this.$dialog.toast({
							mes: err,
							timeout: 3000,
							icon: 'error',
							callback: () => {
								console.log('异常捕获');
								//do something
							}
						})
					})
				}, 1000)
			},
			handleNext() {
				if (!this.courier_mobile) {
					this.$dialog.toast({
						mes: '请输入手机号',
						timeout: 2000,
						callback: () => {
							this.$dialog.loading.close()
						}
					})
					return
				}
				if (this.courier_mobile.length < 11) {
					this.$dialog.toast({
						mes: '请输入正确的手机号码',
						timeout: 2000,
						callback: () => {
							this.$dialog.loading.close()
						}
					})
					return
				}
				if (!this.code) {
					this.$dialog.toast({
						mes: '请输入验证码',
						timeout: 2000,
						callback: () => {
							this.$dialog.loading.close()
						}
					})
					return
				}

				this.showModal = !this.showModal
				this.disc = '第二步  设置新密码'
			},
			//提交 修改密码
			handleSubmit() {
				if (this.password !== this.repassword) {
					this.$dialog.toast({
						mes: '两次输入的密码不一致，请重新输入',
						timeout: 1500,
						callback: () => {
							//do something
						}
					})
					return
				}

				this.$dialog.loading.open('发送中...')


				let url = `password/${this.code}/${this.repassword}`
				this.$axios.put(url).then((data) => {
					this.$dialog.loading.close()
					console.log(data);
					let res = data.data
					if (res.code === 200) {
						//判断验证码对不对  如果验证码不对 则要返回第一步
						//xxxxxxxxxxx
						this.$dialog.toast({
							mes: res.data,
							timeout: 1500,
							icon: 'success',
							callback: () => {
								//修改成功do something
								let account_type = this.$store.state.userInfo.account_type || JSON.parse(util.getCookie('userInfo')).account_type
								console.log(account_type);
								//这里应该判断属于什么权限 跳转到什么页面
								if (account_type == 'charge_factory') {
									//配电工厂
									this.$router.push({path: '/batFac'})
								} else if (account_type == 'transporter') {
									//运输员
									this.$router.push({path: '/batTra'})
								} else if (account_type == 'service_station') {
									//服务站
									this.$router.push({path: '/serKio'})
								} else {
									console.log('没有拿到account_type 或 account_type 为空？？？');
								}
							}
						})

					} else {
						this.$dialog.toast({
							mes: res.message,
							timeout: 10000,
							icon: 'error',
							callback: () => {
								//do something

								this.showModal = !this.showModal
								this.disc = '第一步  手机号验证'
							}
						})
					}
				})


			}
		},
		components: {}
	}
</script>

<style scoped lang="less">
	.autt_box {
		height: 100%;

		.autt_disc {
			height: 0.88rem;
			line-height: 0.88rem;
			text-align: center;
			color: #999;
			font-size: 0.3rem;
		}

		.submit {
			display: flex;
			justify-content: center;
			flex-direction: column;
			width: 100%;
			margin-top: 0.88rem;
			padding: 0 0.35rem;
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
		}

		//修改按钮状态
		.yd-btn-warning {
			background-color: #fff;
			color: #02c8b4;
			border: 1px solid #02c8b4;
		}
		.yd-btn-disabled {
			color: #fff;
		}
		//调整线条边距
		.yd-cell-item:not(:last-child):after {
			margin-left: 0;
		}
	}
</style>