export interface DataContainer {
    [key: string]: any
}

export interface MessageContainer {
    type: string,
    typeName?: DataContainer,
    error?: any,
    [key: string]: any
}

export interface MessageListener{
    type:string,
    callback:(msg)=>any
}