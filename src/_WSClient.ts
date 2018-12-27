import 'ws'
import * as Model from './Model'
import Config from './Config'
import { EventBus } from './EventBus'
import { Cache } from './Cache'
import lodash from 'lodash'

export class WSClient {
    private ws: WebSocket = null
    private messageListeners: { [key: string]: { callback: (msg: Model.MessageContainer) => void } } = {}
    private onceListeners: { [key: string]: { callback: (msg: Model.MessageContainer) => void, type: string } } = {}
    onopen: () => void = () => { }
    onerror: (e: any) => void = (e) => { console.log(e) }
    onclose: () => void = () => { }
    private constructor() {
        this.setIdle()
        this.ws = new WebSocket(Config.WS_URL)
        this.ws.onclose = () => {
            console.log('closed connection')
            this.setIdle()
            this.onclose()
        }
        this.ws.onerror = (e) => { this.onerror(e) }
        this.ws.onopen = () => {
            console.log('opened connection')
            this.isOpen = true
            this.onopen()
        }
        this.ws.onmessage = (message) => {
            let msg = JSON.parse(message.data)

            for (let key in this.messageListeners) {
                if (msg.type === key) {
                    this.messageListeners[key].callback(msg)
                }
            }
            for (let key in this.onceListeners) {
                if (msg.type === this.onceListeners[key].type) {
                    this.onceListeners[key].callback(msg)
                    delete this.onceListeners[key]
                }
            }
        }
    }
    private static instance: WSClient
    isOpen = false;
    private isOpening = false;
    static getInstance() {
        if (!this.instance) this.instance = new WSClient()
        return this.instance
    }

    private setIdle() {
        this.onopen = () => { }
        this.onerror = (e) => { }
        this.onclose = () => { }
        this.isOpen = false
        this.messageListeners = {}
        this.ws = null
    }


    promisedRequest(sendedMessage: Model.MessageContainer, loaderOff?: boolean): Promise<Model.MessageContainer> {
        this.send(sendedMessage)

        return new Promise((resolve, reject) => {
            let timer = setTimeout(() => {
                console.log('Error in promised request TIMEOUT', sendedMessage);
                reject('error timeout ' + sendedMessage)
            }, 7500)
            if (!loaderOff)
                EventBus.$emit('waiting-response', sendedMessage)
            let keyName = Math.floor(Math.random() * 10e8) + '_' + Date.now()
            this.onceListeners[keyName] = { callback: () => { }, type: sendedMessage.type }
            this.onceListeners[keyName].callback = (msg) => {
                delete this.onceListeners[keyName]
                if (!msg.error) {
                    if (!loaderOff)
                        EventBus.$emit('waiting-response:ok', msg)
                    clearTimeout(timer)
                    resolve(msg)
                } else {
                    if (!loaderOff)
                        EventBus.$emit('waiting-response:err', msg)
                    clearTimeout(timer)
                    reject(msg.error)
                }
            }
        })
    }

    send(container: Model.MessageContainer) {
        if (this.isOpen)
            this.ws.send(JSON.stringify(container))
    }

    on(type: string, cb: (msg: Model.MessageContainer) => void) {
        this.messageListeners[type] = { callback: null }
        this.messageListeners[type]['callback'] = cb
    }

    off(type: string) {
        if (this.messageListeners[type])
            delete this.messageListeners[type]
    }

    toMessageContainer(type: string, data?: any): Model.MessageContainer {
        let res = {
            type: type
        }
        res[res.type] = data
        return res
    }

    async fetchSetup() {
        if (!this.isOpen)
            await this.connect();

        let genres = (await this.promisedRequest({
            type: "fetch_prot_genre",
            fetch_prot_genre: {}
        }))["fetch_prot_genre"];

        let countries = (await this.promisedRequest({
            type: "fetch_prot_country",
            fetch_prot_country: {}
        }))["fetch_prot_country"];

        let user = (await this.promisedRequest({
            type: "self",
            self: {}
        }))["self"];

        Cache.getInstance().genres = lodash.cloneDeep(genres);
        Cache.getInstance().countries = lodash.cloneDeep(countries);
        Cache.getInstance().user =
            lodash.cloneDeep(Object.keys(user).length > 0 ? user : Cache.getInstance().user);
    }

    async connect(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!this.isOpen || !this.isOpening) {
                this.isOpening = true
                this.onopen = () => {
                    this.isOpening = false
                    resolve()
                }
                this.onerror = (e) => {
                    this.isOpening = false
                    reject(e)
                }
                this.onclose = () => {
                    this.isOpening = false
                    reject()
                }
            }
        })
    }
}