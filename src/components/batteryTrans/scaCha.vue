<template>
    <div class="tra_hello">
        <!--这个是batteryFactory组件的子组件Scavenging charging-->
        <div v-if="serviceStation.length > 0" class="far" v-for="(item,index) in serviceStation">
            <div class="son">
                <span class="top">{{item.stationName}}</span>
                <span class="bottom">配送总量: <i class="col">{{item.count || '--'}}</i></span>

            </div>
        </div>
	    <div v-if="serviceStation.length <= 0">暂无数据...</div>
    </div>

</template>

<script>
    import util from '../../assets/js/util'
    export default {
        //扫码充电
        name: 'tra-dis-cha',
        data() {
            return {
                serviceStation:[],
            }
        },
        mounted(){
            this.getTransporterInfo()
        },
        methods:{
            //	获取运输员信息
            getTransporterInfo(){
               let transporter_id = this.$store.state.transporter_id || localStorage.getItem('transporter_id') ? localStorage.getItem('transporter_id') : ''
               console.log('transporter_id: ' + transporter_id)

                let url = `serviceStationPreCount?transporter_id=${transporter_id}`;
                this.$axios.get(url).then( (data) => {
                    let res = data.data;
                    console.log(res);
                    if(res.code === 200){
                    	console.log(res);
                        this.serviceStation = res.data;
                        console.log(this.serviceStation);
                    }else{
                        this.$dialog.toast({
                            mes: res.message,
                            timeout: 3000,
                            icon: 'error',
                            callback: () => {
                                //do something
                            }
                        })
                    }
                });
            }
        }
    }
</script>

<style lang="less" scoped>
    @color: #00CFB5;
    .col{
        color:@color;
    }
    .tra_hello {
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
    }
</style>
