import { HttpExecption } from "./root.js";
export class NotFound extends HttpExecption {
    constructor(message, statusCode, errorCode, error) {
        super(message, 404, errorCode, null);
    }
}
