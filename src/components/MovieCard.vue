<template lang="pug">
	.container(@mouseover='mOver()' @mouseout='mOut()' @click="clickMovie()")
		.imdb-rating
			.imdb-rating-logo
			.imdb-rating-ratio {{movie.rating.imdb.ratio}}
		.shade-container(:style="{visibility:(shade?'visible':'hidden')}")
			h1 {{movie.name?movie.name:''}}
			h2 {{movie.name_original?movie.name_original:''}}
			.hr
			p {{movie.description.slice(0,100)+'...'}}
		.poster(:style="{backgroundImage:'url('+(movie?$props.movie.poster:'')+')'}")
</template>

<script lang="ts" scoped>
	import Vue from "vue";
	import Component from "vue-class-component";
import { Cache } from '@/Cache';

	@Component({ components: {}, props: { movie: Object } })
	export default class MovieCard extends Vue {
		shade = false;
		mOver() {
			this.shade = true;
		}
		mOut() {
			this.shade = false;
		}
		clickMovie(){
			this.$router.push({name:'movie',params:{id:this.$props.movie._id}})
		}
		mounted(){
			Cache.getInstance().pushMovie(this.$props.movie)
		}
	}
</script>

<style lang="stylus" scoped>
    @import './../styles/*'

	.container
		width (350px/2)
		height (500px/2)
		margin 0 20px 20px 0px
		position relative
		box-sizing  border-box

		// &:nth-child(6)
		// 	margin 0 20px 20px 0px

		&:first-child
			margin-left 0

		&:hover
			cursor:pointer

	.shade-container
		position absolute
		top 0
		left 0
		leftBottomFlexContainer()
		background rgba(0, 0, 0, 0.8)
		width 100%
		height 100%
		padding 10px 5px
		overflow hidden
		box-shadow 0 2px 2px 0 rgba(0,0,0,0.3)

		h1
			font-size 12px
			color #eee
		h2 
			font-size 10px
			color #888
		p 
			font-size 10px
			color #eee
			text-align left
			line-height 1.3em

		.hr
			width 30%
			height 1px
			background #ff0
			margin 1px 0 5px 0

	.poster
		width 100%
		height 100%
		background-repeat no-repeat
		background-color #ccc
		background-position center center
		background-size 100% 100%

	.imdb-rating
		background #202020
		position absolute
		top -2px
		right -4px
		z-index 1
		display flex
		box-sizing border-box
		box-shadow 1px -1px 3px 0 rgba(0,0,0,0.8),inset 0 0 0 1px darken(#e9c536,40%)
		border 1px solid #e9c536
		border-radius 3px
		&-logo
			background-image url('/assets/imdb-logo.jpg')
			background-repeat no-repeat
			width 40px
			height 22px
			background-position center center
			background-size 100% 200%
		&-ratio
			width 40px
			color #ffffff
			font-size 12px
			text-align center

</style>