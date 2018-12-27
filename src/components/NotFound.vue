<template lang="pug">
	.container
		h1 bad link error not found
</template>

<script lang='ts'>
	import Vue from "vue";
	import Component from "vue-class-component";

	@Component({ components: {}, props: {} })
	export default class NotFound extends Vue {}
</script>

<style lang="stylus" scoped>
    @import './../styles/*'

	.container {
		min-height: 100vh;
	}

	h1 {
		color: rgb(56, 56, 56);
		margin-left: 10px;
	}
</style>