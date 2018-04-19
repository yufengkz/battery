<template>
    <div id="app" class="yd-flexview">
        <transition name="slide-fade">
            <router-view v-show="show"></router-view>
        </transition>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                show: true
            }
        }
    }
</script>

<style lang="less">
    @color: #00CFB5;
    #app {
        height: 100%;
        -webkit-font-smoothing: none;
    }

    .yd-tab-nav-item:not(:last-child):after {
        border-right: 0;
    }

    .yd-navbar .yd-navbar-item {
        width: 70%;
    }

    .yd-popup-center {
	    background: #fff;
        border-radius: 20px !important;
    }

    //disSta没有更多数据时显示
    .upwarp-nodata {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    /* 可以设置不同的进入和离开动画 */
    /* 设置持续时间和动画函数 */
    .slide-fade-enter-active {
        transition: all .3s ease;
    }

    .slide-fade-leave-active {
        transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }

    .slide-fade-enter, .slide-fade-leave-to
        /* .slide-fade-leave-active for below version 2.1.8 */ {
        transform: translateX(10px);
        opacity: 0;
    }

    /*搜索框*/
    .searched {
        background: #fff;
        height: 100%;
    }

    .yd-search {
        .yd-search-input {
            background: #fff;
            display: flex;
            &:after {
                border-bottom: none;
            }
            .search-input {
                background: #efefef;
                border-radius: .4rem;
                font-size: .26rem;
                border: 1px solid #ddd;
                height: .7rem;
            }
            .cancel-text {
                display: block;
                height: .7rem;
                line-height: .7rem;
            }
        }
    }

    /*全局整体颜色*/
    .red {
        color: red;
    }

    .blue {
        color: @color;
    }

    /*  /batTra/startTrans  多选框*/
    .yd-checkbox {
        padding-right:0;
        .yd-checkbox-text {
            display: none;
        }
        .yd-checkout-circle {
            line-height: .9rem;
        }
    }
</style>
