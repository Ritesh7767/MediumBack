interface apiResponseInterface {

    status: number,
    data: object,
    message?: string,
    success: boolean
}

class ApiResponse implements apiResponseInterface {
    status: number;
    data: object;
    message?: string | undefined;
    success: boolean;

    constructor(status: number, data: object, message: string = "Task completed successfully"){
        this.status = status
        this.data = data
        this.message = message
        this.success = status < 400
    }
}

export default ApiResponse