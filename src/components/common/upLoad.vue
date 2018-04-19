<template>
	<div class="add_tuzhi add_tuzhi_textarea">
		<div class="add_tuzhi_com mb bg-fff">
			<input id="plus_sent_pic" type="file" @change="handleFileChange" ref="inputer" class="trans_file"
			       accept="image/png, image/jpeg, image/gif, image/jpg" multiple>
			<div class="add_img clearfix">
				<div class="add_img_list" v-for="(data,index) in imgData" @click="delImg(index)">
					<img :src="data">
					<span class="tuzhi_sel"></span>
				</div>
				<template v-if="img_loading">
					<div class="add_img_list">
						<p class="map_loading">图片上传中</p>
					</div>
				</template>
				<template v-else>
					<label for="plus_sent_pic" class="add_img_list" v-if="num<9">
						<div class="tuzhi_add">
							<p><span>{{num}}</span>/{{totalNum}}</p>
						</div>
					</label>
				</template>

			</div>
		</div>
	</div>
</template>
<script>
	import EXIF from '../../assets/js/Exif'

	export default {
		data() {
			return {
				num: 0,  //上传图片数量
				base64: '',  //压缩后的图片
				imgData: [],   //图片
				data: {base64: ''},
				imgType: 2,     //图片上传的状态  0：图片已经成功上传  1表示图片在上传中 2表示图片还没上传,
				img_loading: false,
				Orientation: '',    //图片的拍摄角度
				totalNum: 9
			}
		},
		mounted: function () {
		},
		methods: {
			delImg(id, index) {   //删除图片
				this.imgData.splice(index, 1);
				if (this.num >= 1) {
					this.num -= 1;
				}
			},
			handleFileChange() {  //获取图像
				let that = this;
				let inputDOM = this.$refs.inputer;
				// 通过DOM取文件数据
				for (let i in inputDOM.files) {
					this.file = inputDOM.files[i];
					this.imgPreview(this.file);
					EXIF.getData(this.file, function () {
						that.Orientation = EXIF.getTag(this, 'Orientation');
					});
				}
			},
			imgPreview(file) {   //base64 格式
				this.imgType = 1;
				this.img_loading = true;
				let self = this;
				let imgContent = {};
				imgContent.name = file.name;
				// 看支持不支持FileReader
				if (!file || !window.FileReader) return;

				if (/^image/.test(file.type)) {
					// 创建一个reader
					var reader = new FileReader();
					// 将图片将转成 base64 格式
					reader.readAsDataURL(file);
					// 读取成功后的回调
					reader.onloadend = function () {
						let IMG = new Image();
						IMG.src = this.result;
						IMG.onload = function () {
							let w = this.naturalWidth,
								h = this.naturalHeight,
								resizeW = 0,
								resizeH = 0;
							//压缩设置
							let maxSize = {
								width: 1280,      //图片最大宽度
								height: 1280,     //图片最大高度
								level: 0.6       //图片保存质量
							};
							//计算缩放比例
							if (w > maxSize.width || h > maxSize.height) {
								let multiple = Math.max(w / maxSize.width, h / maxSize.height);
								resizeW = w / multiple;
								resizeH = h / multiple;
							} else {
								resizeW = w;
								resizeH = h;
							}
							let canvas = document.createElement("canvas"),
								cxt = canvas.getContext('2d');
							//根据拍摄的角度进行图片旋转调整
							if (self.Orientation == 3) {
								canvas.width = resizeW;
								canvas.height = resizeH;
								cxt.rotate(Math.PI);
								cxt.drawImage(IMG, 0, 0, -resizeW, -resizeH)
							} else if (self.Orientation == 8) {
								canvas.width = resizeH;
								canvas.height = resizeW;
								cxt.rotate(Math.PI * 3 / 2);
								cxt.drawImage(IMG, 0, 0, -resizeW, resizeH)
							} else if (self.Orientation == 6) {
								canvas.width = resizeH;
								canvas.height = resizeW;
								cxt.rotate(Math.PI / 2);
								cxt.drawImage(IMG, 0, 0, resizeW, -resizeH)
							} else {
								canvas.width = resizeW;
								canvas.height = resizeH;
								cxt.drawImage(IMG, 0, 0, resizeW, resizeH)
							}
							//base64,最终输出的压缩文件
							self.base64 = canvas.toDataURL('image/jpeg', maxSize.level);
							self.num += 1;
							self.imgType = 0;
							self.img_loading = false;
							self.imgData.push(self.base64)
							console.log(self.imgData);
						}
					};
				}
			}
		}
	}
</script>
<style scoped lang="less">
	.clearfix{
		overflow: hidden;
	}
	.add_tuzhi {
		height: 100%;
		overflow-y: scroll;
		//padding-bottom: 0.2rem;
	}

	.trans_file {
		display: none;
	}

	.add_img {
		padding: 0.2rem;
	}
	//图片大小
	.add_img_list {
		float: left;
		width: 1.2rem;
		height: 1.2rem;
		position: relative;
		margin: 0.1rem;
		box-sizing: border-box;
		border: 1px #dedede dashed;
	}

	.add_img_list img {
		width: 100%;
		height: 100%;
	}

	.add_img_list .tuzhi_sel {
		position: absolute;
		width: 0.35rem;
		height: 0.35rem;
		right: -0.1rem;
		top: -0.1rem;
		border-radius: 100%;
		background: url(../../assets/img/ico_close.png) #fff;
		background-size: 100% 100%;
	}

	.add_img_list .tuzhi_add {
		display: block;
		width: 100%;
		height: 100%;
		position: relative;
		background-image: url(../../assets/img/ico_add.png);
		background-repeat: no-repeat;
		background-position: center 10%;
		background-size: 80% 80%;
	}

	.add_img_list .tuzhi_add p {
		position: absolute;
		bottom: 0;
		width: 100%;
		color: #ccc;
		font-size: 0.26rem;
		text-align: center;
	}

	.add_img_list .map_loading {
		width: 100%;
		text-align: center;
		height: 100%;
		line-height: 1.2rem;
		color: #333;
		font-size: 0.2rem;
		border: 1px #dedede dashed;
	}

</style>