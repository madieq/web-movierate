<template lang="pug">
div
    .auth-container(v-show="mode==='authed'?panelShow:true")
        div(v-if="mode==='auth'")
            p.ac Вход
        div(v-if="mode==='register'")
            p.ac Регистрация

        div(v-if="mode==='auth'")
            input(type='text' v-model="user.username" placeholder="имя пользователя" :class="{error:errors.passwordNotEquals}" @input="inputText()" @keyup.enter="authClick()")
            input(type='password' v-model="user.password" placeholder="пароль" :class="{error:errors.passwordNotEquals}" @input="inputText()" @keyup.enter="authClick()")
            input(type="button" value="вход" @click="authClick()" )
            div.switcher
                a.switcher(@click="mode='register'") регистрация
        div(v-else-if="mode==='register'")
            input(type='text' v-model="user.username" placeholder="имя пользователя" :class="{error:errors.passwordNotEquals}" @input="inputText()" @keyup.enter="registerClick()")
            input(type='password' v-model="user.password" placeholder="пароль" :class="{error:errors.passwordNotEquals}" @input="inputText()" @keyup.enter="registerClick()")
            input(type='password' placeholder="повторить пароль" :class="{error:errors.retryPass}" @input="retryPass($event.target.value)" @keyup.enter="registerClick()")
            input(type="button" value="создать" @click="registerClick()" :disabled="errors.retryPass")
            div.switcher
                a.switcher(@click="mode='auth'") авторизация
        div(v-else-if="mode==='authed'")
            p {{user.username}}
            button(style="font-size: 10px" @click="signOutClick()") выход
</template>
<script lang="ts">
	import Vue from "vue";
	import Component from "vue-class-component";
	// import { WSClient } from "@/WSClient.ts";
	import WClient from "@/WebsocketClientConnector";
	import { Cache } from "@/Cache";
	import * as _ from "lodash";
	import { EventBus } from "@/EventBus";
	import * as Cookie from "js-cookie";

	const wsc = WClient.getInstance();
	const cch = Cache.getInstance();

	@Component({ components: {}, props: {} })
	export default class App extends Vue {
		panelShow = true;
		mode = "auth"; //register//authed
		user = {
			username: "",
			password: ""
		};
		errors = {
			passwordNotEquals: false,
			retryPass: false
		};

		inputText(e) {
			if (e) this.retryPass(e.target.value);
			this.errors.passwordNotEquals = false;
		}

		retryPass(retried) {
			if (retried !== this.user.password) this.errors.retryPass = true;
			else this.errors.retryPass = false;
		}
		mounted() {
			window.scrollTo({ top: 0 });
			this.initFields();
			EventBus.$on("trigg-panel", () => {
				if (this.mode === "authed") this.panelShow = !this.panelShow;
			});
			this.cookieAuth();
		}

		initFields() {
			this.mode = cch.user.username ? "authed" : "auth";
			this.user = {
				username: cch.user.username ? cch.user.username : "",
				password: ""
			};
			this.errors = {
				passwordNotEquals: false,
				retryPass: false
			};
		}

		async signOutClick() {
			try {
				await wsc.signOut();
				cch.signOut();
				EventBus.$emit("auth");
				this.initFields();
			} catch (e) {
				this.errors.passwordNotEquals = true;
			}
		}

		createCookieAuth() {
			Cookie.set("username", this.user.username, { expires: 7 });
			Cookie.set("password", this.user.password, { expires: 7 });
		}

		async cookieAuth() {
			try {
				await wsc.authUser(Cookie.get());
				this.user = {
					username: Cookie.get().username,
					password: Cookie.get().password
				};
				cch.user = this.user;
				this.mode = "authed";
				EventBus.$emit("auth");
				this.createCookieAuth();
			} catch (e) {}
		}

		async authClick() {
			try {
				await wsc.authUser(this.user);
				cch.user = this.user;
				this.mode = "authed";
				EventBus.$emit("auth");
				this.createCookieAuth();
			} catch (e) {
				this.errors.passwordNotEquals = true;
			}
		}

		async registerClick() {
			try {
				await wsc.registerUser(this.user);
				cch.user = this.user;
				this.mode = "authed";
				this.createCookieAuth();
			} catch (e) {
				this.errors.passwordNotEquals = true;
			}
		}
	}
</script>

<style lang="stylus" scoped>
    @import './../styles/*'

    p.ac
        font-size 18px
        color #666
        text-shadow 1px 1px 1px #eee

    .auth-container
        glass( #fff,0.4)
        // width $w=300px
        // min-height 150px
        margin 20px
        position absolute
        border-radius 4px
        display flex
        flex-direction column
        align-items center
        box-sizing border-box
        padding 5px 20px 5px 20px
        div
            display flex
            flex-direction column
            align-items center
            box-sizing border-box

        a.switcher
            font-size 10px
            line-height 40px
        div.switcher
            text-align center    
</style>