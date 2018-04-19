import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		isLoading: true,
		factorylist: [],
		userInfo: {},
		userInfoMore: {},
		factory_id: '',
		factoryInfo: {},
        transporterInfo:{},
        transporter_id:"",
	},
	mutations: {
		updateLoadingStatus(state, isLoading) {
			state.isLoading = isLoading;
		},
		changeFactoryInfo(state, data) {
			state.factorylist = data.factorylist;
		},
		//登录获取到的用户信息
		setUserInfo(state, data) {
			state.userInfo = data
		},
		//获取更多的用户信息
		setUserInfoMore(state, data) {
			state.userInfoMore = data
		},
		setFactoryInfo(state, data) {
            state.factoryInfo = data
        },
        setFactoryId(state, data) {
            state.factory_id = data
        },
        setServiceInfo(state, data) {
            state.serviceInfo = data
        },
	},
	actions: {
		getFactoryInfo(context) {
			this.$axios.get('/paymentof/paperfactory').then((response) => {
				if (response.status === 200) {
					context.commit("changeFactoryInfo", response.data.data);
				}
			})
				.catch((err) => {
					console.log(err);
				})
		}
	}
})

export default store
