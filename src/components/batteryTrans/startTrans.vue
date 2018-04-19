<template>
    <div class="batt_tran2">
        <!--电池运输端-->
        <div class="far">
            <!--服务站列表-->
            <dl class="kio" v-for="(item,index) in transCount">
                <dt>{{item.stationName}}</dt>
                <dd>
                    <p><span>配送:</span><span>{{item.count}}</span></p>
                    <!--状态切换-->
                    <div class="check" v-show="item.flag">
                        <yd-checkbox-group v-model="checkbox" color="#00CFB5">
                            <yd-checkbox :val="index+1" shape="circle"></yd-checkbox>
                        </yd-checkbox-group>
                    </div>
                    <div v-show="!item.flag" style="color:#999;">已完成</div>
                </dd>
            </dl>
        </div>
        <div class="butt">
            <div @click="jumpPage">
                <yd-button size="large" type="primary" bgcolor="#00CFB5" color="#ffffff">开始配送</yd-button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "batt_tran2",
        data() {
            return {
                //多选框
                checkbox: [],
                //服务亭数量
                transCount: [],
            }
        },
        mounted() {
            this.getStationInfo()
        },
        methods: {
            getStationInfo() {
                let that = this;
                let transporter_id = this.$store.state.transporter_id ? this.$store.state.transporter_id : localStorage.getItem("transporter_id");
                let url = `serviceStationPreCount?transporter_id=${transporter_id}`;
                this.$axios.get(url).then((data) => {
                    let res = data.data;
                    console.log(res);
                    if (res.code == 200){
                        //将数据赋值给本地
                        that.transCount = res.data;
                        console.log(res.data)
                        localStorage.setItem("transition_back_status",that.transCount.tatus)
                    }
                })
            },
            //修改状态
            jumpPage() {
               this.$router.go(-1)
            }
        }
    }
</script>

<style scoped lang="less">
    @color: #00CFB5;
    .col {
        color: @color;
    }

    .batt_tran2 {
        .head2 {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: .94rem;
            background: #fff;
            padding: .24rem;

            .head_left {
                font-size: .34rem;
            }
            .head_right img {
                width: .4rem;
                height: .4rem;
            }
        }
        .kio {
            margin-top: .2rem;
            background: #ffffff;
            dt, dd {
                height: .9rem;
                padding: 0 .24rem;
            }
            dt {
                line-height: .9rem;
                font-size: .32rem;
            }
            dd {
                font-size: .3rem;
                border-top: 1px solid #dddddd;
                display: flex;
                justify-content: space-between;
                align-items: center;
                p span:nth-of-type(2) {
                    margin-left: .2rem;
                    color: @color;
                }
            }
        }
        .grag{
            color:#999;
            margin-top: .2rem;
            background: #ffffff;
            dt, dd {
                height: .9rem;
                padding: 0 .24rem;
            }
            dt {
                line-height: .9rem;
                font-size: .32rem;
            }
            dd {
                font-size: .3rem;
                border-top: 1px solid #dddddd;
                display: flex;
                justify-content: space-between;
                align-items: center;
                p span:nth-of-type(2) {
                    margin-left: .2rem;
                    color: @color;
                }
            }
        }
    }
</style>
