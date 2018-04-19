<template>
	<div class="autt_box">
		<yd-cell-group>
			<yd-cell-item>
				<span slot="left">输入初始密码：</span>
				<yd-input slot="right" type="password" v-model="old_pass" placeholder="6位数字组合"></yd-input>
			</yd-cell-item>
			<yd-cell-item>
				<span slot="left">输入新密码：</span>
				<yd-input slot="right" type="password" v-model="new_pass" placeholder="6位数字组合"></yd-input>
			</yd-cell-item>
			<yd-cell-item>
				<span slot="left">请再次输入：</span>
				<yd-input slot="right" type="password" v-model="new_re_pass" placeholder="6位数字组合"></yd-input>
			</yd-cell-item>
		</yd-cell-group>
		<div class="submit">
			<button @click="handleSubmit">提交</button>
		</div>
	</div>
</template>

<script>
	import util from '../../../assets/js/util'
	import md5 from 'js-md5'
	export default {
		name: 'authentication',
		data(){
			return{
				old_pass: '',
				new_pass: '',
				new_re_pass: ''
			}
		},
		methods: {
			handleSubmit(){
				console.log('==========');
				console.log(util.getCookie('access_token'));
				console.log('==========');
				if(this.new_pass != this.new_re_pass){
					this.$dialog.toast({
						mes: '两次输入的密码必须一致！',
						timeout: 1500,
						icon: 'error',
						callback: () => {

						}
					})
					return
				}
				//绑定手机号 这里应该请求接口绑定帐号
				let url = `accounts/action/password`
				let obj = {
					old_pass: md5(this.old_pass).toUpperCase(),
					new_pass: md5(this.new_pass).toUpperCase()
				}
				this.$axios.put(url, obj).then((data) => {
					console.log(data);
					let res = data.data;
					if(res.code == 200){
						this.$dialog.toast({
							mes: '修改成功！',
							timeout: 1500,
							icon: 'success',
							callback: () => {
								this.$dialog.loading.open('加载中...')
								setTimeout(() => {
									this.$dialog.loading.close()
									let account_type = this.$store.state.userInfo.account_type || JSON.parse(util.getCookie('userInfo')).account_type
									console.log(account_type);
									//这里应该判断属于什么权限 跳转到什么页面
									if(account_type === 'charge_factory') {
										//配电工厂
										this.$router.push({path: '/batFac'})
									}else if(account_type === 'transporter'){
										//运输员
										this.$router.push({path: '/batTra'})
									}else if(account_type === 'service_station'){
										//服务站
										this.$router.push({path: '/serKio'})
									}else{
										console.log('没有拿到account_type 或 account_type 为空？？？');
									}
								}, 1000)
							}
						})
					}else if(res.code == 400){
						this.$dialog.toast({
							mes: res.message,
							timeout: 1500,
							icon: 'error',
							callback: () => {
								console.log(res)
							}
						})
					}else{
						this.$dialog.toast({
							mes: res.message,
							timeout: 10000,
							icon: 'error',
							callback: () => {
								console.log(res)
							}
						})
					}

				})
			}
		},
		components: {

		}
	}
</script>

<style scoped lang="less">
	.autt_box{
		height: 100%;

		.submit{
			display: flex;
			justify-content: center;
			flex-direction: column;
			width: 100%;
			margin-top: 0.88rem;
			padding: 0 0.35rem;
			button{
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

		//调整线条边距
		.yd-cell-item:not(:last-child):after{
			margin-left: 0;
		}
	}
</style>
