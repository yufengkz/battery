<template>
    <div class="confir">
        <div class="warn">
            <img src="../../assets/img/fwz_03.png">
            请确认电池无误后，点击“确认”按钮入库！
        </div>
        <div class="detial">
            <myhr></myhr>
            <ul class="oul">
                <li>
                    <span>电池编号:</span>
                    <span>{{battery.battery_number}}</span>
                </li>
                <li>
                    <span>电池电量:</span>
                    <span>{{battery.battery_power}}</span>
                </li>
                <li>
                    <div>
                        <span>电池状态:</span>
                        <span :class="[battery.is_abnormal ? 'red' : 'blue']">{{battery.battery_status}}</span>
                    </div>
                </li>
            </ul>
        </div>
        <div class="btns">
            <div class="contt_dd" v-if="type == 1">
                <div @click="handleCancel" class="cancel_button">取消</div>
                <div @click="handleFinish" class="sure_button">完成</div>
            </div>
            <div class="contt_md" v-else>
                <div @click="sendData" tag="div" class="sm_one">
                    <img src="../../assets/img/smwc.png" alt="继续扫码">
                </div>
                <div @click="handleCancel" class="cancel_button">取消</div>
                <div @click="handleSubmit" class="sure_button">完成</div>
            </div>
        </div>
        <div class="abnor" :style="styles">
            <span @click="sendExceptions" tag="span">异常反馈</span>
        </div>
        <yd-popup v-model="mdShow" position="center" width="72%">
            <h2>提交成功！</h2>
            <p>已扫码电池数量：<span>{{battery_count}}</span></p>
        </yd-popup>
    </div>
</template>

