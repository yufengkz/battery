<template>
    <div class="ser_bat_list">
        <div class="lis_cpt">
            概览
        </div>
        <ul class="oul">
            <li>
                <span>回收单号:</span>
                <span>{{newsList.order_number}}</span>
            </li>
            <li>
                <span>扫码人员:</span>
                <span>{{newsList.transporter_name}}{{newsList.transporter_mobile}}</span>
            </li>
            <li>
                <span>回收时间:</span>
                <span>{{newsList.add_time}}</span>
            </li>
            <li>
                <span>回收电池总量:</span>
                <span>{{newsList.storage_count}}</span>
            </li>
            <li>
                <div>
                    <span>异常电池:</span>
                    <span>{{newsList.abnormal_count}}</span>
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
                    <span v-if="item.is_abnormal==0">{{item.battery_power}}</span>
                    <span v-else>--</span>
                </li>
                <li>
                    <div>
                        <span>电池状态:</span>
                        <span class="blue" v-if="item.is_abnormal == 0">正常</span>
                        <span class="red" v-else @click='abnormalDetails(item)'>异常</span>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import myhr from '../../components/common/myhr'

    export default {
        name: "ser-bat-lis",
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
          getBatteryInfo(item){
              this.newsList = JSON.parse(localStorage.getItem("details"));
              let order_number = this.newsList.order_number;
              console.log(order_number)
              this.$axios.get(`station_batterys/storage/info/${order_number}`).then((data)=>{
                  let res = data.data;
                  if (res.code == 200){
                      this.dataList = res.data;
                  }
              })
              // this.dataList = this.newsList.batteries;
          },
            abnormalDetails(item){
              localStorage.setItem("abnormalDetail",JSON.stringify(item));
              this.$router.push("/serKio/serDetails")
            }
        },
        components: {
            myhr,
        }
    }
</script>

<style scoped lang="less">
    @color: #00CFB5;
    .ser_bat_list {
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
