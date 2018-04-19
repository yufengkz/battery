<template>
    <div class="ser_body">
        <div class="top">
            <span class="icon"><img src=""> </span>
            <span class="send">您已完成本次送达</span>
        </div>
        <div class="bottom">
            <router-link to="/serKio">
                <yd-button-group>
                    <yd-button size="large" @click.native="handleClick" bgcolor="#00CFB5" color="#ffffff">确认</yd-button>
                </yd-button-group>
            </router-link>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ser-send-sure",
        data(){
            return{

            }
        },
        methods: {
            handleClick() {

            }
        }
    }
</script>

<style scoped lang="less">
 @color:#00CFB5;
    .ser_body{
        .top{
            .icon{
                text-align: center;
                margin-top:1.20rem;
                width:1.25rem;
                height:1.25rem;
            }
            .send{
                text-align: center;
                font-size: 0.34rem;
                color:#333333;
            }
        }
        .bottom{
            margin-top:3.20rem;
            text-align: center;

        }
    }
</style>
