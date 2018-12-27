<template lang="pug">
    .chat-container(v-show="show")
        .message-container(ref='chatcontainer')
            div
                p(v-if="messages.length===0") Чат еще пуст, напишите сюда что-нибудь =)
            .message(v-for="msg,i in messages" :key="i")
                span.name {{msg.user}}:
                | {{msg.message}}
        .input-wrapper
            input(type="text" @keyup.enter="sendMessage(chatInput)" v-model="chatInput" placeholder='type message')

</template>
<script lang="ts">
	import Vue from "vue";
	import Component from "vue-class-component";
	import { Cache } from "@/Cache";
	import WebsocketClientConnector from "@/WebsocketClientConnector";
	import { EventBus } from "@/EventBus";

	const wsc = WebsocketClientConnector.getInstance();
	const cch = Cache.getInstance();

	@Component({ components: {}, props: {} })
	export default class Chat extends Vue {
		private LIMIT_MESSAGES = 200;
		onlineCount = 10;
		show = true;
		messages = [];
		chatInput = "";
		async sendMessage(msg) {
			// console.log('send msg '+msg)
			msg = msg.trim();
			if (msg.match(/^.{1,200}$/)) {
				await wsc.sendToChat({ message: msg.trim() });
				this.chatInput = "";
			}
		}
		listenerChatKey = "";
		mounted() {
			console.log("mounted");
			if (cch.messages.length > 0 && this.messages.length === 0) {
				this.messages = cch.messages;
			}
			EventBus.$on("chat-switch", () => {
				this.show = !this.show;
			});
			this.listenerChatKey = wsc.listenChat(msg => {
				cch.messages.push(msg);
				this.messages = cch.messages;
				if (cch.messages.length > this.LIMIT_MESSAGES)
					cch.messages.splice(
						0,
						cch.messages.length - this.LIMIT_MESSAGES
					);
			});
		}

		updated() {
			let scrollTo = (this.$refs["chatcontainer"] as Element).scrollHeight;
			(this.$refs["chatcontainer"] as Element).scrollTo({
				top: scrollTo
			});
		}

		destroyed() {
			wsc.removeMessageListener(this.listenerChatKey);
		}
	}
</script>

<style lang="stylus" scoped>
    @import './../styles/*'
    .chat-container
        position fixed
        // border 1px solid #f00
        bottom 55px
        left 0
        // transform translate(-400px 0)
        width 60%
        min-width 400px
        glass(#fff,0.6)
        padding 5px
        border-radius 4px
        z-index 100
        box-sixing border-box
    .message-container
        height 200px
        background-color rgba(#000,0.8)
        overflow-x auto
        owerflow-y scroll
        border-radius 4px 4px 0 0
        padding 2px 10px
        font-size 14px
        color #fff
        p
            color #ccc
    span.name
        font-weight bold
        color #aaa
        padding 0
        margin 0
        margin-right 10px
        line-height 1em
    .message
        color #fff
        // border 1px solid #f00
        margin-bottom 2px
        word-wrap break-word
    .input-wrapper
        width 100%
        height 30px
        box-sizing border-box
        input
            box-sizing border-box
            width 100%
            height 100%
            border 0

</style>