<template>
	<div class="autt_box">
		<div class="certified">
			<img src="../../../assets/img/ico_certified.png" alt="">
			<p>认证通过</p>
		</div>
		<yd-cell-group>
			<yd-cell-item>
				<span slot="left">真实姓名&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
				<input slot="right" type="text" placeholder="请输入您的真实姓名" value="张三" disabled>
			</yd-cell-item>
			<yd-cell-item>
				<span slot="left">身份证号&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
				<input slot="right" type="text" placeholder="请输入您的身份证号" value="张三" disabled>
			</yd-cell-item>
		</yd-cell-group>
	</div>
</template>

<script>
	export default {
		name: 'authentication',
		data(){
			return{

			}
		},
		methods: {

		},
		components: {

		}
	}
</script>

<style scoped lang="less">
	.autt_box{
		height: 100%;

		.certified{
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			padding: 0.8rem 0;
			img{
				width: 1.1rem;
				height: 1.1rem;
			}
			p{
				margin-top: 0.34rem;
				font-size: 0.34rem;
				color: #666666;
			}
		}

		//调整线条边距
		.yd-cell-item:not(:last-child):after{
			margin-left: 0;
		}
	}
</style>