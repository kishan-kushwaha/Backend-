class ApiResponse{
    constructor(statusCode, data, message = "Success", errors = []){
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.errors = errors;
        this.success = statusCode < 400;

    }
}
export {ApiResponse}