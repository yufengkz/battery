<template>
	<div class="autt_box">
		<yd-cell-group>
			<yd-cell-item>
				<span slot="left">真实姓名&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
				<input slot="right" type="text" placeholder="" v-model="name" disabled>
			</yd-cell-item>
			<yd-cell-item>
				<span slot="left">押金金额&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
				<input slot="right" type="text" placeholder="" v-model="deposit" disabled>
				<button @click="handleClick" class="v-btn" slot="right">退押金</button>
			</yd-cell-item>
		</yd-cell-group>
		<Tip :showInfo="showInfo" v-on:close="closeFn" v-if="mdShow"></Tip>
	</div>
</template>

<script>
	import Tip from '../../common/Tip'
	import util from '../../../assets/js/util'

	export default {
		name: 'deposit',
		data() {
			return {
				showInfo: {
					fontSize: '0.3rem',
					title: '您好，如需申请退押金，请联系客服',
					tel: '400-1234-0987',
				},
				mdShow: false,
				//
				name: '',
				deposit: '',
				userInfoMore: ''
			}
		},
		mounted() {
			this.getAccountInfo()
		},
		methods: {
			getAccountInfo() {
				let userInfo = this.$store.state.userInfo.account_id ? this.$store.state.userInfo : (util.getCookie('userInfo') ? JSON.parse(util.getCookie('userInfo')) : '')
				if (userInfo) {
					let account_id = userInfo.account_id
					let account_type = userInfo.account_type
					this.account_type = account_type
					//这里应该判断属于什么权限 跳转到什么页面
					if (account_type === 'charge_factory') {
						//配电工厂 /charge_factory/account/{account_id}
						this._axios(`charge_factory/account/${account_id}`, account_type)
					} else if (account_type === 'transporter') {
						//运输员 /
						this._axios(`findByAccount/${account_id}`, account_type)
					} else if (account_type === 'service_station') {
						//服务站
						this._axios(`stations/account/${account_id}`, account_type)
					}
				} else {
					this.userInfoMore = null
				}
			},
			_axios(url, account_type) {
				//根据用户id查询该用户的信息
				this.$axios.get(url).then((data) => {
					console.log('========');
					let res = data.data
					if (res.code === 200) {
						console.log(res);
						this.userInfoMore = res.data

						if (account_type === 'charge_factory') {
							//配电工厂 /charge_factory/account/{account_id}
							this.name = res.data.account_name
							this.deposit = res.data.deposit || 0
						} else if (account_type === 'transporter') {
							//运输员 /
							this.name = res.data.transporter_name
							this.deposit = res.data.deposit || 0
						} else if (account_type === 'service_station') {
							//服务站
							this.name = res.data.service_station_name
							this.deposit = res.data.deposit || 0
						}

						//派发user信息给store
						//this.$store.commit('setUserInfoMore', res.data)
						//在Cookie中添加User信息
						//util.addCookie('userInfoMore', JSON.stringify(res.data), 1)
					} else if (res.code == 400) {
						this.$dialog.toast({
							mes: res.message,
							timeout: 100000000000000000000,
							icon: 'error',
							callback: () => {
								//do something
							}
						})
					} else {
						this.$dialog.toast({
							mes: res.message,
							timeout: 3000,
							icon: 'error',
							callback: () => {
								//do something
							}
						})
					}
				})
			},
			//退押金
			handleClick() {
				this.mdShow = true
			},
			//关闭Tip
			closeFn() {
				this.mdShow = false
			}
		},
		components: {
			Tip
		}
	}
</script>

<style scoped lang="less">
	.autt_box {
		height: 100%;

		.v-btn {
			outline: none;
			border: 1px solid #02c8b4;
			padding: 5px 0.2rem;
			border-radius: 6px;
			color: #02c8b4;
		}

		//调整线条边距
		.yd-cell-item:not(:last-child):after {
			margin-left: 0;
		}
	}
</style>