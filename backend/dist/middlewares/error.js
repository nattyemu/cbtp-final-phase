export const errorMiddleware = (err, req, res, nex) => {
    console.log("--------------_+_+-------------------------");
    return res.status(err.statusCode).json({
        message: err.message,
        errorCode: err.errorCode,
        errors: err.error
    });
};
