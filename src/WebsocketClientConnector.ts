import 'ws'
import * as Model from './Model'
import Config from './Config'
import { EventBus } from './EventBus'
import { Cache } from './Cache'
import lodash from 'lodash'
import * as rnd from 'randomstring'
import { Util } from './Util';

export default class WebsocketClientConnector {
    private constructor() {
        this.ws = new WebSocket(Config.WS_URL)
        this.ws.onclose = () => {
            console.log('ws onclose')
            this.ws = null
        }

        this.ws.onerror = (e) => {
            console.log('ws onerror ' + e)
            this.ws = null
        }

        this.ws.onopen = () => {
            console.log('ws onopen')
            for (let key in this.onOpenListeners) {
                this.onOpenListeners[key](key)
            }
        }

        this.ws.onmessage = (msg) => {
            console.log('ws onmessage')
            let messageObj = JSON.parse(msg.data)
            for (let key in this.onMessageListeners) {
                if (this.onMessageListeners[key].type === messageObj.type)
                    this.onMessageListeners[key].callback(messageObj)
            }
        }
    }

    static getInstance() {
        if (!this.instance) this.instance = new WebsocketClientConnector()
        return this.instance
    }

    private async send(type: string, data?: Model.DataContainer) {
        let cont = { type: type }
        cont[type] = data
        let str = JSON.stringify(cont)
        // if (this.ws.readyState)
        while (true) {
            if (this.ws.readyState === 1) {
                this.ws.send(str)
                break;
            } else {
                await Util.sleep(50)
            }
        }
    }
    private static instance: WebsocketClientConnector
    private ws: WebSocket = null
    private onMessageListeners: { [key: string]: Model.MessageListener } = {}
    private onOpenListeners = {}

    private promisedRequest(wsMessageContainer: Model.MessageContainer): Promise<any> {
        return new Promise((resolve, reject) => {
            let MESSAGE_CONTAINER = wsMessageContainer
            let TYPE = MESSAGE_CONTAINER.type
            let timer = setTimeout(() => { reject('[mr client]error timeout') }, 2000)
            let result: any
            if (this.ws) {
                this.send(TYPE, MESSAGE_CONTAINER[MESSAGE_CONTAINER.type])
                let key = rnd.generate(32)
                this.onMessageListeners[key] = { type: null, callback: null }
                this.onMessageListeners[key].type = TYPE
                this.onMessageListeners[key].callback = (msg) => {
                    delete this.onMessageListeners[key]
                    clearTimeout(timer)
                    result = msg[TYPE]
                    if (msg.error) {
                        reject(result)
                    }
                    resolve(result)
                }
            } else {
                let key = rnd.generate(32)
                this.onOpenListeners[key] = () => {
                    this.send(TYPE, MESSAGE_CONTAINER[MESSAGE_CONTAINER.type])
                    delete this.onOpenListeners[key]
                    this.onMessageListeners[key] = { type: null, callback: null }
                    this.onMessageListeners[key].type = TYPE
                    this.onMessageListeners[key].callback = (msg) => {
                        delete this.onMessageListeners[key]
                        clearTimeout(timer)
                        result = msg[TYPE]
                        if (msg.error) {
                            reject(result)
                        }
                        resolve(result)
                    }
                }
            }
        })
    }
    // fetch_movie_sv
    // fetch_prot_genre
    // fetch_prot_country

    async getSelf() {
        return (await this.promisedRequest({ type: 'self' }))
    }

    async fetchGenres(): Promise<[]> {
        return (await this.promisedRequest({ type: 'fetch_prot_genre' }))
    }

    async fetchCountries() {
        let r = await this.promisedRequest({ type: 'fetch_prot_country' })
        return r
    }

    async fetchMovies(filter?: {}, offset?: number) {
        try {
            EventBus.$emit('waiting-response')
            let r = await this.promisedRequest({ type: 'fetch_movie_sv', fetch_movie_sv: { filter: filter, offset: offset } })
            EventBus.$emit('waiting-response:ok')
            return r
        } catch (e) {
            EventBus.$emit('waiting-response:ok')
            throw e
        }
    }

    async getMovieById(id: string) {
        EventBus.$emit('waiting-response')
        try {
            let r = await this.promisedRequest({ type: 'fetch_movie_sv', fetch_movie_sv: { filter: { '_id': id }, offset: 0 } })
            EventBus.$emit('waiting-response:ok')
            return r
        } catch (e) {
            EventBus.$emit('waiting-response:ok')
            throw e
        }
    }

    listenChat(cb: (msg) => any) {
        let key = rnd.generate(32)
        this.onMessageListeners[key] = { type: 'send_to_global_chat', callback: cb }
        return key
    }

    removeMessageListener(key: string) {
        if (this.onMessageListeners[key])
            delete this.onMessageListeners[key]
    }

    async sendToChat(messageObject: { message: string }) {
        return (await this.promisedRequest({ type: 'send_to_global_chat', send_to_global_chat: messageObject }))
    }

    async keepAlive() {
        return (await this.promisedRequest({ type: 'ping' }))
    }

    async registerUser(user: {}) {
        try {
            EventBus.$emit('waiting-response')
            let r = await this.promisedRequest({ type: 'new_user', new_user: user })
            EventBus.$emit('waiting-response:ok')
            return r
        } catch (e) {
            EventBus.$emit('waiting-response:ok')
            throw 'error ' + e
        }
    }

    async authUser(user: {}) {
        try {
            EventBus.$emit('waiting-response')
            let r = await this.promisedRequest({ type: 'auth', auth: user })
            EventBus.$emit('waiting-response:ok')
            return r
        } catch (e) {
            EventBus.$emit('waiting-response:ok')
            throw 'error ' + e
        }
    }

    async signOut() {
        return (await this.promisedRequest({ type: 'sign_out' }))
    }
}