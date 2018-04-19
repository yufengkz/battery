<template>
    <div class="use_details">
        <div class="details_tit">电池信息</div>
        <div class="det_cont">
            <div>电池编号: <span>B1111</span></div>
            <div>电池电量: <span >56% </span></div>
            <div>电池状态:
                <span class="blue" v-if="true">正常</span>
                <span class="red" v-else>异常</span>
            </div>
        </div>

        <div class="details_tit tenant">租用人信息</div>
        <div class="tenant_cont">
            <div class="det_cont tenant_left">
                <div>订单编号: <span>20182121223</span></div>
                <div>租用人: <span >李俊 12232434344</span></div>
                <div>所属服务站: <span>XXXX服务站</span></div>
                <div>开始时间: <span></span></div>
                <div>归还时间: <span></span></div>
                <div>使用时长:
                    <span :class="[dat.flag ? 'red' : 'blue']" v-if="dat.flag">48小时(异常)</span>
                    <span :class="[dat.flag ? 'blue' : 'red']" v-else>12小时(正常)</span>
                </div>
            </div>
            <div class="tenant_right">
                <span v-if="dat.flag" class="close" @click="closed">远程关闭</span>
                <span v-else class="open" @click="opened">远程激活</span>
            </div>
        </div>

        <div class="abnormal_info">
            <div class="abnormal_tit details_tit">异常信息</div>
            <div class="abnormal_cont">
                <div>电池状态: <span :class="[dat.flag ? 'red' : 'blue']">异常</span></div>
                <div>异常情况: <span>外观异常</span></div>
                <div>异常描述:
                    <textarea disabled maxlength="50">0-50个字</textarea>
                </div>
                <div>异常照片:
                    <img v-if="battery_info.exception_pictrues" :src="battery_info.exception_pictrues"/>
                    <img v-else src="../../assets/img/452x.png"/>
                </div>
                <div>配送人员: <span>张三</span></div>
            </div>
        </div>


    </div>
</template>

<script>
    export default {
        //使用详情
        name: "use-details",
        data(){
            return {
                dat:{
                    flag:true
                }
            }
        },
        methods:{
            getDataList(){
              this.$axios.get("").then((res)=>{
                  console.log(res)
              })
            },
            opened(){
                this.$dialog.confirm({
                    title: ' ',
                    mes: '是否激活该车辆电池',
                    opts: () => {
                        // this.$router.push("/")
                        this.dat.flag = true
                    }
                });
            },
            closed(){
                this.$dialog.confirm({
                    title: ' ',
                    mes: '该车XXX分钟没有发生位移，是否确认关闭？',
                    opts: () => {
                        // this.$router.push("/")
                        this.dat.flag = false
                    }
                });
            }
        }

    }
</script>

<style scoped lang="less">
    @color:#00CFB5;
    .use_details{
        background:#efefef;
        height:100%;
        .details_tit{
            height:.9rem;
            line-height:.9rem;
            padding:0 .24rem;
            font-size:.32rem;
            background:#ffffff;
            border-bottom:1px solid #dddddd;
        }
        .det_cont{
            height:2rem;
            background:#ffffff;
            margin-bottom:.2rem;
            font-size:.3rem;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            padding:.2rem .24rem;
            div span{
                margin-left:.3rem;
            }
        }
        .tenant_cont{
            height:3.76rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background:#ffffff;
            margin-bottom:.2rem;
            .tenant_left{
                height:100%;
                flex-grow:1;
                margin-bottom:0;
            }
            .tenant_right{
                width:2.2rem;
                text-align: center;
                span{
                    width:1.68rem;
                    height:.6rem;
                    display: inline-block;
                    border-radius:.3rem;
                    text-align: center;
                    line-height:.6rem;
                }
                .close{
                    color:red;
                    border:1px solid red;
                }
                .open{
                    color:@color;
                    border:1px solid @color;
                }
            }
        }
    }
    .abnormal_cont {
        background: #fff;
        > div {
            height: .6rem;
            line-height: .6rem;
            font-size: .28rem;
            padding: 0 .15rem;
            span,textarea,img {
                margin-left: .3rem;
            }
            textarea{
                background: #fff;
                border: 1px dotted #ccc;
                border-radius: 4px;
                padding: 0.1rem;
            }
            &:nth-of-type(3) {
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
            &:nth-of-type(4) {
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
