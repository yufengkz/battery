import Vue from 'vue'
import Router from 'vue-router'
/*==================配电工厂start===================*/
//配电工厂
import BatFac from '../components/batteryFactory/index/index'
//入库记录
import WarRec from '../components/batteryFactory/warRec'
//搜索
import WarSch from '../components/batteryFactory/warSch'
//电池列表
import BatLis from '../components/batteryFactory/batteryList'
//扫码充电 低电待充
import ScaCha from '../components/batteryFactory/scaCha'
//扫码确认
import Confir from '../components/batteryFactory/confir'
//电池汇总
import DisSta from '../components/batteryFactory/disSta'
//三级路由 异常反馈
import Details from '../components/batteryFactory/details'
import AbnFee from '../components/batteryFactory/abnFee'
import Inventory from '../components/batteryFactory/Inventory'
/*=======================配电工厂end======================*/

/*=================服务亭start================*/
//服务亭
import SerKio from '../components/serviceKiosk/index/index'
//入库记录
import SerWarRec from '../components/serviceKiosk/serWarRec'
//搜索
import SerWarSch from '../components/serviceKiosk/serWarSch'
//电池列表
import SerBatLis from '../components/serviceKiosk/serBatteryList'
//扫码确认
import SerConfir from '../components/serviceKiosk/serConfir'
//电池汇总
import SerDisSta from '../components/serviceKiosk/serDisSta'
//三级路由 异常反馈
import SerDetails from '../components/serviceKiosk/serDetails'
import SerAbnFee from '../components/serviceKiosk/serAbnFee'
//开始配送
import SerStartTrans from "../components/serviceKiosk/serStartTrans"
import SerBattTran from '../components/serviceKiosk/serBattTra'
//确认送达
import SerSendSure from "../components/serviceKiosk/serSendSure"
//使用详情
import UseDetails from "../components/serviceKiosk/useDetails"
/*=====================服务亭end================*/

/*=====================电池运输端start=============*/
//电池运输端
import BatTra from '../components/batteryTrans/index/index'

import BatIndex from  '../components/batteryTrans/batteryIndex'
//入库记录
import WarRec1 from '../components/batteryTrans/warRec'
//搜索
import WarSch1 from '../components/batteryTrans/warSch'
//入库记录列表详情
import BatLis1 from '../components/batteryTrans/batteryList'
//配送记录详情
import TransBatLis1 from  '../components/batteryTrans/transBatteryList'
//扫码充电 低电待充
import ScaCha1 from '../components/batteryTrans/scaCha'
//扫码确认
import Confir1 from '../components/batteryTrans/confir'
//三级路由 异常反馈
import Details1 from '../components/batteryTrans/details'
//
import AbnFee1 from '../components/batteryTrans/abnFee'
//开始配送
import StartTrans from "../components/batteryTrans/startTrans"
//配送记录
import Distribution from  "../components/batteryTrans/distribution"
/*=========================电池运输端end===================*/



//登录页
import Login from '../components/jurisdiction/login/Login'
//帐号绑定
import RelatedPhone from '../components/jurisdiction/accounts/relatedPhone'
//设置、修改密码
import Password from '../components/jurisdiction/accounts/password'
//重置密码
import Repassword from '../components/jurisdiction/accounts/rePassword'

//User
import User from '../components/user/index/Index'
//认证
import Authentication from '../components/user/authentication/Authentication'
//认证成功
import Certified from '../components/user/authentication/Certified'
//
import Deposit from '../components/user/money/Deposit'


//test tab
import Tab from '../components/user/test/tab'
import Upload from '../components/common/upLoad'

Vue.use(Router)

