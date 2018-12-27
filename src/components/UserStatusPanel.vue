<template lang="pug">
    .user-status-container(@click="buttonClick()")
        .username {{username?username:'Войти'}}
        .icon
</template>

<script lang="ts">
	import Vue from "vue";
	import Component from "vue-class-component";
	import { EventBus } from "@/EventBus.js";
	import { Cache } from "@/Cache";

	const cch = Cache.getInstance();

	@Component({ components: {}, props: {} })
	export default class App extends Vue {
		username = cch.user.username;
		buttonClick() {
            window.scrollTo({ top: 0 });
            EventBus.$emit('trigg-panel')
		}
		mounted() {
			EventBus.$on("auth", () => {
				console.log("catched auth");
				this.username = cch.user.username;
			});
		}
	}
</script>

<style lang="stylus" scoped>
    @import './../styles/*'

    .user-status-container
        display flex
        min-width 200px
        background #dfdfdf
        padding 0 10px
        border 1px solid #ccc
        align-items center
        box-shadow inset 0 1px 0 0 #eee
        &:hover
            cursor pointer
            box-shadow inset 0 1px 0 0 #eee, inset 0 1px 3px 0 rgba(0,0,0,0.15)
        &:active
            background lighten(#dfdfdf,10%)
        .icon
            background url('/assets/icons/users-solid.svg') no-repeat
            width 40px
            height 40px
            background-position center center
            background-size 100% 100%
            flex-grow 0
            margin-left 10px
        .username
            text-align center
            flex-grow 1
            text-transform uppercase
            font-size 16px
            background-color #565656
            color transparent
            text-shadow 0px 2px 3px rgba(255,255,255,0.5)
            -webkit-background-clip text
            -moz-background-clip text
            background-clip text

</style>

