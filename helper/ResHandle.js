module.exports = function (res, success, data, statusCode = 200) {
    if (success) {
        res.status(statusCode).send({
            success: true,
            data: data
        });
    } else {
        res.status(statusCode || 400).send({
            success: false,
            data: data
        });
    }
}