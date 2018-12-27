<template lang="pug">
header
	Head-Panel
	.container
		.head-wrapper
			router-link(:to="'/'")
				.logo-box
					div(style="height:50px;width:50px;")
			.search-container
				input.head-search-container(placeholder="search" @keyup.enter="find($event.target.value)" v-model="value") 
			//- Movie-Tag
		Auth
</template>

<script lang="ts">
	import Vue from "vue";
	import Component from "vue-class-component";
	// import { WSClient } from "@/WSClient.ts";
	import WClient from "@/WebsocketClientConnector";
	import { Cache } from "@/Cache";

	import HeadPanel from "./HeadPanel.vue";
	import Auth from "./Auth.vue";
	import SearchInput from "./SearchInput.vue";
	import MovieTag from "./MovieTag.vue";
	import { EventBus } from "@/EventBus";
	import { Util } from "@/Util";

	const wcc = WClient.getInstance();
	const cch = Cache.getInstance();

	@Component({
		components: { HeadPanel, Auth, SearchInput, MovieTag },
		props: {}
	})
	export default class Head extends Vue {
		value=''
		async updateState() {
			let user = (await wcc.getSelf()).user;
			if (user) cch.user = user;
			else cch.user = { username: null, password: null };
			EventBus.$emit("auth");
		}
		find(value) {
			this.$router.push({
				name: "find",
				params: { field: "name", value: value }
			});
			this.value=''
		}
		async complexUpdate() {
			try {
				while (true) {
					await this.updateState();
					cch.genres = await wcc.fetchGenres();
					cch.countries = await wcc.fetchCountries();
					await Util.sleep(10000);
				}
			} catch (e) {
				console.log(e);
			}
		}
		async mounted() {
			// this.complexUpdate();
		}
	}
</script>

<style lang="stylus" scoped>
    @import './../styles/*'
	header
		margin-top 50px
	.container
		height 400px
		width 100%
		color #fff
		background #fff no-repeat
		background-image url('/assets/head-bg3.jpg')
		position relative
		background-position top center
		background-size cover
		background-attachment fixed
		box-shadow inset 0 -3px 3px 0 rgba(0, 0, 0, 0.15)

	.head-wrapper
		position absolute
		top 50%
		left 50%
		transform translate(-50%,-50%)
		.logo-box
			width 120px
			height 120px
			glass(#fff,0.05)
			border-radius 200px
			background-image url('/assets/min-logo.png')
			background-repeat  no-repeat
			background-position center center
			background-size 40% 40%
			margin auto

	.head-search-container
		glass(#fff,0.7)
		margin-top 50px
		width 400px
		border-radius 4px
		color #aaa
		text-shadow 0 0 1px rgba(#fff,0.3)
		
</style>
