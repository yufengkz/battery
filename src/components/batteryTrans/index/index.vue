<template>
    <div class="bat_tra">

        <!--头部-->
        <div class="indexhead">
            <div class="head_left" v-if="transporter_name">
                {{transporter_name}}运输员
            </div>
            <div class="head_left" v-else>
                XXXX运输员
            </div>
            <router-link to="/user" class="head_right" tag="div">
                <img src="../../../assets/img/mine2.png" alt="">
            </router-link>
        </div>

        <!--视口-->
        <div class="body_view">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    import util from '../../../assets/js/util'

    export default {
        name: 'bat-tra',
        data() {
            return {
                transporter_name: "",//运输员名字
                transporter_id:"" || null
            }
        },
        computed: {
            isLoading() {
                return this.$store.state.isLoading
            }
        },
        mounted() {
            this.getTransporterInfo()
        },
        methods: {
            //	获取运输员信息
            getTransporterInfo() {
                let userInfo = this.$store.state.userInfo.account_id ? this.$store.state.userInfo : (util.getCookie('userInfo') ? JSON.parse(util.getCookie('userInfo')) : {})
                let account_id = userInfo.account_id;
                //获取运输员名字
                let url1 = `findByAccount/${account_id}`
                this.$axios.get(url1).then((data) => {
                    let res = data.data;
                    this.transporter_name = res.data.transporter_name;
                    localStorage.setItem("transporter_name", res.data.transporter_name);
                    this.transporter_id = res.data.transporter_id;
                    localStorage.setItem("transporter_id",res.data.transporter_id);
                })
            },
            //判断适口高度 定位最下面元素
            getViewHeight() {
                let h = document.documentElement.clientHeight
                let obj = {
                    position: 'inherit',
                };
                if (h < 500) {
                    return obj
                } else {
                    return null
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    @color: #00CFB5;
    .bat_tra {
        height: 100%;
        display: flex;
        flex-direction: column;
        .indexhead {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: .94rem;
            background: #fff;
            padding: .24rem;
            .head_left {
                font-size: .34rem;
            }
        }

        .indexhead img {
            height: .4rem;
            width: .4rem;
        }

        .body_view {
            flex-grow: 1;
        }
    }

</style>
