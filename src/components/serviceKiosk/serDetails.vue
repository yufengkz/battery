<template>
    <ul class="ser_details" v-if="battery_info">
        <li><span>电池编号:</span> <span>{{battery_info.battery_number}}</span></li>
        <li><span>电池电量:</span> <span>{{battery_info.battery_power}}</span></li>
        <li><span>电池状态:</span> <span>{{battery_info.battery_status}}</span></li>
        <li><span>电池情况:</span> <span>{{battery_info.exception_type}}</span></li>
        <li>
            <span>异常描述:</span>
            <textarea disabled maxlength="50">{{battery_info.exception_description}}</textarea>
        </li>
        <li>
            <span>异常照片:</span>
            <img v-for="(item, index) in picture_path" :src="battery_info.picture_server_path + item"/>
        </li>
    </ul>
</template>

<script>
    export default {
        //异常详情
        name: "ser_datails",
        data(){
            return{
                battery_info: {},
                picture_path: []
            }
        },
        mounted(){
            this.getBatteryException()
            // localStorage.setItem("abnormalDetail",JSON.stringify(item))
        },
        methods: {
            //
            getBatteryException(){
                let id = JSON.parse(localStorage.getItem("abnormalDetail")).battery_id;
                console.log(id);
                if(id == 'null') return;
                let url = `battery_exception/${id}`;
                console.log(url);
                this.$axios.get(url).then( (data) => {
                    let res = data.data;
                    console.log(res);
                    if(res.code === 200){
                        this.battery_info = res.data
                        this.picture_path = res.data.picture_path.split(',')
                    }else{
                        this.$dialog.toast({
                            mes: res.message,
                            timeout: 2000,
                            icon: 'error',
                            callback: () => {
                                //do something
                            }
                        })
                    }
                })
            }
        }
    }
</script>

<style scoped lang="less">
    @color: #00CFB5;
    .ser_details {
        background: #fff;
        > li {
            height: .6rem;
            line-height: .6rem;
            font-size: .28rem;
            padding: 0 .15rem;
            span:nth-of-type(1) {
                margin-right: .4rem;
            }
            textarea{
                background: #fff;
                border: 1px dotted #ccc;
                border-radius: 4px;
                padding: 0.1rem;
            }
            &:nth-of-type(5) {
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
            &:nth-of-type(6) {
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
