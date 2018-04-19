<template>
	<div class="user_box">
		<!--根据用户信息显示哪个状态-->
		<div class="user_info" v-if="userInfoMore != null">
			<div class="user_header">
				<img v-if="userInfoMore.img" :src="userInfoMore.img" alt="加载失败">
				<img  v-else :src="headerImg" alt="加载失败">
			</div>
			<!--工厂端-->
			<div class="user_msg" v-if="account_type == 'charge_factory'">
				<p class="user_name">{{userInfoMore.factory_name}}</p>
				<p class="user_num">{{userInfoMore.factory_number}}</p>

			</div>
			<!--运输员-->
			<div class="user_msg" v-else-if="account_type == 'transporter'">
				<p class="user_name">{{userInfoMore.transporter_name}}</p>
				<p class="user_num">{{userInfoMore.transporter_mobile}}</p>
			</div>
			<!--服务亭-->
			<div class="user_msg" v-else-if="account_type == 'service_station'">
				<p class="user_name">{{userInfoMore.service_station_name}}</p>
				<p class="user_num">{{userInfoMore.mobile}}</p>
			</div>
			<div class="user_go" @click="goIndex">
				<yd-icon name="home-outline" style="font-size: 0.4rem"></yd-icon>
			</div>
		</div>
		<div class="user_info" v-else>
			<div class="user_header">
				<img :src="headerImg" alt="加载失败">
			</div>
			<div class="user_msg">
				<p @click="login" slot="right">登录</p>
			</div>
		</div>
		<!--根据用户信息显示哪个状态-->

		<div class="user_lists" v-if="userInfoMore != null">
			<!--工厂端-->
			<yd-cell-group v-if="account_type == 'charge_factory'">
				<yd-cell-item>
					<span slot="left">我的身份</span>
					<span slot="right" class="gray">{{userInfoMore.factory_name}}配电工厂</span>
				</yd-cell-item>
				<yd-cell-item arrow type="link" href="/user/repassword">
					<span slot="left">修改密码</span>
					<span slot="right"></span>
				</yd-cell-item>
			</yd-cell-group>
			<!--运输员-->
			<yd-cell-group v-else-if="account_type == 'transporter'">
				<yd-cell-item>
					<span slot="left">我的身份</span>
					<span slot="right" class="gray">{{userInfoMore.transporter_name}}电池配送员</span>
				</yd-cell-item>
				<yd-cell-item arrow type="link" href="/user/repassword">
					<span slot="left">修改密码</span>
					<span slot="right"></span>
				</yd-cell-item>
				<yd-cell-item arrow type="link" href="/user/deposit">
					<span slot="left">押金状态</span>
					<span slot="right" class="green">{{userInfoMore.deposit}}</span>
				</yd-cell-item>

				<yd-cell-item v-if="userInfoMore.auth_status == null" arrow type="link" href="/user/authentication">
					<span slot="left">认证状态</span>
					<span slot="right">未认证</span>
				</yd-cell-item>
				<yd-cell-item v-if="userInfoMore.auth_status == 'passAudit'" arrow>
					<span slot="left">认证状态</span>
					<span slot="right">已认证</span>
				</yd-cell-item>
				<yd-cell-item v-if="userInfoMore.auth_status == 'toAudit'" arrow>
					<span slot="left">认证状态</span>
					<span slot="right">审核中</span>
				</yd-cell-item>
				<yd-cell-item v-if="userInfoMore.auth_status == 'failAudit'" arrow type="link" href="/user/authentication">
					<span slot="left">认证状态</span>
					<span slot="right">认证失败</span>
				</yd-cell-item>

			</yd-cell-group>
			<!--服务亭-->
			<yd-cell-group v-else-if="account_type == 'service_station'">
				<yd-cell-item>
					<span slot="left">我的身份</span>
					<span slot="right" class="gray">{{userInfoMore.service_station_name}}</span>
				</yd-cell-item>
				<yd-cell-item arrow type="link" href="/user/repassword">
					<span slot="left">修改密码</span>
					<span slot="right"></span>
				</yd-cell-item>
				<yd-cell-item arrow type="link" href="/user/deposit">
					<span slot="left">押金状态</span>
					<span slot="right" class="green" v-if="userInfoMore.deposit">已缴</span>
					<span slot="right" class="red" v-else>未缴</span>
				</yd-cell-item>
			</yd-cell-group>
		</div>
		<div class="logout" v-if="userInfoMore != null">
			<button @click="handleLogout">退出</button>
		</div>
	</div>
</template>

