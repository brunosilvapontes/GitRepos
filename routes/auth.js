// Only allow requests with 'application/json' accept header
exports.checkAcceptHeader = (req, res, next) => {
    let acceptHeader = null
    if (req && req.headers && req.headers.accept) {
        acceptHeader = req.headers.accept.toLowerCase().trim()
    }

    if (acceptHeader && acceptHeader === 'application/json') {
        return next()
    }

    const notAcceptableMsg = {
        status: 406,
        Message: 'The response type you are requesting is not acceptable. Please use "Accept: application/json" on your request header.'
    }
    return res.status(406).json(notAcceptableMsg).end()
}