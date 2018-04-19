<template>
	<div class="v-toast" @click.stop.prevent="closeModal">
		<div class="v-toast-box">
			<h2 v-if="showInfo.title" v-bind:style="{fontSize: showInfo.fontSize || ''}">{{showInfo.title}}</h2>
			<p v-if="showInfo.disc">{{showInfo.disc}}</p>
			<a v-if="showInfo.tel" href="tel:400-1234-0987">{{showInfo.tel}}</a>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'tip',
		props:["showInfo"],
		data(){
			return{

			}
		},
		methods:{
			closeModal(){
				this.$emit('close')
			}
		}
	}
</script>

<style scoped lang="less">
	.v-toast{
		position: fixed;
		top: 0;
		left: 0;
		z-index: 6;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		padding: 0 1.04rem;
		display: flex;
		justify-content: center;
		align-items: center;

		.v-toast-box{
			background: #fff;
			flex: 1;
			border-radius: 0.24rem;
			padding: 0.2rem 0;

			h2{
				line-height: 0.92rem;
				text-align: center;
				font-size: 0.36rem;
				color: #333;
				font-weight: normal;
				border-bottom: 1px solid #eaeaea;
			}
			p{
				font-size: 0.26rem;
				color: #333;
				text-align: center;
				padding: 0.25rem 0.5rem;
			}
			a{
				display: block;
				margin-top: 0.2rem;
				text-align: center;
				font-size: 0.3rem;
				color: #ff5858;
				font-weight: normal;
			}
		}
	}
</style>