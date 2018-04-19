<template>
    <div  class="liebiao">
        <div class="liezuo">
            <img :src="imga" >
        </div>
        <div class="lieyou">
            <div>{{bt}}</div>
            <div>{{ct}}</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "the-lister",
        data(){
            return {

            }
        },
        props:["imga","bt","ct"]
    }
</script>

<style scoped lang="less">
    .liebiao{
        width:100%;
        height:100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .lieyou{
        >div:nth-of-type(1){
            font-size:14px;
        }
        >div:nth-of-type(2){
            color:#03C5B0;
            font-size:14px;
        }
    }
</style>
