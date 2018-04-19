<template>
    <div class="abnormal">
        <yd-cell-group>
            <yd-cell-item>
                <span slot="left">电池编号：</span>
                <span slot="left">{{battery_number}}</span>
            </yd-cell-item>
        </yd-cell-group>
        <yd-cell-group>
            <yd-cell-item arrow type="label">
                <span slot="left">异常情况：</span>
                <select slot="right" v-model="exception_type">
                    <option value="">请选择</option>
                    <option value="外观异常">外观异常</option>
                    <option value="状态异常">状态异常</option>
                </select>
            </yd-cell-item>
            <yd-cell-item>
                <span slot="left">异常描述：</span>
                <yd-textarea v-model="exception_description" slot="right" placeholder="1-50个字"
                             maxlength="50"></yd-textarea>
            </yd-cell-item>
            <yd-cell-item>
                <span slot="left">异常照片：</span>
                <div slot="right" class="add_tuzhi">
                    <div class="add_tuzhi_com">
                        <div class="add_img clearfix">
                            <div class="add_img_list" v-for="(data,index) in imgData" @click="delImg(index)">
                                <img :src="data">
                                <span class="tuzhi_sel"></span>
                            </div>
                            <template v-if="img_loading">
                                <div class="add_img_list">
                                    <p class="map_loading"></p>
                                </div>
                            </template>
                            <div v-else class="upload_file_btn" v-show="num < totalNum">
                                <label for="plus_sent_pic" class="plus_sent_pic">
                                    <div class="tuzhi_add">
                                        <p><span>{{num}}</span>/{{totalNum}}</p>
                                    </div>
                                </label>
                                <input id="plus_sent_pic" type="file" @change="handleFileChange" ref="inputer"
                                       class="trans_file"
                                       accept="image/png, image/jpeg, image/gif, image/jpg" _multiple>
                            </div>
                        </div>
                    </div>
                    <p class="v-upload_txt">上传异常照片(建议)</p>
                </div>
            </yd-cell-item>
        </yd-cell-group>

        <div class="logout" :style="styles">
            <button @click="handleAbnormal">确认</button>
            <button @click="handleCancle" class="cancle">取消</button>
        </div>
    </div>
</template>

<script>
    import EXIF from '../../assets/js/Exif'
    import util from '../../assets/js/util'

    export default {
        //异常反馈
        name: "ser_abn-fee",
        data() {
            return {
                num: 0,  //上传图片数量
                base64: '',  //压缩后的图片
                imgData: [],   //图片  //最后提交这个数据就是base64的buf数组
                data: {base64: ''},
                imgType: 2,     //图片上传的状态  0：图片已经成功上传  1表示图片在上传中 2表示图片还没上传,
                img_loading: false,
                Orientation: '',    //图片的拍摄角度
                totalNum: 4,
                styles: {},
                //上面是图的data
                exception_type: '',
                exception_description: '',
                battery_number: '',
                battery_id: '',
                battery: {},
                exception_order_number: ''
            }
        },
        mounted() {
            //获取电池编号 回填
            let battery = localStorage.getItem('exceptionsBattery') ? localStorage.getItem('exceptionsBattery') : '{}'
            this.battery = JSON.parse(battery)
            console.log('------------------');
            console.log(this.battery);
            this.battery_number = this.battery.battery_number
            this.battery_id = this.battery.battery_id
            let exception_order_number = localStorage.getItem('exception_order_number') ? JSON.parse(localStorage.getItem('exceptionsBattery')).exception_order_number : ''
            this.exception_order_number = exception_order_number


            //高度
            this.styles = this.getViewHeight()
        },
        methods: {
            //提交异常反馈
            handleAbnormal() {
                //提交这个订单
                //获取user
                let userInfo = this.$store.state.userInfo.account_id ? this.$store.state.userInfo : JSON.parse(util.getCookie('userInfo'))
                let account_id = userInfo.account_id

                if (this.exception_type == '' && this.exception_description == '') {
                    this.$dialog.toast({
                        mes: '异常情况不能为空',
                        timeout: 1500,
                        icon: 'error',
                        callback: () => {
                            //do something
                        }
                    })
                    return
                }
                if (this.exception_description == '') {
                    this.$dialog.toast({
                        mes: '异常描述不能为空',
                        timeout: 1500,
                        icon: 'error',
                        callback: () => {
                            //do something
                        }
                    })
                    return
                }
                console.log(this.imgData);
                let url = `battery_exceptions`
                let obj = {
                    record_account_id: account_id,
                    battery_id: this.battery_id,
                    exception_account_id: this.battery.last_account_id, //异常责任人 扫码时电池带过来的信息
                    exception_pictrues: this.imgData, //图
                    exception_type: this.exception_type, //异常类型
                    exception_description: this.exception_description, //异常描述
                    is_scan_code: 1,
                    exception_order_number: this.exception_order_number
                }
                this.$dialog.loading.open('上传中...')
                this.$axios.post(url, obj).then((data) => {
                    console.log(data);
                    let res = data.data
                    if (res.code === 200) {
                        setTimeout(() => {
                            this.$dialog.loading.close()
                            this.$dialog.toast({
                                mes: res.message,
                                timeout: 1500,
                                icon: 'success',
                                callback: () => {
                                    //do something
                                    localStorage.removeItem('exceptionsBattery')
                                    localStorage.removeItem('exception_order_number')
                                    this.$router.go(-1)
                                }
                            })
                        }, 1000)
                    } else {
                        setTimeout(() => {
                            this.$dialog.loading.close()
                            this.$dialog.toast({
                                mes: res.message,
                                timeout: 1500,
                                icon: 'error',
                                callback: () => {
                                    //do something
                                }
                            })
                        }, 1000)
                    }
                })
            },
            //取消异常反馈
            handleCancle() {
                this.$router.go(-1)
            },
            //图片上传压缩等...
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
                            console.log(self.base64);
                            // console.log(self.imgData);
                        }
                    };
                }
            },

            //判断适口高度 定位最下面元素
            getViewHeight() {
                let h = document.documentElement.clientHeight
                let obj = {
                    position: 'inherit',
                    marginTop: '1.5rem'
                }
                if (h < 500) {
                    return obj
                } else {
                    return null
                }
            }
        }
    }
