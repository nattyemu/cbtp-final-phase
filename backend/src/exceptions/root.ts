//messages, status, error code, error
export class HttpExecption extends Error {
  [x: string]: any;
  message: string;
  statusCode: number;
  errorCode: ErrorCode;
  error: any;

  constructor(
    message: string,
    statusCode: number,
    errorCode: ErrorCode,
    error: any
  ) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.error = error;
  }
}

export enum ErrorCode {
  USER_NOT_FOUND = 1001,
  USER_ALREADY_EXIST = 1002,
  INCORRECT_PASSWORD = 1003,
  INCORRECT_OTP = 8976,
  EXPIRED_OTP = 109887,

  INTERNAL_EXCEPTION = 1004,
  UNPROCESSABLE = 1005,
  TOKEN_NOT_FOUND = 1006,

  NEWS_NOT_FOUND = 1007,

  VACCINE_ALREADY_EXIST = 1008,
  VACCINE_NOT_FOUND = 1009,

  HS_NOT_FOUND = 1010,
  INCORRECT_OLD_PASSWORD = 1011,
  CHILD_NOT_FOUND = 1012,
  CHILD_VACCINE_NOT_FOUND = 1013,
  CONTENT_AND_ATTACHMENTS_REQUIRED = 1014,
  CHAT_NOT_FOUND = 1015,
  CHILD_HAVE_CERTIFICATE_BEFORE = 1016,
  CERTIFICATE_NOT_FOUND = 1017,
  MOTHER_NOT_FOUND = 1018,
  APPOINTMENT_NOT_FOUND = 1019,
  CHILD_NOT_VACCINE_COMPLETED = 1020,

  // Newly added error codes
  RE_MISSED = 1021,
  ANOTHER_ERROR = 1022,
  YET_ANOTHER_ERROR = 1023,

  GENERATE_CERTIFICATE_ERROR = 9098,
  UNKNOWN_ERROR = 9099,
  USER_PROFILE_NOT_FOUND = 9100,
  VALIDATION_FAILED = 9111,
  USER_HAS_DEBT = 9999,
  INTERNAL_SERVER_ERROR,
}
