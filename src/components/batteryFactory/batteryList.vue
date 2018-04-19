<template>
    <div class="bat_list">
        <div class="lis_cpt">
            概览
        </div>
        <ul class="oul">
            <li>
                <span>回收单号:</span>
                <span>{{orderDetail.order_number}}</span>
            </li>
            <li>
                <span>扫码人员:</span>
                <span>{{orderDetail.linkman}}</span>
            </li>
            <li>
                <span>回收时间:</span>
                <span>{{orderDetail.add_time}}</span>
            </li>
            <li>
                <span>回收电池总量:</span>
                <span>{{orderDetail.storage_count}}</span>
            </li>
            <li>
                <div>
                    <span>异常电池:</span>
                    <span>{{orderDetail.abnormal_count}}</span>
                </div>
            </li>
        </ul>
        <myhr></myhr>
        <div class="lis_cpt">电池详情</div>
        <div class="list_boxs">
            <ul v-for="(item,index) in dataList" class="oul">
                <li>
                    <span>电池编号:</span>
                    <span>{{item.battery_id}}</span>
                </li>
                <li>
                    <span>电池电量:</span>
                    <span>{{item.battery_power}}</span>
                </li>
	            <li v-if="item.is_abnormal == 1">
		            <div>
			            <span>电池状态:</span>
			            <router-link :data-battery_id="item.battery_id" :to="'/batFac/details/'+ item.battery_id" tag="span" class="red" v-if="item.is_abnormal">{{item.battery_status}}
			            </router-link>
		            </div>
	            </li>
	            <li v-else-if="item.is_abnormal == 0">
		            <div>
			            <span>电池状态:</span>
			            <span class="blue">{{item.battery_status}}</span>
		            </div>
	            </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import myhr from '../../components/common/myhr'
    export default {
        name: "bat-lis",
        data() {
            return {
                dataList: [],
	            //
	            order_number: '',
	            orderDetail: {}
            }
        },
	    created() {
		    this.orderDetail = JSON.parse(localStorage.getItem('orderDetail'))
		    this.order_number = this.orderDetail.order_number
        },
	    mounted(){
		    this.getOrderInfo(this.order_number)
	    },
	    methods: {
        	getOrderInfo(order_number){
        		///
		        let url = `charge_factory/batterys/storage/info/${order_number}`

		        this.$axios.get(url).then((data) => {
			        console.log(data);
			        let res = data.data;
			        if(res.code == 200){
				        console.log(res.data);
				        this.dataList = res.data

			        }else{
				        this.$dialog.toast({
					        mes: res.message,
					        timeout: 1500,
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
            myhr,
        }
    }
</script>

<style scoped lang="less">
    @color: #00CFB5;
    .bat_list {
        height:100%;
        .lis_cpt {
            height: 1rem;
            line-height: 1rem;
            font-size: .34rem;
            box-sizing: border-box;
            background: #fff;
            position: relative;
            padding: 0 .26rem;
            font-weight: bold;
            &:before {
                content: "";
                height: .5rem;
                position: absolute;
                left: 0;
                top: .25rem;
                border-left: 3px solid @color;
            }
            &:after {
                content: '';
                width: 100%;
                position: absolute;
                bottom: 0;
                left: 0;
                border-bottom: 1px solid #ddd;
            }
        }
        .oul {
            background: #fff;
            padding: .15rem 0;
            border-bottom: 1px solid #ddd;
            > li {
                height: .6rem;
                line-height: .6rem;
                font-size: .28rem;
                padding: 0 .15rem;
                span:nth-of-type(2) {
                    margin-left: .2rem;
                }
            }
            > li:nth-of-type(4) {
                span:nth-of-type(2) {
                    color: @color;
                }
            }
            > li:nth-of-type(5) {
                span:nth-of-type(2) {
                    color: red;
                }
            }
        }
    }
</style>
