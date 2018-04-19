<template>
    <div class="ser_kio">

        <!--头部-->
        <div class="indexhead">
            <div class="head_left" v-if="serviceInfo.service_station_name">
                {{serviceInfo.service_station_name}}
            </div>
            <div class="head_left" v-else>
                XXXX服务亭
            </div>
            <router-link to="/user" class="head_right" tag="div">
                <img src="../../../assets/img/mine2.png" alt="">
            </router-link>
        </div>

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
                            <img src="../../../assets/img/432x.png" alt="">
                        </div>
                        <div class="lieyou">
                            <div>电池总量</div>
                            <div>{{batteryInfo.battery_counts}}</div>
                        </div>
                    </div>
                </div>
                <router-link to="/serKio/serDisSta/2" tag="div">
                    <div class="liebiao">
                        <div class="liezuo">
                            <img src="../../../assets/img/battra_03.png" alt="">
                        </div>
                        <div class="lieyou">
                            <div>待租用</div>
                            <div>{{batteryInfo.battery_to_use}}</div>
                        </div>
                    </div>
                </router-link>
                <router-link to="/serKio/serDisSta/3" tag="div">
                    <div class="liebiao">
                        <div class="liezuo">
                            <img src="../../../assets/img/ser_03.png" alt="">
                        </div>
                        <div class="lieyou">
                            <div>待充电</div>
                            <div>{{batteryInfo.battery_to_charged}}</div>
                        </div>
                    </div>
                </router-link>
                <router-link to="/serKio/serDisSta/4" tag="div">
                    <div class="liebiao">
                        <div class="liezuo">
                            <img src="../../../assets/img/452x.png" alt="">
                        </div>
                        <div class="lieyou">
                            <div>电池异常</div>
                            <div>{{batteryInfo.battery_abnormal}}</div>
                        </div>
                    </div>
                </router-link>
                <router-link to="/serKio/serDisSta/0" tag="div">
                    <div class="liebiao">
                        <div class="liezuo">
                            <img src="../../../assets/img/ser_06.png" alt="">
                        </div>
                        <div class="lieyou">
                            <div>使用中</div>
                            <div>{{batteryInfo.battery_in_use}}</div>
                        </div>
                    </div>
                </router-link>
                <router-link to="/serKio/serDisSta/0" tag="div">
                    <div class="liebiao">
                        <div class="liezuo">
                            <img src="../../../assets/img/ser_08.png" alt="">
                        </div>
                        <div class="lieyou">
                            <div>使用中(>2h)</div>
                            <div>{{batteryInfo.battery_in_use2}}</div>
                        </div>
                    </div>
                </router-link>
            </div>
        </div>
        <!--扫码-->
        <div class="saom">
            <figure @click="scanQRCode(1)" class="sm_left">
                <div><img src="../../../assets/img/462x.png" alt="低电待充"></div>
                <figcaption>低电待充</figcaption>
            </figure>
            <figure @click="scanQRCode(0)" class="sm_right">
                <div><img src="../../../assets/img/462x.png" alt="满电入库"></div>
                <figcaption>满电入库</figcaption>
            </figure>
        </div>
        <!--入库记录-->
        <div class="record" :style="styles">
            <router-link to="/serKio/serWarRec" tag="div">入库记录</router-link>
            <router-link to="/serKio/serDisSta/1" tag="div">使用异常名单</router-link>
        </div>
    </div>
</template>

