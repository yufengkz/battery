<template>
    <div class="alis">
        <ul class="oul">
            <li>
                <span>电池编号:</span>
                <span>B111111</span>
            </li>
            <li>
                <span>电池电量:</span>
                <span>100%</span>
            </li>
            <li>
                <span>电池状态:</span>
                <span style="display:inline-block;">
                    <i>正常</i>
                    <router-link to="#" v-show="flag">
                        查看异常反馈 》
                    </router-link>
                </span>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "电池状态",
        data(){
            return {
                flag:false
            }
    }
    }
</script>

<style scoped lang="less">
    .oul{
        height:92px;
        padding:0 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        li:nth-of-type(3){
            display: flex;
            justify-content: space-between;
            >span:nth-of-type(2){
                flex-grow:1;
                display: flex;
                justify-content: space-between;
            }
        }
        span{
            font-size:14px;
            &:nth-of-type(2){
                margin-left:10px;
            }
        }
    }
</style>
