import { HttpExecption } from "./root.js";
export class Unauthorized extends HttpExecption {
    constructor(message, statusCode, errorCode, error) {
        super(message, 401, errorCode, null);
    }
}
