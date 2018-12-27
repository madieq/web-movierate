<template lang="pug">
	.index-container
		h1 Жанры:
		span(v-for="genre in genres" :key="genre+'_lst'" @click="click('genre',genre)").pink {{genre}}
		div(v-for="(genre,genreKey,i) in movieByGenre" :key="genreKey" v-if="genre.length>0")
			h1 {{genreKey}}
			.hr(:class="[getColorName(i)]")
			.row-list
				Movie-Card(v-for="movie in movieByGenre[genreKey]" :key="movie._id" :movie="movie")
			.space
</template>

<script lang="ts">
	import Vue from "vue";
	import Component from "vue-class-component";
	import WClient from "@/WebsocketClientConnector";
	import { Cache } from "@/Cache.ts";
	import * as lodash from "lodash";

	import MovieCard from "./MovieCard.vue";
	import { Watch } from "vue-property-decorator";
	import { Util } from "@/Util";

	const wsc = WClient.getInstance();
	const cch = Cache.getInstance();

	@Component({ components: { MovieCard }, props: {} })
	export default class Index extends Vue {
		movieByGenre = {};
		genres = [];
		countries = [];

		async initLoading() {
			let genres: any = (await wsc.fetchGenres()).sort((a, b) => {
				return Math.random() > 0.5 ? 1 : -1;
			});
			genres = genres.slice(0, 7);
			for (let i = 0; i < genres.length; i++) {
				let gen = genres[i];
				let filt = { genre: ("" + gen.name).toLowerCase() };
				let moviesArr = (await wsc.fetchMovies(
					filt,
					Math.floor(Math.random() * 100)
				)).slice(0, 5);
				Vue.set(this.movieByGenre, gen.name, moviesArr);
			}
		}
		click(field, value) {
			this.$router.push({
				name: "find",
				params: { field: field, value: value }
			});
			console.log(field, value);
		}

		async beforeMount() {
			this.genres = (await wsc.fetchGenres()).map((item: any) => {
				return item.name;
			});
			if (Cache.getInstance()._operative["index_movieByGenre"]) {
				if (
					Object.keys(
						Cache.getInstance()._operative["index_movieByGenre"]
					).length > 0
				) {
					this.movieByGenre = Cache.getInstance()._operative[
						"index_movieByGenre"
					];
				} else {
					this.initLoading();
				}
			} else {
				this.initLoading();
			}
		}

		destroyed() {
			Cache.getInstance()._operative["index_movieByGenre"] = lodash.cloneDeep(
				this.movieByGenre
			);
		}

		getColorName(i) {
			let colors = ["pink", "blue", "red", "orange"];
			return colors[i % (colors.length - 1)];
		}
	}
</script>

<style lang="stylus" scoped>
    @import './../styles/*'

    .index-container
        margin auto
        background #fff
        min-height 100vh
        width 100%
        max-width 1920px
        padding 20px 40px 20px 40px
        box-sizing border-box
        color #444
        p
            color #444

    .row-list
        rowFlexContainer()
        justify-content flex-start

    span 
        background orangeBG
        color orangeFG

    .space
        width 100%
        height 20px
        
    .hr
        height 1px
        width 20%
        margin 5px 0px 20px 0
        // background #888
    
    // for $key, $color in $normal
    //     h1.{$key}
    //         colorize(lighten($color,40%),'fg')

    //     div.{$key}
    //         colorize($color,'bg')

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
