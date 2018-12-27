<template lang="pug">
	.search-input-container
		input.search-input-field(type="text" placeholder="поиск" @keyup.enter="find($event.target.value)" v-model="value")
		//- .search-input-button
</template>

<script lang="ts">
	import Vue from "vue";
	import Component from "vue-class-component";
	import WebsocketClientConnector from "@/WebsocketClientConnector";

	const wcc = WebsocketClientConnector.getInstance();

	@Component({ components: {}, props: { searchBy: String } })
	export default class HeadPanel extends Vue {
		value=''
		find(value) {
			this.$router.push({
				name: "find",
				params: { field: "name", value: value }
			});
			this.value=''
			// console.log("name", value);
		}
	}
</script>

<style lang="stylus" scoped>
	@import './../styles/*'

	.search-input-container
		display flex
		flex-direction row
		justify-content flex-start
		align-items center

	input.search-input-field
		margin 0
		height 42px
		width 300px
		border 1px solid #ccc
		border-radius 4px
		color #aaa
		flex-shrink 0
		box-sizing border-box
		margin-left 0px
		border-radius 2px
		box-shadow none
		background-image url('/assets/icons/search-solid.svg')
		background-repeat no-repeat
		background-position-x  190%
		background-position-y  50%
		background-size 70% 70%
		&:focus
			background-color #eee

	.search-input-button
		box-sizing border-box
		$w=45px
		$h=30px
		$scaleW=75%
		background-image url('/assets/icons/search-solid.svg')
		background-repeat no-repeat
		background-position 50% 50%
		background-size $scaleW $scaleW
		border 1px solid #ccc
		border-left none
		width $w
		height $h
		flex-shrink 0
		background-color #d0d0d0
		border-radius 0 4px 4px 0
		box-shadow 0 1px 3px 0 rgba(#000,0.15),inset 0 1px 0 0 #e0e0e0
		&:hover
			cursor pointer
			background-color #ddd
		&:active
			box-shadow 1px 1px 2px 0 rgba(#000,0.15),inset 0 1px 1px 0 rgba(#000,0.1)
</style>

