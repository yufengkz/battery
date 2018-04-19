<template>
    <div class="batIndex">
        <!--电池汇总列表 标题-->
        <div class="facstate">
            <div class="indexhead">
                <div class="head_left">
                    电池汇总(块)
                </div>
            </div>
            <!--电池汇总列表-->
            <div class="listone">
                <div>
                    <div class="liebiao">
                        <div class="liezuo">
                            <img src="../../assets/img/432x.png">
                        </div>
                        <div class="lieyou">
                            <div>电池总量</div>
                            <div>{{transporterInfo.total}}</div>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="liebiao">
                        <div class="liezuo">
                            <img src="../../assets/img/battra_03.png" alt="">
                        </div>
                        <div class="lieyou">
                            <div>待配送</div>
                            <div>{{transporterInfo.waitTransport}}</div>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="liebiao">
                        <div class="liezuo">
                            <img src="../../assets/img/battra_07.png" alt="">
                        </div>
                        <div class="lieyou">
                            <div>已回收</div>
                            <div>{{transporterInfo.backed}}</div>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="liebiao">
                        <div class="liezuo">
                            <img src="../../assets/img/452x.png" alt="">
                        </div>
                        <div class="lieyou">
                            <div>电池异常</div>
                            <div>{{transporterInfo.exceptionCount}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!--今日预计配送-->
        <div class="ps_cpt" @click="transToday(transporterInfo.preTransport)">
            <div class="ps_left">今日预计配送:</div>
            <div class="ps_right">{{transporterInfo.preTransport}}</div>
        </div>
        <!--扫码-->
        <div class="saom">
            <figure @click="scanQRCode(1)" class="sm_left">
                <div><img src="../../assets/img/462x.png" alt="低电待充"></div>
                <figcaption>低电待充</figcaption>
            </figure>
            <figure @click="scanQRCode(0)" class="sm_right">
                <div><img src="../../assets/img/462x.png" alt="满电入库"></div>
                <figcaption>满电入库</figcaption>
            </figure>
            <figure @click="startTrans" class="sm_right">
                <div><img src="../../assets/img/battra_11.png" :alt="transporter_status"></div>
                <figcaption :class="[transporter_status=='配送中'?'blue':'']">开始配送</figcaption>
            </figure>
        </div>
        <!--入库记录-->
        <div class="record" :style="styles">
            <router-link to="/batTra/warRec1" tag="div">入库记录</router-link>
            <router-link to="/batTra/distribution" tag="div">配送记录</router-link>
        </div>
    </div>
</template>

<script>
    import util from '../../assets/js/util'
    import wx from 'weixin-js-sdk'

    export default {
        name: "battery-index",
        data() {
            return {
                styles: {},
                transporterInfo: {
                    total: 0,
                    waitTransport: 0,
                    backed: 0,
                    exceptionCount: 0,
                    preTransport: 0
                },
                transporter_id: "" || null,
                transporter_name: "",
                transporter_status:"开始配送",
                blue_black:""
            }
        },
        computed: {
            isLoading() {
                return this.$store.state.isLoading
            }
        },
        mounted() {
	        this._wxConfig()
            this.styles = this.getViewHeight();
            this.getTransporterInfo()
        },
        methods: {
            //获取微信配置文件
            _wxConfig() {
                let _this = this;
                let root = '';//encodeURIComponent(window.location.href.split('#')[0])
                let url = `http://batteryweb.haolei100.com/wx/config?pathName=${root}`
                this.$axios.get(url).then((data) => {
                    let res = data.data;
                    // console.log('========');
                    // console.log(data);
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
                            timeout: 3000,
                            icon: 'error',
                            callback: () => {
                                //do something
                            }
                        })
                    })
                }).catch((err) => {
                    this.$dialog.toast({
                        mes: err,
                        timeout: 3000,
                        icon: 'error',
                        callback: () => {
                            //do something
                        }
                    })
                })
            },
            //	获取运输员信息
            getTransporterInfo() {
                let userInfo = this.$store.state.userInfo.account_id ? this.$store.state.userInfo : JSON.parse(util.getCookie('userInfo'));
                let account_id = userInfo.account_id;
                setTimeout(() => {
	                //获取运输员ID
	                let transporter_id = localStorage.getItem("transporter_id");
	                if(! transporter_id) return this.getTransporterInfo()
	                //获取运输员ID 根据id 查询电池汇总数量
	                let url2 = `initCount?transporter_id=${transporter_id}`;
                    this.$axios.get(url2).then((data) => {
                        let res = data.data;
                        if (res.code == 200) {
                            //此数据无transporter_id属性
                            this.transporterInfo = res.data;
                            // console.log(this.transporterInfo)
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
                    });
                }, 1000)


            },
            //今日配送
            transToday(item){
                if (item == 0){
                    this.$dialog.toast({
                        mes:"今日配送数量为0"
                    })
                }else{
                    this.$router.push("/batTra/scaCha1")
                }
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
                            // console.log(res);
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
                            if (result) {
                                this.$router.push({path: `/batTra/confir1/${n}`})
                            } else {
                                alert(result)
                            }

                        }
                    })
                })

            },
            //开始配送
            startTrans(event) {
                let el = event.currentTarget
                let userInfo = this.$store.state.userInfo.account_id ? this.$store.state.userInfo : JSON.parse(util.getCookie('userInfo'));
                let account_id = userInfo.account_id;
                let that = this;
                this.$axios.get(`findByAccount/${account_id}`).then((data)=>{
                    let res = data.data;
                    //运输员状态
                    that.transporter_status =res.data.transporter_status;
                        if (this.transporterInfo.preTransport == 0){
                            this.$dialog.toast({
                                mes:"没有可配送的电池"
                            })
                        }else{
                            that.$router.push("/batTra/startTrans");
                            el.childNodes[2].innerHTML = "配送中"
                        }
                        //修改配送状态
                        if(that.transporter_status == "配送中"){
                            el.childNodes[2].innerHTML = "配送中"
                        }else{
                            el.childNodes[2].innerHTML = "开始配送"
                        }

                })
            },
            //判断适口高度 定位最下面元素
            getViewHeight() {
                let h = document.documentElement.clientHeight
                let obj = {
                    position: 'inherit',
                };
                if (h < 500) {
                    return obj
                } else {
                    return null
                }
            }
        },
        components: {}
    }
</script>

<style lang="less" scoped>
    @color: #00CFB5;
    .bat_tra {
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
            /*left: 0;*/
            width: 100%;
            max-width: 750px;
            height: 1rem;
            display: flex;
            justify-content: center;
            align-items: center;
            > div {
                height: 1rem;
                line-height: 1rem;
                width: 36%;
                text-align: center;
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