<script>
    import util from '../../../assets/js/util'
    import wx from 'weixin-js-sdk'

    export default {
        name: 'ser-bat-tra',
        data() {
            return {
                styles: {},
                batteryInfo: {
                    "battery_abnormal": 0,   //电池异常
                    "battery_counts": 0,    //电池总数
                    "battery_in_use": 0,    //电池使用中
                    "battery_in_use2": 0,  //电池使用2小时
                    "battery_to_charged": 0,    //待充电
                    "battery_to_use": 0,         //待使用
                    "battery_use_abnormal": 0   //电池使用异常
                },
                serviceInfo: {},
                service_station_id: "",
                str:{
                    "account_id": 306,
                    "account_name": "15200003333",
                    "account_pass": null,
                    "account_type": "service_station",
                    "account_status": "normal",
                    "wx_open_id": "oup4p00kMOiNtfPLpy0rjMo9x8dM",
                    "add_time": "2018-04-13 03:02:07",
                    "login_count": 71,
                    "login_time": "2018-04-19 03:36:18",
                    "access_info": {
                        "login_id": 3671,
                        "account_id": 306,
                        "access_token": "3aea68bda3984d5c86729dd674d517ff",
                        "account_type": "service_station",
                        "login_time": null,
                        "failure_time": "2018-04-19 16:00:00",
                        "token_status": null
                    }
                }
            }
        },
        computed: {
            isLoading() {
                return this.$store.state.isLoading
            }
        },
        mounted() {
            console.log(JSON.stringify(this.str))
            //调用电池数量接口
            this.getBatterCounts()
            this.styles = this.getViewHeight()
            //获取微信配置文件
            this._wxConfig()

        },
        methods: {
            //获取微信配置文件
            _wxConfig() {
                let _this = this
                let root = '' //encodeURIComponent(window.location.href.split('#')[0])
                let url = `http://batteryweb.haolei100.com/wx/config?pathName=${root}`
                this.$axios.get(url).then((data) => {
                    let res = data.data
                   /* console.log('========');
                    console.log(data);*/
                    let appId = res.appId
                   /* console.log('========');
                    console.log(appId);*/
                    let nonceStr = res.nonceStr
                    let signature = res.signature
                    let timestamp = res.timestamp
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
            //查询电池数量
            getBatterCounts() {
                let userInfo = this.$store.state.userInfo.account_id ? this.$store.state.userInfo : JSON.parse(util.getCookie('userInfo'));
                console.log(userInfo);
                let account_id = userInfo.account_id;
                let url = `station_batterys/counts/${account_id}`;
                let serviceInfoUrl = `/stations/account/${account_id}`;
                this.$axios.get(url).then((data) => {
                    let res = data.data;
                    if (res.code === 200) {
                        this.batteryInfo = res.data;
                    } else {
                        this.$dialog.toast({
                            mes: res.message,
                            timeout: 10000,
                            icon: 'error',
                            callback: () => {
                                //do something
                            }
                        })
                    }
                });

                //查询服务站信息
                this.getServiceInfo(serviceInfoUrl);
            },
            //查询服务站信息
            getServiceInfo(serviceInfoUrl) {
                this.$axios.get(serviceInfoUrl).then((data) => {
                    let res = data.data;
                    if (res.code === 200) {
                        this.serviceInfo = res.data;
                        // console.log(res.data)
                        //派发工厂信息信息给store  id factoryInfo
                        this.$store.commit('setServiceInfo', res.data)
                        //cookie添加 factoryInfo factory_id
                        util.addCookie('factoryInfo', JSON.stringify(res.data), 1)
                    } else {
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
            //扫码
            scanQRCode(n) {
                let _this = this

                wx.ready(() => {
                    wx.checkJsApi({
                        jsApiList: ['scanQRCode'],
                        success: function (res) {

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
                            let battery_number = result;
                            // n=1 低电待充  n=0 满电入库
                            //
                            localStorage.setItem('s-battery_number', battery_number)
                            if (result) {
                                this.$router.push({path: `serKio/serConfir/${n}`})
                            } else {
                                alert(result)
                            }

                        }
                    })
                })

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
        components: {}
    }
</script>

<style lang="less" scoped>
    @color: #00CFB5;
    .ser_kio {
        height:100%;
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
            height: 5.10rem;
            > div {
                width: 50%;
                height: 33.33%;
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
                &:nth-of-type(5) {
                    border-bottom: 0;
                }
                &:nth-of-type(6) {
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
            height: 3.6rem;
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
            width: 90%;
            height: 100%;
            display: flex;
            justify-content: space-around;
            align-items: center;
            img {
                width: .6rem;
                margin-left: .2rem;
            }
        }

        .lieyou {
            width: 50%;
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
