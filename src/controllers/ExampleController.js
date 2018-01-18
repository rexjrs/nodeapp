import base64 from 'hi-base64'
import crypto from 'crypto'
import Controller from './Controller'

class ExampleController extends Controller {
    static loginUser({ req, res, db }) {
        let email = req.body.email
        let password = req.body.password
        this.verifyFields([
            { name: 'email', value: email, conditions: ['required', 'email'] },
            { name: 'password', value: password, conditions: ['required'] }
        ], res)
        try {
            password = base64.decode(password)
        } catch (error) {
            throw this.response(res, 400, {
                message: 'Malformed password.'
            })
        }
        db.query(`SELECT id, email, created_at, updated_at FROM users WHERE email = '${email}' AND password = '${password}'`, (err, result, fields) => {
            if (err) {
                return this.response(res, 400, {
                    message: 'Possible malformed password.'
                })
            } else {
                if (result.length > 0) {
                    db.query(`DELETE FROM tokens WHERE userid = '${result[0].id}'`, (err2, result2) => {
                        let token = crypto.randomBytes(20).toString('hex')
                        db.query(`INSERT INTO tokens (userid, token, created_at, updated_at) VALUES ('${result[0].id}', '${token}', 'NOW()', 'NOW()')`, (err3, result3) => {
                            if (err3) {
                                return this.response(res, 500, {
                                    message: 'There was an issue creating token.'
                                })
                            } else {
                                return this.response(res, 200, {
                                    status: 'pass',
                                    data: {
                                        ...result[0],
                                        token
                                    }
                                })
                            }
                        })
                    })
                } else {
                    return this.response(res, 401, {
                        message: 'Email or password is incorrect.'
                    })
                }
            }
        })
    }

    static createUser({ req, res, db }) {
        let fullname = req.body.fullname
        let email = req.body.email
        let password = req.body.password
        let nextStep = false
        this.verifyFields([
            { name: 'fullname', value: fullname, conditions: ['required', 'string'] },
            { name: 'email', value: email, conditions: ['required', 'email'] },
            { name: 'password', value: password, conditions: ['required', 'min-6'] }
        ], res)
        db.query(`INSERT INTO users (email, password, fullname) VALUES ('${email}', '${password}', '${fullname}')`, (err, result, fields) => {
            if (err) {
                return this.response(res, 500, {
                    message: 'Error inserting user into Database. Possible duplicate.'
                })
            } else {
                return this.response(res, 201, {
                    status: 'pass',
                    message: 'User successfully created.'
                })
            }
        })
    }
}

export default ExampleController
