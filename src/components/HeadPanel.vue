<template lang="pug">
div
	.loading-bar(v-show="isLoading")
	.container(v-show="showMain")
		.wrapper
			.logo
			Search-Input(searchBy="name")
		User-Status-Panel
</template>

<script lang="ts">
	import Vue from "vue";
	import Component from "vue-class-component";
	import { EventBus } from "@/EventBus.js";

	import SearchInput from "./SearchInput.vue";
	import UserStatusPanel from "./UserStatusPanel.vue";

	@Component({ components: { SearchInput, UserStatusPanel }, props: {} })
	export default class HeadPanel extends Vue {
		showMain = true;
		isLoading = false;

		scrolled() {
			// if (window.pageYOffset >= 350) {
			// 	this.showMain = true;
			// } else {
			// 	this.showMain = false;
			// }
		}
		mounted() {
			window.addEventListener("scroll", this.scrolled);
			EventBus.$on("waiting-response", e => {
				this.isLoading = true;
			});
			EventBus.$on("waiting-response:ok", e => {
				this.isLoading = false;
			});
			EventBus.$on("waiting-response:err", e => {
				this.isLoading = false;
				console.log(e);
			});
		}
		destroed() {
			window.removeEventListener("scroll", this.scrolled);
		}
	}
</script>

<style lang="stylus" scoped>
    @import './../styles/*'

	.container 
		rowFlexContainer()
		flex-wrap nowrap
		justify-content space-between
		align-items center
		align-content center
		position fixed
		top 0
		left 0
		height 50px
		width 100%
		box-shadow 0 1px 1px 0 rgba(0, 0, 0, 0.3)
		background-color rgba(230, 230, 230, 1)
		z-index 100
		padding 0 10px
		box-size border-box
	.wrapper
		display flex
		align-items center
	.loading-bar
		position: fixed;
		top 0
		left 0
		width 100%
		height 3px
		background rgb(0, 102, 255)
		z-index 1000
	.logo 
		background url('/assets/min-logo.png') no-repeat
		width 40px
		height 40px
		background-positio center center
		background-size 100% 100%
		margin-right 20px
</style>

