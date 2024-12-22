//messages, status, error code, error
export class HttpExecption extends Error {
    constructor(message, statusCode, errorCode, error) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.error = error;
    }
}
export var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["USER_NOT_FOUND"] = 1001] = "USER_NOT_FOUND";
    ErrorCode[ErrorCode["USER_ALREADY_EXIST"] = 1002] = "USER_ALREADY_EXIST";
    ErrorCode[ErrorCode["INCORRECT_PASSWORD"] = 1003] = "INCORRECT_PASSWORD";
    ErrorCode[ErrorCode["INCORRECT_OTP"] = 8976] = "INCORRECT_OTP";
    ErrorCode[ErrorCode["EXPIRED_OTP"] = 109887] = "EXPIRED_OTP";
    ErrorCode[ErrorCode["INTERNAL_EXCEPTION"] = 1004] = "INTERNAL_EXCEPTION";
    ErrorCode[ErrorCode["UNPROCESSABLE"] = 1005] = "UNPROCESSABLE";
    ErrorCode[ErrorCode["TOKEN_NOT_FOUND"] = 1006] = "TOKEN_NOT_FOUND";
    ErrorCode[ErrorCode["NEWS_NOT_FOUND"] = 1007] = "NEWS_NOT_FOUND";
    ErrorCode[ErrorCode["VACCINE_ALREADY_EXIST"] = 1008] = "VACCINE_ALREADY_EXIST";
    ErrorCode[ErrorCode["VACCINE_NOT_FOUND"] = 1009] = "VACCINE_NOT_FOUND";
    ErrorCode[ErrorCode["HS_NOT_FOUND"] = 1010] = "HS_NOT_FOUND";
    ErrorCode[ErrorCode["INCORRECT_OLD_PASSWORD"] = 1011] = "INCORRECT_OLD_PASSWORD";
    ErrorCode[ErrorCode["CHILD_NOT_FOUND"] = 1012] = "CHILD_NOT_FOUND";
    ErrorCode[ErrorCode["CHILD_VACCINE_NOT_FOUND"] = 1013] = "CHILD_VACCINE_NOT_FOUND";
    ErrorCode[ErrorCode["CONTENT_AND_ATTACHMENTS_REQUIRED"] = 1014] = "CONTENT_AND_ATTACHMENTS_REQUIRED";
    ErrorCode[ErrorCode["CHAT_NOT_FOUND"] = 1015] = "CHAT_NOT_FOUND";
    ErrorCode[ErrorCode["CHILD_HAVE_CERTIFICATE_BEFORE"] = 1016] = "CHILD_HAVE_CERTIFICATE_BEFORE";
    ErrorCode[ErrorCode["CERTIFICATE_NOT_FOUND"] = 1017] = "CERTIFICATE_NOT_FOUND";
    ErrorCode[ErrorCode["MOTHER_NOT_FOUND"] = 1018] = "MOTHER_NOT_FOUND";
    ErrorCode[ErrorCode["APPOINTMENT_NOT_FOUND"] = 1019] = "APPOINTMENT_NOT_FOUND";
    ErrorCode[ErrorCode["CHILD_NOT_VACCINE_COMPLETED"] = 1020] = "CHILD_NOT_VACCINE_COMPLETED";
    // Newly added error codes
    ErrorCode[ErrorCode["RE_MISSED"] = 1021] = "RE_MISSED";
    ErrorCode[ErrorCode["ANOTHER_ERROR"] = 1022] = "ANOTHER_ERROR";
    ErrorCode[ErrorCode["YET_ANOTHER_ERROR"] = 1023] = "YET_ANOTHER_ERROR";
    ErrorCode[ErrorCode["GENERATE_CERTIFICATE_ERROR"] = 9098] = "GENERATE_CERTIFICATE_ERROR";
    ErrorCode[ErrorCode["UNKNOWN_ERROR"] = 9099] = "UNKNOWN_ERROR";
    ErrorCode[ErrorCode["USER_PROFILE_NOT_FOUND"] = 9100] = "USER_PROFILE_NOT_FOUND";
    ErrorCode[ErrorCode["VALIDATION_FAILED"] = 9111] = "VALIDATION_FAILED";
    ErrorCode[ErrorCode["USER_HAS_DEBT"] = 9999] = "USER_HAS_DEBT";
    ErrorCode[ErrorCode["INTERNAL_SERVER_ERROR"] = 10000] = "INTERNAL_SERVER_ERROR";
})(ErrorCode || (ErrorCode = {}));
