<template lang="pug">
	div
		.container-list
			MovieCard(v-for="movie in movies" :key="movies._id" :movie="movie")
		div(v-if="movies.length<1")
			h2 По запросу ничего не найдено
		.more-button(@click='getMore()') загрузить
</template>

<script lang="ts" scoped>
	import Vue from "vue";
	import Component from "vue-class-component";
	import { Cache } from "@/Cache";
	import WebsocketClientConnector from "@/WebsocketClientConnector";

	import MovieCard from "./MovieCard.vue";
import { Watch } from 'vue-property-decorator';

	const wsc = WebsocketClientConnector.getInstance();
	const cch = Cache.getInstance();
	@Component({ components: { MovieCard }, props: {} })
	export default class App extends Vue {

		@Watch('$route.params',{ immediate: false, deep: true })
		onRouteChanged(val: string, oldVal: string){
			this.movies=[]
			this.fetch();
		}

		movies = [];
		getMore() {
			this.fetch();
		}
		async fetch() {
			let field = this.$route.params["field"];
			let val = this.$route.params["value"];
			if (field === "genre" || field === "country") {
				let query = {};
				query[field] = field === "genre" ? val.toLowerCase() : val;
				let response = await wsc.fetchMovies(query, this.movies.length);
				for (let i = 0; i < response.length; i++)
					this.movies.push(response[i]);
			} else if (field === "name") {
				let query = {
					$or: [
						{ name: { $regex: "^" + val, $options: "i" } },
						{ name_original: { $regex: "^" + val, $options: "i" } }
					]
				};
				let response = await wsc.fetchMovies(query, this.movies.length);
				for (let i = 0; i < response.length; i++)
					this.movies.push(response[i]);
			} else {
				console.log("bad query");
			}
		}

		beforeMount() {
			window.scrollTo({ top: 0 });
			this.fetch();
		}
	}
</script>

<style lang="stylus" scoped>
    @import './../styles/*'

    .container-list
        padding 20px 40px
        rowFlexContainer()
    .more-button
        height 30px
        width 150px
        padding-top 4px
        background $bg=#cccccc
        margin auto
        margin-bottom 40px
        text-align center
        &:hover
            cursor pointer
            background-color lighten($bg,15%)
</style>