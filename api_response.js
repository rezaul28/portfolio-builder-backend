
module.exports.SUCCESS = (data, msg) => {
    return {
        success: "yes",
        data: data
    }
}


module.exports.FAILURE = (msg, data) => {
    return {
        success: "no",
        msg: msg,
        data: data
    }
}

module.exports.STATUS = {
        OK: 200,
        CREATED: 201,
        NO_CONTENT: 204,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        CONFLICT: 409,
        SERVER_ERROR: 500
}