export default new Router({
    // mode: 'history',//'hash'则一切正常
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        //配电工厂start================================================
        {
            path: '/batFac',
            name: ' 工厂端 ',
            component: BatFac,
        },
        {
            path: '/batFac/disSta/:tabindex',
            name: '电池统计 ',
            component: DisSta
        },
        {
            path: "/batFac/details/:battery_id",
            name: " 异常详情",
            component: Details
        },
        {//异常反馈
            path: "/batFac/abnFee",
            name: " 异常反馈",
            component: AbnFee
        },
        {
            path: '/batFac/scaCha/:factory_id',
            name: ' 今日配送 ',
            component: ScaCha
        },
        {//入库记录
            path: '/batFac/warRec/:factory_id',
            name: ' 入库记录 ',
            component: WarRec
        },
        {//搜索
            path: '/batFac/warSch',
            name: "工厂端",
            component: WarSch
        },
        {
            path: "/batFac/batLis",
            name: " 入库详情",
            component: BatLis
        },
        {
            path: '/batFac/inventory',
            name: ' Inventory',
            component: Inventory
        },
        {
            path: "/confir/:type",
            name: " 扫码确认",
            component: Confir
        },
        // 配电工厂end================================================

        //服务亭start==============================================
        {
            path: "/serKio",
            name: '服务站端',
            component: SerKio
        },
        {
            path:"/serKio/useDetails",
            name:"使用详情",
            component:UseDetails
        },
        {
            path: '/serKio/serDisSta/:tabindex',
            name: ' 确认 ',
            component: SerDisSta
        },
        {
            path: "/serKio/serDetails",
            name: " 异常详情 ",
            component: SerDetails
        },
        {//异常反馈
            path: "/serKio/serAbnFee",
            name: " 异常反馈 ",
            component: SerAbnFee
        },
        {//入库记录
            path: '/serKio/serWarRec',
            name: ' 入库记录',
            component: SerWarRec
        },
        {//搜索
            path: '/serKio/serWarSch',
            name: " 搜索页 ",
            component: SerWarSch
        },
        {
            path: "/serKio/serWarRec/serBatLis",
            name: " 电池列表 ",
            component: SerBatLis
        },
        {
            path: "/serKio/serConfir/:type",
            name: " 扫码确认 ",
            component: SerConfir
        },
        {
            path:"/serKio/serStartTrans",
            name:" 电池运输端",
            component:SerStartTrans
        },
        {
            path:"/serKio/serBattTran",
            name:"电池运输端 ",
            component:SerBattTran
        },
        {
            path:"/serKio/serSendSure",
            name:" 确 认 ",
            component:SerSendSure
        },
        //服务亭end================================================

        //电池运输端start===========================================
        {
            path: "/batTra",
            component: BatTra,
            children:[
                {
                    path:"/batTra/batIndex",
                    name:" 电池运输端  ",
                    component:BatIndex
                },
                {
                    path:"/batTra/startTrans",
                    name:" 电池运输端 ",
                    component:StartTrans
                },
                {
                    path:"/batTra",
                    redirect:"/batTra/batIndex"
                }
            ]
        },
        {
            path: "/batTra/details1",
            name: "异常详情",
            component: Details1
        },
        {//异常反馈
            path: "/batTra/abnFee1",
            name: "异常反馈",
            component: AbnFee1
        },
        {
            path: '/batTra/scaCha1',
            name: '今日配送',
            component: ScaCha1
        },
        {//入库记录
            path: '/batTra/warRec1',
            name: '入库记录',
            component: WarRec1
        },
        {//搜索
            path: '/batTra/warSch1',
            name: "搜索页",
            component: WarSch1
        },
        {
            path: "/batTra/warRec1/batLis1",
            name: " 运输记录",
            component: BatLis1
        },
        {
            path: "/batTra/warRec1/traBatLis1",
            name: "运输记录",
            component: TransBatLis1
        },
        {
            path: "/batTra/confir1/:type",
            name: "扫码确认",
            component: Confir1
        },
        {
            path:"/batTra/distribution",
            name:"配送记录",
            component:Distribution
        },
        //电池运输端end=======================================================

        //登录页
        {
            path: '/login',
            name: '登录授权',
            component: Login,
        },
        //User
        {
            path: '/user',
            name: '用户中心',
            component: User
        },
        //绑定帐号
        {
            path: '/user/relatedphone/:openId',
            name: '帐号绑定',
            component: RelatedPhone
        },
        //修改密码
        {
            path: '/user/password',
            name: '设置密码',
            component: Password
        },
        {
            path: '/user/repassword',
            name: '修改密码',
            component: Repassword
        },
        //上传身份证信息
        {
            path: '/user/authentication',
            name: '认证中心',
            component: Authentication
        },
        //已认证
        {
            path: '/user/certified',
            name: '认证成功',
            component: Certified
        },
        //押金
        {
            path: '/user/deposit',
            name: '个人中心 - 押金',
            component: Deposit
        },
        //test tab
        {
            path: '/user/tab',
            name: 'tab',
            component: Tab
        },
        //test upLoad
        {
            path: '/upload',
            name: '图片上传',
            component: Upload
        }
    ]
})


