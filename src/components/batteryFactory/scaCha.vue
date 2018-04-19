<template>
    <div class="hello" :data="factoryList">
        <!--这个是batteryFactory组件的子组件Scavenging charging-->
        <div v-if="factoryList.length > 0" class="far" v-for="(item, index) in factoryList">
            <div class="son">
                <span class="top">{{item.service_station_name}}</span>
                <span class="bottom">配送总量 <i class="col">{{item.service_station_distribution_count}}</i></span>
            </div>
        </div>
	    <div v-if="factoryList.length <= 0" class="no-data">暂无数据...</div>
    </div>

</template>

<script>
    export default {
        //扫码充电
        name: 'dis-cha',
        data() {
            return {
	            factoryList: ''
            }
        },
        mounted(){
            var factory_id = this.$route.params.factory_id
            this.$axios.get(`/charge_factory/service_station/batterys/${factory_id}`).then((data)=>{
	            let res = data.data
	            if(res.code === 200){
		            console.log(res.data)
		            this.factoryList = res.data

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
        }
    }
</script>

<style lang="less" scoped>
    @color: #00CFB5;
    .col{
        color:@color;
    }
    .hello {
        .far:nth-of-type(1) {
            margin-top: 0;
        }
        .far {
            margin-top: 0.20rem;
            left: 0;
            line-height: 0.74rem;
            background-color: #ffffff;
            border-left-style: none;
            border-right-style: none;
            .son {

                .top {
                    display: block;
                    color: #333;
                    font-size: 0.32rem;
                    border-bottom:1px solid #dddddd;
                    padding-left:0.22rem;

                }
                .bottom {
                    display: block;
                    color: #333333;
                    font-size: 0.32rem;
                    padding-left:0.22rem;

                }
            }
        }

	    .no-data{
		    line-height: 1rem;
		    text-align: center;
		    font-size: 0.26rem;
		    color: #666;
	    }
    }
</style>
