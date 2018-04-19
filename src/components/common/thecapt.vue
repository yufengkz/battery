<template>
    <yd-navbar>
        <div slot="left">
            {{cpt}}
        </div>

        <router-link to="#" slot="right" v-show="bool" tag="div">
            <img src="./../../assets/img/mine2.png" alt="">
        </router-link>
    </yd-navbar>
</template>

<script>
    export default {
        name: "captions",
        props:["bool","cpt"]
    }
</script>

<style scoped lang="less">
    img{
        height:0.4rem;
        width:0.4rem;
    }
</style>