<script>
    import wx from 'weixin-js-sdk'
    import myhr from '../common/myhr'
    import util from '../../assets/js/util'

    export default {
        name: "confir",
        data() {
            return {
                battery: {},
                mdShow: false,
                styles: {},
                battery_count: 0,
                battery_total: [],
                battery_id: 0,
                battery_number: 0,
                accountId: '',
                storageType: '',
                storage_type: '',
                account_id: "",
                exceptionFlag: false,
                type: 1
            }
        },
        created() {
            //获取user
            let userInfo = this.$store.state.userInfo.account_id ? this.$store.state.userInfo : JSON.parse(util.getCookie('userInfo'))
            this.account_id = userInfo.account_id;
        },
        mounted() {
            //获取微信配置文件
            this._wxConfig()

            //storage_type 扫码时电池返回电池的状态、
            this.type = this.$route.params.type
            // console.log(type)
            this.storage_type = this.type == 1 ? '低电返厂' : '满电入库'
            this.storageType = this.type == 1 ? '低电返厂' : '满电入库'

            //第一次扫码获取到第一次获取的 battery_num 并且查询该电池的信息
            this.battery_number = localStorage.getItem('s-battery_number')
            this.getBatteryInfo(this.battery_number)
            this.styles = this.getViewHeight()
        },
        methods: {
            //获取微信配置文件
            _wxConfig() {
                let _this = this
                let root = '' //encodeURIComponent(window.location.href.split('#')[0])
                let url = `http://batteryweb.haolei100.com/wx/config?pathName=${root}`
                this.$axios.get(url).then((data) => {
                    let res = data.data;
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
                            timeout: 10000,
                            icon: 'error',
                            callback: () => {
                                //do something
                            }
                        })
                    })
                })
            },
            //扫码
            scanQRCode() {
                let _this = this;

                wx.ready(() => {
                    wx.checkJsApi({
                        jsApiList: ['scanQRCode'],
                        success: function (res) {
                            //
                        }
                    })
                    wx.scanQRCode({
                        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                        scanType: ['qrCode'], // 可以指定扫二维码还是一维码，默认二者都有
                        success: (res) => {
                            console.log('调扫码');
                            let result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                            if (result.indexOf('http') != -1) {
                                this.$dialog.toast({
                                    mes: '该二维码不是有效的二维码',
                                    timeout: 2000,
                                    callback: () => {
                                        //do something
                                    }
                                })
                                return
                            }
                            _this.battery_number = result
                            //查询电池信息
                            this.getBatteryInfo(_this.battery_number)
                        }
                    })
                })

            },
            //根据电池编码 获取电池信息
            getBatteryInfo(battery_number) {
                console.log('电池编码：' + battery_number)
                let url = `charge_factory/battery/${battery_number}`
                this.$axios.get(url).then((data) => {
                    console.log(data)
                    let res = data.data
                    if (res.code === 200) {
                        if (res.data) {
                            this.battery = res.data
                            this.battery_id = res.data.battery_id
                            console.log(this.battery.battery_id);
                            localStorage.setItem('s-battery_number', battery_number)
                        } else {
                            this.$dialog.toast({
                                mes: '未查询到该电池信息',
                                timeout: 3000,
                                icon: 'error',
                                callback: () => {
                                    //do something
                                    //没有查到信息 调扫码
                                    this.scanQRCode()
                                }
                            })
                        }
                    } else {
                        this.$dialog.toast({
                            mes: res.message,
                            timeout: 5000,
                            icon: 'error',
                            callback: () => {
                                //do something
                                //没有查到信息 调扫码
                                this.scanQRCode()
                            }
                        })
                    }
                })
            },
            //提交数据之前先查看电池是否有异常
            checkBatteryInfo() {
                //
                let url = `battery_exception/${this.battery_id}`;
                this.$axios.post(url).then((data) => {
                    let res = data.data;
                    if (res.code === 200) {
                        if (res.data) {
                            //查到电池提交过一场
                            this.exceptionFlag = true
                        } else {
                            //
                            this.exceptionFlag = false
                        }
                    } else {
                        this.$dialog.toast({
                            mes: res.message,
                            timeout: 2000,
                            icon: 'error',
                            callback: () => {
                                //do something
                                console.log(res);
                            }
                        })
                    }
                })
            },
            //满电入库继续扫码 发送上一次数据
            sendData() {
                //获取user
                let userInfo = this.$store.state.userInfo.account_id ? this.$store.state.userInfo : JSON.parse(util.getCookie('userInfo'));
                let account_id = userInfo.account_id;
                //storage_type 扫码时电池返回电池的状态、
                let type = this.$route.params.type;
                let storage_type = type == 1 ? '低电返厂' : '满电入库';
                let url = `station_batterys/storage/${this.battery_id}/${account_id}/${storage_type}`;
                let that = this;
                this.$axios.post(url).then((data) => {
                    let res = data.data;
                    console.log(res.data);
                    if (res.code == 200) {
                        //扫码成功 点击继续扫码
                        that.battery_count = res.data.storage_count;
                        localStorage.setItem('exception_order_number', res.data.order_number);
                        this.mdShow = true;
                        setTimeout(() => {
                            this.mdShow = false;
                            //先提交数据  在调扫码
                            this.scanQRCode()
                        }, 1000)
                    } else if (res.code == 400) {
                        this.$dialog.toast({
                            mes: res.message,
                            timeout: 2000,
                            icon: 'error',
                            callback: () => {
                                //do something
                                console.log(res);
                            }
                        })
                    } else {
                        this.$dialog.toast({
                            mes: '提交失败，请重新点击继续扫码',
                            timeout: 2000,
                            icon: 'error',
                            callback: () => {
                                //do something
                                console.log(res);
                            }
                        })
                    }
                })
            },
            //低电返厂====》完成
            handleFinish() {
                let url = `station_batterys/storage/${this.battery_id}/${this.account_id}/${this.storage_type}`;
                let that = this;
                this.$axios.post(url).then((data) => {
                    let res = data.data;
                    console.log(res)
                    if (res.code == 200) {
                        //扫码成功
                        that.battery_count = res.data.storage_count;
                        this.mdShow = true;
                        localStorage.setItem('exception_order_number', res.data.order_number);
                        setTimeout(() => {
                            console.log(this.mdShow)
                            this.mdShow = false;
                            this.$router.go(-1)
                        }, 1000)
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
                })
            },
            //满电入库提交整个订单
            handleSubmit() {
                let url = `station_batterys/storage/${this.battery_id}/${this.account_id}/${this.storage_type}`;
                let that = this;
                this.$axios.patch(url).then((data) => {
                    let res = data.data;
                    if (res.code == 200) {
                        this.$dialog.toast({
                            mes: res.message,
                            timeout: 1500,
                            icon: 'success',
                            callback: () => {
                                //do something
                                this.mdShow = false;
                                this.$router.go(-1)
                            }
                        })
                    } else if (res.code == 400) {
                        this.$dialog.toast({
                            mes: res.message,
                            timeout: 2000,
                            icon: 'error',
                            callback: () => {

                            }
                        })
                    }else{
                        this.$dialog.toast({
                            mes: res.message,
                            timeout: 2000,
                            icon: 'error',
                            callback: () => {

                            }
                        })
                    }
                })
            },
            //取消本次提交
            handleCancel() {
                //取消提交当前电池信息
                /*this.scanQRCode()*/
                this.$router.go(-1)
            },
            //提交异常
            sendExceptions() {
                //查询异常
                this.checkBatteryInfo()
                //提交异常前判断电池是否已经有异常  有则不需要提交
                if (this.exceptionFlag) {
                    this.$dialog.toast({
                        mes: '该电池已报异常，请继续扫码',
                        timeout: 2000,
                        icon: 'error',
                        callback: () => {
                            //do something
                        }
                    })
                    return
                }
                let exceptionsBattery = this.battery;
                localStorage.setItem('exceptionsBattery', JSON.stringify(exceptionsBattery))
                this.$router.push(`/serKio/serAbnFee`)
            },
            //判断适口高度 定位最下面元素
            getViewHeight() {
                let h = document.documentElement.clientHeight
                let obj = {
                    position: 'inherit',
                    //marginTop: '1rem'
                }
                if (h < 500) {
                    return obj
                } else {
                    return null
                }
            }
        },
        components: {
            myhr,
        }
    }
