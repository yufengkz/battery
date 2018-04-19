<template>
    <div>
        <!--模拟的标题-->
        <p class="header"><a class="btn-left">main</a> 示例: 在vue中使用mescroll</p>
        <!--滑动区域-->
        <div id="mescroll" class="mescroll">
            <!--展示上拉加载的数据列表-->
            <ul id="dataList" class="data-list" v-cloak>

            </ul>
        </div>
    </div>
</template>

<script>
    //import '../../../assets/css/mescroll.min.css'
    //import MeScroll from 'mescroll.js'

    export default {
        name: 'Inventory',


    }

    /*联网加载列表数据
     请忽略getListDataFromNet的逻辑,这里仅仅是在本地模拟分页数据,本地演示用
     实际项目以您服务器接口返回的数据为准,无需本地处理分页.
     * */
    function getListDataFromNet(pageNum, pageSize, successCallback, errorCallback) {
        //延时一秒,模拟联网
        setTimeout(function () {
//          	axios.get("xxxxxx", {
//					params: {
//						num: pageNum, //页码
//						size: pageSize //每页长度
//					}
//				})
//				.then(function(response) {
            var data = pdlist1; // 模拟数据: ../res/pdlist1.js
            var listData = [];//模拟分页数据
            for (var i = (pageNum - 1) * pageSize; i < pageNum * pageSize; i++) {
                if (i == data.length) break;
                listData.push(data[i]);
            }
            successCallback && successCallback(listData);//成功回调
//				})
//				.catch(function(error) {
//					errorCallback&&errorCallback()//失败回调
//				});
        }, 500)
    }
</script>

<style scoped>

</style>
