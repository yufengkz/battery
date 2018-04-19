<template>
	<div class="autt_box">
		<yd-cell-group>
			<yd-cell-item>
				<span slot="left">真实姓名&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
				<input slot="right" v-model="realName" type="text" placeholder="请输入您的真实姓名">
			</yd-cell-item>
			<yd-cell-item>
				<span slot="left">身份证号&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
				<input slot="right" v-model="cidNumber" type="text" placeholder="请输入您的身份证号">
			</yd-cell-item>
		</yd-cell-group>
		<div class="upload_box">
			<div class="upload_list">
				<div class="upload_left"></div>
				<div class="upload_right">
					<div class="up_add">
						<img v-if="imagePath.cardFront" :src="imagePath.cardFront" alt="">
						<input id="cardFront" @change="doUpload" type="file"
						       accept="image/png, image/jpeg, image/gif, image/jpg"/>
					</div>
				</div>
			</div>
			<div class="upload_list">
				<div class="upload_left left_up_reverce"></div>
				<div class="upload_right right_up_reverce">
					<div class="up_add">
						<img v-if="imagePath.cardObverse" :src="imagePath.cardObverse" alt="">
						<input id="cardObverse" @change="doUpload" type="file"
						       accept="image/png, image/jpeg, image/gif, image/jpg"/>
					</div>
				</div>
			</div>
			<div class="upload_list">
				<div class="upload_left left_up_hold"></div>
				<div class="upload_right right_up_hold">
					<div class="up_add">
						<img v-if="imagePath.handCard" :src="imagePath.handCard" alt="">
						<input id="handCard" @change="doUpload" type="file"
						       accept="image/png, image/jpeg, image/gif, image/jpg"/>
					</div>
				</div>
			</div>
		</div>
		<div class="submit" :style="styles">
			<button @click="handleSubmit">提交</button>
			<p>仅用于身份验证，不会泄露用户信息，请放心认证。</p>
		</div>
		<Tip :showInfo="showInfo" v-on:close="closeFn" v-if="mdShow"></Tip>
	</div>
</template>

<script>
	import Tip from '../../common/Tip'
	import util from '../../../assets/js/util'

	export default {
		name: 'authentication',
		data() {
			return {
				showInfo: {
					title: '提交成功，请耐心等待',
					disc: '仅用于身份验证，不会泄露用户信息，请放心认证。',
					tel: '400-1234-0987'
				},
				mdShow: false,
				styles: {},

				//
				realName: '',
				cidNumber: '',
				imagePath: {
					cardFront: '',
					cardObverse: '',
					handCard: ''
				},
				id: '',
				orientation: 0
			}
		},
		mounted() {
			//判断适口高度 定位最下面元素
			this.styles = this.getViewHeight()

		},
		methods: {
			handleSubmit() {

				//判断不能为空
				if (this.realName == '') {
					this.$dialog.toast({
						mes: '姓名不能为空',
						timeout: 2000,
						icon: 'error',
						callback: () => {
							//do something
						}
					})
					return
				}
				if (this.cidNumber == '' && this.cidNumber.length < 15) {
					this.$dialog.toast({
						mes: '身份证号不能为空',
						timeout: 2000,
						icon: 'error',
						callback: () => {
							//do something
						}
					})
					return
				}
				if (this.cidNumber.length < 15) {
					this.$dialog.toast({
						mes: '身份证号位数不对',
						timeout: 2000,
						icon: 'error',
						callback: () => {
							//do something
						}
					})
					return
				}
				//
				if (this.imagePath.cardFront == '') {
					this.$dialog.toast({
						mes: '身份证正面不能为空',
						timeout: 2000,
						icon: 'error',
						callback: () => {
							//do something
						}
					})
					return
				}
				if (this.imagePath.cardObverse == '') {
					this.$dialog.toast({
						mes: '身份证反面不能为空',
						timeout: 2000,
						icon: 'error',
						callback: () => {
							//do something
						}
					})
					return
				}
				this.$dialog.loading.open('发送中....')
				let userInfo = this.$store.state.userInfo.account_id ? this.$store.state.userInfo : JSON.parse(util.getCookie('userInfo'))
				let account_id = userInfo.account_id
				let url = `authRealName`
				let obj = {
					account_id: account_id,
					realName: this.realName,
					cidNumber: this.cidNumber,
					cardFront: this.imagePath.cardFront,
					cardObverse: this.imagePath.cardObverse,
					handCard: this.imagePath.handCard,
				}
				this.$axios.post(url, obj).then((data) => {
					setTimeout( () => {
						this.$dialog.loading.close()
						console.log(data);
						let res = data.data
						if (res.code == 200) {
							this.mdShow = true

							this.$dialog.toast({
								mes: res.message,
								timeout: 1500,
								icon: 'success',
								callback: () => {
									//do something
									this.$router.go(-1)
								}
							})

						} else {
							this.$dialog.toast({
								mes: res.message,
								timeout: 5000,
								icon: 'error',
								callback: () => {
									//do something
								}
							})
						}
					}, 1000)
				})
			},
			closeFn() {
				console.log('gggg');
				this.mdShow = false
			},


			//图片上传
			doUpload(e) {
				this.$dialog.loading.open('图片压缩中...')
				var that = this;
				this.id = e.target.getAttribute('id')
				var files = e.target.files[0];
				if (!files.type.match(/(jpeg|jpg|gif|bmp|png)$/i)) {
					that.$dialog.loading.close()
					this.$dialog.toast({
						mes: '图片格式不正确',
						timeout: 1500
					})
					return;
				}
				if (files) {
					var url = this.getObjectURL(files);
					this.press(url);
				}
			},
			//检测安卓、苹果设备
			checkDevice() {
				var u = navigator.userAgent;
				var ua = navigator.userAgent.toLowerCase();
				var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
				var isIos = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
				if (isAndroid) {
					// this.$refs.photos.removeAttribute("capture");
				} else if (isIos) {
					this.$refs.photos.removeAttribute("capture");
					this.$refs.photos.removeAttribute("accept");
				}
			},
			//图片文件转换成blob地址
			getObjectURL(file) {
				this.getOrientation(file, (orientation) => {
					console.log(orientation);
					this.orientation = orientation
				})
				var url = null;
				if (window.createObjectURL != undefined) {  // basic
					url = window.createObjectURL(file);
				} else if (window.URL != undefined) {       // mozilla(firefox)
					url = window.URL.createObjectURL(file);
				} else if (window.webkitURL != undefined) { // web_kit or chrome
					url = window.webkitURL.createObjectURL(file);
				}
				return url;
			},
			//图片压缩
			press(url) {
				var that = this;
				var canvas = document.createElement('canvas');
				var ctx = canvas.getContext('2d');
				var img = new Image();
				img.crossOrigin = 'Anonymous';
				img.onload = function () {
					var width = img.width;
					var height = img.height;
					// 按比例压缩4倍
					var rate = (width < height ? width / height : height / width) / 4

					//判断图片拍摄方向是否旋转了90度
					if (that.orientation == 6) {
						canvas.width = height;
						canvas.height = width;
						ctx.save();//保存状态
						//ctx.translate(width / 2, height / 2);//设置画布上的(0,0)位置，也就是旋转的中心点
						ctx.rotate(90 * Math.PI / 180);//把画布旋转90度
						// 执行Canvas的drawImage语句
						ctx.drawImage(img, 0, - height, width , height) //把图片绘制在画布translate之前的中心点，
						ctx.restore();//恢复状态
					} else {
						// 执行Canvas的drawImage语句
						canvas.width = width * rate;
						canvas.height = height * rate;
						ctx.drawImage(img, 0, 0, width * rate, height * rate)
					}

					var dataURL = canvas.toDataURL('image/png');
					canvas = null;
					that.imagePath[that.id] = dataURL;
					console.log(that.imagePath);
					setTimeout(() => {
						that.$dialog.loading.close()
					}, 300)
				};
				img.src = url;
			},
			//获取角度
			getOrientation(file, callback) {
				var reader = new FileReader();
				reader.onload = function (e) {

					var view = new DataView(e.target.result);
					if (view.getUint16(0, false) != 0xFFD8) return callback(-2);
					var length = view.byteLength, offset = 2;
					while (offset < length) {
						var marker = view.getUint16(offset, false);
						offset += 2;
						if (marker == 0xFFE1) {
							if (view.getUint32(offset += 2, false) != 0x45786966) return callback(-1);
							var little = view.getUint16(offset += 6, false) == 0x4949;
							offset += view.getUint32(offset + 4, little);
							var tags = view.getUint16(offset, little);
							offset += 2;
							for (var i = 0; i < tags; i++)
								if (view.getUint16(offset + (i * 12), little) == 0x0112)
									return callback(view.getUint16(offset + (i * 12) + 8, little));
						}
						else if ((marker & 0xFF00) != 0xFF00) break;
						else offset += view.getUint16(offset, false);
					}
					return callback(-1);
				};
				reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
			},


			//判断适口高度 定位最下面元素
			getViewHeight() {
				let h = document.documentElement.clientHeight
				let obj = {
					position: 'inherit',
				}
				if (h < 500) {
					return obj
				} else {
					return null
				}
			}
		},
		components: {
			Tip
		}
	}
