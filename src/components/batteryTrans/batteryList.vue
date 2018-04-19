<template>
    <div class="tra_bat_list">
        <div class="lis_cpt">
            概览
        </div>
        <ul class="oul">
            <li>
                <span>配送单号:</span>
                <span>{{newsList.record_number}}</span>
            </li>
            <li>
                <span>配送服务站:</span>
                <span>{{newsList.trans}}</span>
            </li>
            <li>
                <span>配送人员:</span>
                <span>{{newsList.transporter_name}}{{newsList.transporter_mobile}}</span>
            </li>
            <li>
                <span>配送开始时间:</span>
                <span>{{newsList.begin_time}}</span>
            </li>
            <li>
                <div>
                    <span>配送结束时间:</span>
                    <span>{{newsList.end_time}}</span>
                </div>
            </li>
            <li>
                <div>
                    <span>电池总数量:</span>
                    <span>{{newsList.total_count}}</span>
                </div>
            </li>
            <li>
                <div>
                    <span>正常数量:</span>
                    <span>{{newsList.total_count-newsList.exception_count}}</span>
                </div>
            </li>
            <li>
                <div>
                    <span>异常数量:</span>
                    <span>{{newsList.exception_count}}</span>
                </div>
            </li>
        </ul>
        <myhr></myhr>
        <div class="lis_cpt">电池详情</div>
        <div>
            <ul v-for="(item,index) in dataList" class="oul">
                <li>
                    <span>电池编号:</span>
                    <span>{{item.battery_number}}</span>
                </li>
                <li>
                    <span>电池电量:</span>
                    <span>{{item.battery_power}}</span>
                </li>
                <li>
                    <div>
                        <span>电池状态:</span>
                        <span class="blue" v-if="item.is_abnormal == 0">正常</span>
                        <span class="red" v-if="item.is_abnormal == 1" @click="abnormalOf(item)">异常</span>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import myhr from '../../components/common/myhr'

    export default {
        name: "tra-bat-lis",
        data() {
            return {
                dataList: [],
                newsList: {}
            }
        },
        mounted(){
            this.getBatteryInfo()
        },
        methods:{
            getBatteryInfo(){
                //电池概览
                this.newsList = JSON.parse(localStorage.getItem("recordInfoDeatils"));
                console.log(this.newsList)
                let order_number = this.newsList.record_number;
                //获取对应订单的电池列表
                this.$axios.get(`findTransportRecordDetail/${order_number}`).then((data)=>{
                    let res = data.data;
                    this.dataList = res.data;
                    console.log(res.data)
                })
            },
            abnormalOf(item){
                localStorage.setItem("abnormalOf",JSON.stringify(item))
                this.$router.push("/batTra/details1")
            }
        },
        components: {
            myhr,
        }
    }
</script>

<style scoped lang="less">
    @color: #00CFB5;
    .tra_bat_list {
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
                    color:#999;
                }
                span.red{
                    color:red;
                }
                span.blue{
                    color:@color;
                }
            }
            > li:nth-of-type(6) {
                span:nth-of-type(2) {
                    color: @color;
                }
            }
            > li:nth-of-type(7) {
                span:nth-of-type(2) {
                    color: @color;
                }
            }
            > li:nth-of-type(8) {
                span:nth-of-type(2) {
                    color: red;
                }
            }
        }
    }
</style>
