<template>
    <div class="ser_batt_tran2">
        <div class="far">
            <div class="son">
                <span class="top">服务站1</span>
                <span class="bottom">配送总量
                    <i class="col">40块</i>
                    <span><img src="" alt=""> </span>
                </span>
            </div>
        </div>
        <div class="far">
            <div class="son">
                <span class="top">服务站2</span>
                <span class="bottom">配送总量
                    <i class="col">40块</i>
                    <span><img src="" alt=""></span>
                </span>
            </div>
        </div>
        <div class="far">
            <div class="son">
                <span class="top">服务站3</span>
                <span class="bottom">配送总量
                    <i class="col">40块</i>
                    <span>已完成</span>
                </span>
            </div>
        </div>
        <div class="butt">
            <router-link to="/serKio/serBattTran">
                <yd-button size="large" type="primary" bgcolor="#00CFB5" color="#ffffff">开始配送</yd-button>
            </router-link>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ser-batt-tran2",
        data() {
            return {}
        },
        methods: {}
    }
</script>

<style scoped lang="less">
    @color: #00CFB5;
    .col {
        color: @color;
    }
    .butt{
        padding:0 .24rem;
        width:100%;
        max-width:750px;
    }
    .ser_batt_tran2 {
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
                    color: #101010;
                    font-size: 0.32rem;
                    border-bottom: 1px solid #dddddd;
                    padding-left: 0.22rem;

                }
                .bottom {
                    display: block;
                    color: #101010;
                    font-size: 0.32rem;
                    padding-left: 0.22rem;

                }
            }
        }
    }
</style>