</script>

<style scoped lang="less">
    @color: #00CFB5;
    .yd-textarea {
        border: 1px dotted #dddddd;
        border-radius: 5px;
        margin: 0.2rem 0;
        padding: 0.1rem 0.2rem !important;
    }

    .add_tuzhi {
        width: 100%;
        padding: 0.2rem 0;

        .add_tuzhi_com {
            max-width: 5.4rem;
            height: 100%;

            .add_img {
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                .add_img_list {
                    width: 0.76rem * 1.5;
                    height: 0.76rem * 1.5;
                    border: 1px dotted @color;
                    border-radius: 4px;
                    margin: 0 0.1rem 0.1rem 0;
                    position: relative;

                    .tuzhi_sel {
                        position: absolute;
                        top: -0.1rem;
                        right: -0.1rem;
                        background-image: url(../../assets/img/ico_close.png);
                        background-repeat: no-repeat;
                        background-position: center;
                        background-size: 0.2rem;
                        width: 0.2rem;
                        height: 0.2rem;
                    }

                    img {
                        width: 100%;
                        height: 100%;
                        border-radius: 4px;
                    }

                    .map_loading {
                        background-image: url(../../assets/img/ico_loading.gif);
                        background-repeat: no-repeat;
                        background-position: center;
                        background-size: 50%;
                        width: 100%;
                        height: 100%;
                    }
                }

                .upload_file_btn {
                    flex-wrap: wrap;
                    width: 0.76rem * 1.5;
                    height: 0.76rem * 1.5;
                    border: 1px dotted @color;
                    border-radius: 4px;
                    overflow: hidden;
                    position: relative;
                    .plus_sent_pic {
                        width: 100%;
                        height: 100%;
                        display: inline-block;
                        width: 0.76rem * 1.5;
                        height: 0.76rem * 1.5;
                        background-image: url(../../assets/img/ico_add_upload.png);
                        background-repeat: no-repeat;
                        background-position: center 0.1rem;
                        background-size: 50%;

                        .tuzhi_add {
                            position: absolute;
                            bottom: 0rem;
                            left: 0;
                            width: 100%;
                            text-align: center;
                            font-size: 0.2rem;

                            span {
                                color: @color;
                            }
                        }
                    }
                    //上传按钮
                    input {
                        position: absolute;
                        top: 0;
                        left: 0;
                        z-index: 999;
                        opacity: 0;
                    }
                }
            }

        }
    }

    .logout {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        position: absolute;
        /*left: 0px;*/
        bottom: 1.9rem;
        width: 100%;
        max-width: 750px;
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
        .cancle {
            height: 0.88rem;
            margin-top: 0.4rem;
            border: 1px solid @color;
            border-radius: 6px;
            background: transparent;
            color: @color;
            font-size: 0.36rem;
        }
    }

    .yd-cell-right {
        //文字描述
        .v-upload_txt {
            margin-top: 0.1rem;
            text-align: left;
            color: #666666;
        }
    }
</style>
