<template lang="pug">
	.info-container
		.top-wrapper
			.poster(:style="{backgroundImage:'url('+movie.poster+')'}")
			.movie-info
				h1 {{movie.name}}
				h2 {{movie.name_original}}
				.space
				.rating-container
					.imdb
					p {{movie.rating?movie.rating.imdb.ratio:''}}
					p {{movie.rating?movie.rating.imdb.votes_count:''}}
					
				.rating-container
					.kinopoisk
					p {{movie.rating?movie.rating.kinopoisk.ratio:''}}
					p {{movie.rating?movie.rating.kinopoisk.votes_count:''}}

				.space
				span(v-for="genre in movie.genre" :key="genre" @click="click('genre',genre)").pink
					| {{genre}}
				.space
				span(v-for="country in movie.country" :key="country" @click="click('country',country)").blue
					| {{country}}
		.description {{movie.description}}

		.seasons-wrapper
			.season-container(v-for="season in movie._seasons" :key="season._id")
				.small-poster(:style="{backgroundImage:'url('+season.poster+')'}")
				.info
					h1 Сезон {{season.season_number}} ({{season.year}})
					div.hr.orange
					p {{season.description}}
</template>

<script lang="ts">
	import Vue from "vue";
	import Component from "vue-class-component";
	import { Cache } from "@/Cache";
	import WebsocketClientConnector from "@/WebsocketClientConnector";
	
	const wsc = WebsocketClientConnector.getInstance();
	const cch = Cache.getInstance();
	
	@Component({ components: {}, props: {} })
	export default class MovieFullInfo extends Vue {
		movie = {};
		click(field, value) {
			this.$router.push({
				name: "find",
				params: { field: field, value: value }
			});
			console.log(field, value);
		}
		async mounted() {
			if (cch.getMovieById(this.$route.params.id)) {
				this.movie = Cache.getInstance().getMovieById(
					this.$route.params.id
				);
			} else {
				let resp = await wsc.getMovieById(this.$route.params.id);
				if (resp.length > 0) {
					Cache.getInstance().pushMovie(resp[0]);
					this.movie = resp[0];
				}
			}
		}
	}
</script>

<style lang="stylus" scoped>
    @import './../styles/*'

	.rating-container
		height 30px
		width 150px
		box-sizing border-box
		display flex
		justify-content space-between
		align-items center
		align-content center
		background-color #202020
		margin-bottom 10px
		border-radius 20px 4px 4px 20px
		box-shadow 1px 1px 3px 0 rgba(0,0,0,0.8)

		p 
			flex-shrink 0
			// height 100%
			height 90%
			font-size 14px
			text-align center
			color #eee
			font-weight bold
			// padding 2px 5px 1px 5px
			flex-grow 1
			box-sizing border-box
			// margin-top -10px
			

		p~p
			width 70px
			flex-grow 0
			border-left 1px solid #444
			
		.imdb,.kinopoisk
			background #ff0 no-repeat
			background-position 50% 50%
			background-size 100% 100%
			height 100%
			width 30px
			flex-shrink 0
			margin-right 5px
			border-radius 40px
		.imdb 
			background-image url('/assets/imdb-logo.jpg')
		.kinopoisk 
			background-image url('/assets/kinopoisk-logo.jpg')

	.space
		margin 20px

	.info-container
		padding 20px 40px

	.poster
		background-color #888 no-repeat
		height (500px/1.5)
		width (350px/1.5)
		background-position 50% 50%
		background-size cover
		float none 
		flex-shrink 0

	.top-wrapper
		margin-bottom 20px
		box-sizing border-box
		text-align justify
		display flex
		flex-direction row
		flex-wrap nowrap
		justify-content flex-start
		.movie-info
			padding 0 0 0 40px
			flex-shrink 1
		.description
			padding 20px 0
		h1
			font-size 30px
		h2
			font-size 20px
			color #888

	.hr
		hr()
		margin 10px 0
	.seasons-wrapper
		.season-container
			width 100%
			display flex
			flex-direction row
			justify-content flex-start
			align-items center
			box-sizing border-box
			border-bottom 1px solid #ccc
			padding 10px 0 20px 0
			text-align justify

			h1
				font-size 20px
				color #999
			.small-poster 
				@extend .poster
				height (500px/2.5)
				width (500px/2.5)
				float none
				flex-shrink 0
				margin 15px 50px 15px 0
				border-radius 500px

			p 
				font-size 12px
		
	for $key, $color in $normal
		h1.{$key}
			colorize(lighten($color,40%),'fg')

		div.{$key}
			colorize($color,'bg')

		span.{$key}
			background lighten($color,60%)
			color desaturate(darken($color,40%),60%)
			padding 5px 15px 7px 15px
			margin 5px 5px 0 0
			display inline-block
			// box-shadow 0 1px 3px 0 rgba(0,0,0,0.15)
			&:hover
				background lighten($color,65%)
				cursor pointer


</style>