<script>
	let headerImg = require('../../../assets/img/ico_user_header.png')
	import util from '../../../assets/js/util'
	export default {
		name: "index",
		data(){
			return{
				msg: 'user',
				headerImg: headerImg,
				userInfoMore: null,
				account_type: null
			}
		},
		mounted(){
			this.getAccountInfo()
		},
		methods: {
			getAccountInfo(){
				let userInfo = this.$store.state.userInfo.account_id ? this.$store.state.userInfo : (util.getCookie('userInfo') ? JSON.parse(util.getCookie('userInfo')) : '')
				if(userInfo){
					let account_id = userInfo.account_id
					let account_type = userInfo.account_type
					this.account_type = account_type
					//这里应该判断属于什么权限 跳转到什么页面
					if(account_type === 'charge_factory') {
						//配电工厂 /charge_factory/account/{account_id}
						this._axios(`charge_factory/account/${account_id}`)
					}else if(account_type === 'transporter'){
						//运输员 /
						this._axios(`findByAccount/${account_id}`)
					}else if(account_type === 'service_station'){
						//服务站
						this._axios(`stations/account/${account_id}`)
					}
				}else{
					this.userInfoMore = null
				}
			},
			_axios(url, id){
				//根据用户id查询该用户的信息
				this.$axios.get(url).then( (data) => {
					console.log('========');
					let res = data.data
					if(res.code === 200){
						console.log(res);
						this.userInfoMore = res.data

						//派发user信息给store
						this.$store.commit('setUserInfoMore', res.data)
						//在Cookie中添加User信息
						util.addCookie('userInfoMore', JSON.stringify(res.data), 1)
					}else if(res.code == 400){
						this.$dialog.toast({
							mes: res.message,
							timeout: 1000000000000000,
							icon: 'error',
							callback: () => {
								//do something
							}
						})
					}else{
						this.$dialog.toast({
							mes: res.message,
							timeout: 10000,
							icon: 'error',
							callback: () => {
								//do something
							}
						})
					}
				})
			},
			handleLogout(){
				//派发user信息给store
				this.$store.commit('userInfo', {})
				this.$store.commit('setUserInfoMore', {})
				util.delCookie('access_token')
				util.delCookie('factoryInfo')
				util.delCookie('factory_id')
				util.delCookie('userInfo')
				util.delCookie('userInfoMore')
				location.reload()
			},
			goIndex(){
				let userInfo = this.$store.state.userInfo.account_id ? this.$store.state.userInfo : (util.getCookie('userInfo') ? JSON.parse(util.getCookie('userInfo')) : '')
				let account_type = userInfo.account_type
				//权限判断
				if (account_type === 'charge_factory') {
					//配电工厂
					this.$router.replace({path: '/batFac'})
				} else if (account_type === 'transporter') {
					//运输员
					this.$router.replace({path: '/batTra'})
				} else if (account_type === 'service_station') {
					//服务站
					this.$router.replace({path: '/serKio'})
				} else {
					//
					this.$dialog.toast({
						mes: '您的帐号没有权限，请联系相关人员进行开通！',
						timeout: 10000,
						callback: () => {
							//do something
						}
					})
				}

			},
			//登录
			login(){
				location.href = 'http://batteryweb.haolei100.com/wx/action?key=index'
			}
		}
	}
</script>

<style scoped lang="less">
	.user_box{
		position: relative;
		height: 100%;
		.user_info{
			position: relative;
			display: flex;
			align-items: center;
			height: 1.74rem;
			background: url(../../../assets/img/user_bg.png);
			background-size: 100% 100%;
			padding: 0 0.4rem;

			.user_header{
				width: 1.24rem;
				height: 1.24rem;
				border-radius: 100%;
				overflow: hidden;
				img{
					width: 100%;
					height: 100%;
				}
			}
			.user_msg{
				padding-left: 0.24rem;
				p{
					color: #fff;
					font-size: 0.34rem;
				}
				.user_login{
					//_display: none;
				}
				.user_name{
					line-height: 0.6rem;
				}
				.user_num{
					line-height: 0.44rem;
					font-size: 0.24rem;
				}
			}
			.user_go{
				position: absolute;
				right: 0.2rem;
				top: 0.45rem;
				color: #fff;
			}
		}
		//修改右侧内容样式
		.yd-cell-right{
			span{
				font-size: 0.28rem;
			}
			.gray{
				color: #999999;
			}
			.green{
				color: #02c8b4;
			}
		}
		//调整线条边距
		.yd-cell-item:not(:last-child):after{
			margin-left: 0;
		}
		.logout{
			display: flex;
			justify-content: center;
			position: absolute;
			left: 0px;
			bottom: 0.6rem;
			width: 100%;
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
	}
</style>
