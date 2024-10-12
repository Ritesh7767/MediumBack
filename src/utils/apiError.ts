interface apiErrorInterface {
    status: number,
    message: string,
    data?: object,
    stack?: string
}

class ApiError extends Error implements apiErrorInterface {

    status: number;
    message: string;
    data?: object | undefined;
    stack?: string | undefined;

    constructor(status: number, message: string, data: object = {}, stack: string = "" ){
        super(message)
        this.status = status
        this.message = message
        this.data = data

        if (stack) this.stack = stack
        else Error.captureStackTrace(this, this.constructor)
    }
}

export default ApiError