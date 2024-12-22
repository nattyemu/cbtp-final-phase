import { HttpExecption } from "./root.js";
export class BadRequest extends HttpExecption {
    constructor(message, statusCode, errorCode, error) {
        super(message, 403, errorCode, null);
    }
}
