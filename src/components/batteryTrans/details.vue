<template>
    <ul class="tra_details">
        <li><span>电池编号:</span> <span>{{detailsInfo.battery_number}}</span></li>
        <li><span>电池电量:</span> <span>{{detailsInfo.battery_power}}</span></li>
        <li><span>电池状态:</span> <span>{{detailsInfo.battery_status}}</span></li>
        <li><span>电池情况:</span> <span>{{detailsInfo.exception_type}}</span></li>
        <li>
            <span>异常描述:</span>
            <textarea placeholder="0-50个字" maxlength="50" disabled>{{detailsInfo.exception_description}}</textarea>
        </li>
        <li>
            <span>异常照片:</span>
            <img v-for="(item, index) in picture_path" :src="detailsInfo.picture_server_path + item"/>
        </li>
    </ul>
</template>

<script>
    export default {
        //异常详情
        name: "tra-datails",
        data(){
            return {
                detailsInfo:{},
                picture_path: []
            }
        },
        mounted(){
            this.detailsInfo = JSON.parse(localStorage.getItem("abnormalOf"));
            console.log(this.detailsInfo)
            this.getBatteryException()

        },
        methods: {
            //
            getBatteryException(){
                let battery_id = this.detailsInfo.battery_id;
                if(battery_id == 'null') return;
                let url = `battery_exception/${battery_id}`;
                console.log(url);
                this.$axios.get(url).then( (data) => {
                    let res = data.data;
                    console.log(res);
                    if(res.code === 200){
                        this.detailsInfo = res.data
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
    .tra_details {
        background: #fff;
        > li {
            height: .6rem;
            line-height: .6rem;
            font-size: .28rem;
            padding: 0 .15rem;
            span:nth-of-type(1) {
                margin-right: .4rem;
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
