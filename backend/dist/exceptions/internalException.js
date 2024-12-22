import { HttpExecption } from "./root.js";
export class InternalException extends HttpExecption {
    constructor(message, statusCode, errorCode, error) {
        super(message, 500, errorCode, null);
    }
}