</script>

<style scoped lang="less">
    @color: #00CFB5;
    .confir {
        height: 100%;
        color: #333333;
        position: relative;
        .warn {
            background: #fff;
            color: red;
            height: .92rem;
            line-height: .92rem;
            padding: 0 .2rem;
            width: 100%;
            font-size: .3rem;
            img {
                vertical-align: middle;
            }
        }
        .btns {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
            height: 7.2rem;
            width: 100%;
            max-width: 750px;
            .contt_dd {
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                > div {
                    flex-grow: 1;
                    height: 1rem;
                    line-height: 1rem;
                    text-align: center;
                    border: 1px solid @color;
                    border-radius: 5px;
                    font-size: .3rem;
                }
                .cancel_button {
                    color: @color;
                    margin: 0 .2rem 0 .4rem;
                }
                .sure_button {
                    background: @color;
                    color: #ffffff;
                    margin: 0 .4rem 0 .2rem;
                }
            }
            .contt_md {
                width: 3.6rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                > div {
                    flex-grow: 1;
                    text-align: center;
                    font-size: .24rem;
                    padding-top: .4rem;
                    color: @color;
                }
                > div:nth-of-type(1) {
                    padding-top: 0;
                    img {
                        width: 3.6rem;
                        height: 3.6rem;
                    }
                }
            }
        }
        .oul {
            background: #fff;
            padding: .15rem 0;
            border-bottom: 1px solid #ddd;
            box-sizing: border-box;
            height: 2rem;
            > li {
                height: .6rem;
                line-height: .6rem;
                font-size: .28rem;
                padding: 0 .15rem;
                span:nth-of-type(2) {
                    margin-left: .2rem;
                }
                &:last-child {
                    div {
                        display: inline;
                    }
                }
            }
            .abnor {
                text-align: center;
                height: 1rem;
                line-height: 1rem;
                width: 100%;
                position: absolute;
                bottom: 0;
                left: 0;
                span {
                    color: @color;
                    font-size: .3rem;
                }
            }
        }
        .abnor {
            text-align: center;
            height: 1rem;
            line-height: 1rem;
            width: 100%;
            position: absolute;
            bottom: 0;
            left: 0;
            span {
                color: @color;
                font-size: .3rem;
            }
        }
        .yd-popup-content {
            h2 {
                line-height: 1.1rem;
                text-align: center;
                border-bottom: 1px solid #eee;
                font-size: 0.3rem;
                font-weight: normal;
                color: #333;
            }
            p {
                line-height: 1.1rem;
                text-align: center;
                font-size: 0.3rem;
                color: #333;
                span {
                    color: @color;
                }
            }
        }
    }
</style>