</script>

<style scoped lang="less">
	.autt_box {
		position: relative;
		height: 100%;
		.upload_box {
			padding: 0 0.2rem;
			.upload_list {
				display: flex;
				align-items: center;
				justify-content: center;
				height: 2.04rem;
				border-radius: 10px;
				background: #fff;
				border: 2px dashed #cccccc;
				margin-bottom: 0.2rem;
				.upload_left {
					flex: 1;
					height: 100%;
					background-image: url('../../../assets/img/identity1.png');
					background-position: center;
					background-repeat: no-repeat;
					background-size: 1.84rem 1.14rem;
				}
				//反面
				.left_up_reverce {
					background-image: url('../../../assets/img/identity2.png');
				}
				//手持
				.left_up_hold {
					background-image: url('../../../assets/img/identity3.png');
					background-size: 1.68rem 1.88rem;
				}
				.upload_right {
					position: relative;
					flex: 1;
					height: 100%;
					background-image: url('../../../assets/img/upload_upright.png');
					background-repeat: no-repeat;
					background-position: center;
					background-size: 1.84rem 1.14rem;

					.up_add {
						width: 100%;
						height: 100%;
						display: flex;
						align-items: center;
						justify-content: center;
						img {
							width: 80%;
							height: 100%;
							background-color: #fff;
						}
						input {
							position: absolute;
							top: 0;
							left: 0;
							z-index: 1;
							width: 100%;
							height: 100%;
							opacity: 0;
						}
					}
				}
				//反面
				.right_up_reverce {
					background-image: url('../../../assets/img/upload_reverce.png');
				}
				//手持
				.right_up_hold {
					background-image: url('../../../assets/img/upload_hold.png');
				}
			}
		}
		.submit {
			display: flex;
			justify-content: center;
			flex-direction: column;
			margin-top: 1rem;
			width: 100%;
			padding: 0 0.35rem;
			position: absolute;
			bottom: 0;
			left: 0;

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
				margin-top: 1rem;
				padding-bottom: 0.2rem;
				text-align: center;
				font-size: 0.24rem;
				color: #666666;
			}
		}
		//调整线条边距
		.yd-cell-item:not(:last-child):after {
			margin-left: 0;
		}
	}
</style>