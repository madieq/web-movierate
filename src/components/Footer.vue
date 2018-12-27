<template lang="pug">
	div
		//- input.logger(type='button' value='log' @click='log()')
		Chat
		.panel(v-show="showMain")
			.icon-bg-image-chat.icon-button(@click="chatBtnClick()")
		.container
			p.coop by MaDiEQ
</template>

<script lang="ts">
	import Vue from "vue";
	import Component from "vue-class-component";
	import { Cache } from "@/Cache";
	import { EventBus } from "@/EventBus";

	import Chat from "./Chat.vue";

	@Component({ components: { Chat }, props: {} })
	export default class Foot extends Vue {
		showMain = true;
		chatBtnClick() {
			EventBus.$emit("chat-switch");
		}
		log() {
			console.log("cache = ", Cache.getInstance());
		}
		scrolled() {}
		mounted() {}
		destroed() {}
	}
</script>

<style lang="stylus" scoped>
	@import './../styles/*'
	@import url('https://fonts.googleapis.com/css?family=Great+Vibes');

	$panelHeight=50px
	.container 
		rowFlexContainer()
		background #d0d0d0
		width 100%
		height 100px
		margin-bottom $panelHeight
		padding 10px 50px 50px 50px
		box-shadow inset 0 3px 3px 0 rgba(0, 0, 0, 0.15)
		position relative
		box-sizing border-box
		.coop
			color transparent
			background-color #565656
			text-shadow 0px 2px 3px rgba(255,255,255,0.5)
			background-clip text
			-webkit-background-clip text
			-moz-background-clip text
			position absolute
			bottom 10px
			// transform translate(0 700%)
			right 10px
			font-family: 'Great Vibes', cursive;
			font-size 16px

	.panel 
		width 100%
		height $panelHeight
		position fixed
		bottom 0px
		left 0px
		background #eee
		z-index 100
		box-shadow 0 -1px 1px 0 rgba(0, 0, 0, 0.15)
		display flex
		justify-content flex-start
		align-items center
		box-sizing border-box
	.logger
		position fixed
		bottom 10px
		right 10px
		z-index 101
	.icon-bg-image-chat
		margin 0 5px
</style>
