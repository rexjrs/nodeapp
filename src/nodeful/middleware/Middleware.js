export const authMiddleware = ({ db }) => {
    return (req, res, next) => {
        const failedRequest = (code, message) => {
            return res.status(code).json({
                status: 'fail',
                message: '',
                ...message
            })
        }
        if (!req.headers.authorization) {
            return failedRequest(400, {
                message: 'Missing token.'
            })
        }
        if (!req.headers.uid) {
            return failedRequest(400, {
                message: 'Missing uid.'
            })
        }
        let authBearer = req.headers.authorization.replace('Bearer ', '')
        let uid = req.headers.uid
        if (authBearer) {
            db.query(`SELECT * FROM tokens WHERE token = '${authBearer}' AND userid = '${uid}'`, (err, result) => {
                if (err) {
                    return failedRequest(500, {
                        message: 'Internal server error.'
                    })
                } else {
                    if (result.length > 0) {
                        next()
                    } else {
                        return failedRequest(404, {
                            message: 'Token or uid not found.'
                        })
                    }
                }
            })
        } else {
            return failedRequest(400,{
                message: 'Missing or broken token.'
            })
        }
    }
}