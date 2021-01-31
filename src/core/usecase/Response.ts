export interface ResponseInterface {
    errors: Record<string, string>
    data: any
    messages: Record<string, string>,
    meta?: Record<string, any>
}

class Response implements ResponseInterface {
    public data: any = null
    public errors: Record<string, string> = {}
    public messages: Record<string, string> = {}
    public meta?: Record<string,any> = {}
}

export default Response