<template>
    <ul class="details" v-if="battery_info">
        <li><span>电池编号:</span> <span>{{battery_info.battery_number}}</span></li>
        <li><span>电池电量:</span> <span>{{battery_info.battery_power}}</span></li>
        <li><span>电池状态:</span> <span>{{battery_info.battery_status}}</span></li>
        <li><span>电池情况:</span> <span>{{battery_info.exception_type}}</span></li>
        <li>
            <span>异常描述:</span>
            <textarea disabled maxlength="50">{{battery_info.exception_description}}</textarea>
        </li>
	    <li>
		    <span>异常照片:</span>
		    <img @click="_previewImage(item)" v-for="(item, index) in wzPicturePath" :src="item"/>
	    </li>
        <!--<li><span>运输人员:</span> <span>{{battery_info.liable_person}} -配送人员是啥</span></li>
        <li><span>快递人员:</span> <span>{{battery_info.liable_person}} -配送人员是啥</span></li>-->
    </ul>
</template>

<script>
	import wx from 'weixin-js-sdk'
    export default {
        //异常详情
        name: "datails",
	    data(){
        	return{
		        battery_info: {},
		        picture_path: [],
		        wzPicturePath: []
	        }
	    },
	    mounted(){
        	this._wxConfig()
		    this.getBatteryException()
	    },
	    methods: {
		    //获取微信配置文件
		    _wxConfig() {
			    let _this = this
			    let root = '' //encodeURIComponent(window.location.href.split('#')[0])
			    let url = `http://batteryweb.haolei100.com/wx/config?pathName=${root}`
			    this.$axios.get(url).then((data) => {
				    let res = data.data
				    let appId = res.appId
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
						    timeout: 10000,
						    icon: 'error',
						    callback: () => {
							    //do something
						    }
					    })
				    })
			    })
		    },
		    _previewImage(current){
			    wx.previewImage({
				    current: current, // 当前显示图片的http链接
				    urls: this.wzPicturePath // 需要预览的图片http链接列表
			    })
		    },
        	//
	        getBatteryException(){
		        let id = this.$route.params.battery_id;
		        console.log(id);
	        	if(id == 'null') return;
	        	let url = `battery_exception/${id}`;
		        console.log(url);
		        this.$axios.get(url).then( (data) => {
			        let res = data.data;
			        console.log(res);
			        if(res.code === 200){
				        this.battery_info = res.data
				        this.picture_path = res.data.picture_path.split(',')
				        //加上跟路径
				        this.wzPicturePath = this.picture_path.map( (item) => {
				        	return this.battery_info.picture_server_path + item
				        })
			        }else{
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
	        }
	    }
    }
</script>

<style scoped lang="less">
    @color: #00CFB5;
    .details {
        background: #fff;
        > li {
            height: .6rem;
            line-height: .6rem;
            font-size: .28rem;
            padding: 0 .15rem;
            span:nth-of-type(1) {
                margin-right: .4rem;
            }
	        textarea{
		        background: #fff;
		        border: 1px dotted #ccc;
		        border-radius: 4px;
		        padding: 0.1rem;
	        }
            &:nth-of-type(5) {
                display: flex;
                align-items: start;
                height: 2rem;
                textarea {
                    margin-top: .15rem;
                    height: 1.6rem;
                    flex-grow: 1;
                    margin-right: .2rem;
                }
            }
            &:nth-of-type(6) {
                height: 1.2rem;
                display: flex;
                align-items: start;
                img {
                    display: inline;
                    height: 1rem;
                    width: 1rem;
                }

            }
        }
    }
</style>
