<template lang="pug">
    div
        span.glass(v-for="genre in genres" :key="genre.name")
            | {{genre.name}}
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

	const wcc = WClient.getInstance();
	const cch = Cache.getInstance();

	@Component({ components: {}, props: {} })
	export default class App extends Vue {
        genres=[]
        async mounted(){
            this.genres=(await wcc.fetchGenres()).sort(()=>{return (Math.random()>0.5?1:-1)})
            this.genres=this.genres.slice(0,7)
        }
    }
</script>

<style lang="stylus" scoped>
    @import './../styles/*'
    $bgc=rgb(0, 76, 99)
    span.glass
        background $bgc
        color lighten($bgc,45)
        // text-shadow 0 0px 1px #eee
        font-family fontTitle
        font-size 18px
        margin 0 10px 10px 0
        text-transform uppercase
        position block
        &:hover
            cursor pointer
</style>