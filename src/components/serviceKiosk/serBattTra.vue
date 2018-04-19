<template>
    <div class="body">
         <div class="top">
             <span class="car">
                <img src="" alt="">
             </span>
         </div>
        <div class="middle">
            <ul v-for="(item,index) in list" class="list">
                <li>
                    <span>您目前正在前往:</span>
                    <span>{{list.go}}</span>
                </li>
                <li>
                    <span>开始时间:</span>
                    <span>{{list.time}}</span>
                </li>
            </ul>
        </div>
        <div class="bottom">
            <yd-button-group>
                <yd-button @click.native="openConfrim" size="large" bgcolor="#00CFB5" color="#ffffff">确认送达</yd-button>
            </yd-button-group>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ser-batt-tran",
        data(){
            return{
               list:{
                   go:'xxx服务点',
                   time:'2018-8-18 18:18'

               }
            }
        },
        methods: {
            openConfrim() {
                this.$dialog.confirm({
                    title: '',
                    mes: '请您务必与服务站进行电池核实后,再点击确认操作！',
                    opts: () => {
                        // this.$dialog.toast({mes: '你点了确定', timeout: 1000});
                        this.$router.push("/batTra/sendSure")
                    }
                });
            }
        }
    }
</script>

<style scoped lang="less">

</style>
