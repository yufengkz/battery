import Vue from 'vue'
import 'babel-polyfill'
import App from './App'
import store from './store'
import VueRouter from 'vue-router'
import router from './router'
import axios from 'axios'
import YDUI from 'vue-ydui'
//对axios封装
import axiosIns from '@/assets/js/axiosIns.js'
// 引入warRec里面的搜索框
import 'vue-ydui/dist/ydui.base.css'
// 引入warRec里面的表格
import 'vue-ydui/dist/ydui.rem.css'

//解决移动端点击300ms延迟
const FastClick = require('fastclick');
document.addEventListener('DOMContentLoaded', function () {
	FastClick.attach(document.body);
}, false);

// 将API方法绑定到全局
import root from './config/api'
Vue.use(VueRouter);
Vue.use(YDUI);
Vue.config.productionTip = false;
//请求方式
let ajaxMethod = ['get', 'post', 'delete', 'patch', 'put']; //patch 修改  post 添加  put 修改
let api = {};
ajaxMethod.forEach((method) => {
	//数组取值的两种方式
	api[method] = (uri, data, config) => {
		return new Promise(function (resolve, reject) {
			let url
			if(uri.indexOf('http:') > -1){
				url = uri
			}else{
				url = root + uri
			}
			axiosIns[method](url, data, config).then((response) => {
				//请求成功
				if (response.status === 200) {
					resolve(response)
				} else {
					reject(response)
				}
			})
		})
	}
});
Vue.prototype.$axios = api;

/* 1 处理ajax库axios，为了以后不重复引用，挂在原型对象上
 * 2 axios是封装在main.js里面的，是为了获取vue实例操作store、router
 * 3 组件里面使用this.$axios.get 或 this.$axios.post 调用  使用debugger，查看接口返回数据的走向
 */

const app = new Vue({
	store,
	router,
	render: v => v(App)
}).$mount('#app');

let scrollTop = 0;
router.beforeEach((route, redirect, next) => {
	//检测登录信息是否过期
	//if( ! app.$store.state.userInfo) return app.$router.push({path: '/login'})
	if (redirect.path === '/') {
		scrollTop = document.getElementById('app').scrollTop;
	}
	document.title = route.name;

	next();
});

router.afterEach(route => {
	if (route.path === '/') {
		Vue.nextTick(() => {
			document.getElementById('app').scrollTop = scrollTop;
		});
	} else {
		document.getElementById('app').scrollTop = 0;
	}
});
