import { ErrorCode, HttpExecption } from "../exceptions/root.js";
import { InternalException } from "../exceptions/internalException.js";
const errorHandler = (method) => {
  return async (req, res, next) => {
    try {
      await method(req, res, next);
    } catch (error) {
      console.error("Caught error:", error);
      let exception;
      if (error instanceof HttpExecption) {
        exception = error;
      } else {
        exception = new InternalException(
          error.message,
          500,
          ErrorCode.INTERNAL_EXCEPTION,
          null
        );
      }
      // Send JSON response with error details
      const response = {
        message: exception.message || "Something went wrong",
        errorCode: exception.errorCode || ErrorCode.UNKNOWN_ERROR,
      };
      if (exception.details !== undefined) {
        response.details = exception.details;
      }
      // res.status(exception.statusCode || 500).json(response);
    }
  };
};
export default errorHandler;
