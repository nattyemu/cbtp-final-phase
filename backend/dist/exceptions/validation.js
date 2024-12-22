import { HttpExecption } from "./root.js";
export class UnprocessableEntity extends HttpExecption {
    constructor(message, statusCode, errorCode, error) {
        super(message, statusCode, errorCode, error);
    }
}
