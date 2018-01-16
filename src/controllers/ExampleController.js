import base64 from 'hi-base64'
import crypto from 'crypto'
import Controller from './Controller'

class ExampleController extends Controller {
    static testValidate({ req, res, db }) {
        let input = req.body.input
        this.verifyFields([
            { name: 'input', value: input, conditions: ['required', 'boolean'] }
        ], (status, errors) => {
            if (!status) {
                res.status(400).json(this.response({
                    errors
                }))
            } else {
                res.status(200).json(this.response({
                    status: 'pass',
                    message: 'nice'
                }))
            }
        })
    }

    static testAuth({ req, res, db }) {
        this.authRequired(req, db, (status, response) => {
            if (status) {
                res.status(200).json(this.response({
                    status: 'pass',
                    message: 'nice'
                }))
            } else {
                res.status(401).json(this.response({
                    message: 'authorization failed'
                }))
            }
        })
    }

    static loginUser({ req, res, db }) {
        let email = req.body.email
        let password = req.body.password
        let nextStep = false
        this.verifyFields([
            { name: 'email', value: email, conditions: ['required', 'email'] },
            { name: 'password', value: password, conditions: ['required'] }
        ], (status, errors) => {
            if (!status) {
                res.status(400).json(this.response({
                    errors
                }))
            } else { nextStep = true }
        })
        if (!nextStep) { return }
        try {
            password = base64.decode(password)
        } catch (error) {
            nextStep = false
            res.status(400).json(this.response({
                message: 'malformed password'
            }))
        }
        if (!nextStep) { return }
        db.query(`SELECT id, email, created_at, updated_at FROM users WHERE email = '${email}' AND password = '${password}'`, (err, result, fields) => {
            if (err) {
                res.status(400).json(this.response({
                    message: 'possible malformed password'
                }))
            } else {
                if (result.length > 0) {
                    db.query(`DELETE FROM tokens WHERE userid = '${result[0].id}'`, (err2, result2) => {
                        let token = crypto.randomBytes(20).toString('hex')
                        db.query(`INSERT INTO tokens (userid, token, created_at, updated_at) VALUES ('${result[0].id}', '${token}', 'NOW()', 'NOW()')`, (err3, result3) => {
                            if (err3) {
                                res.status(500).json(this.response({
                                    message: 'There was an issue creating token'
                                }))
                            } else {
                                res.status(200).json(this.response({
                                    status: 'pass',
                                    data: {
                                        ...result[0],
                                        token
                                    }
                                }))
                            }
                        })
                    })
                } else {
                    res.status(401).json(this.response({
                        message: 'email or password was incorrect'
                    }))
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
        ], (status, errors) => {
            if (!status) {
                res.status(400).json(this.response({
                    errors
                }))
            } else { nextStep = true }
        })
        if (nextStep) {
            db.query(`INSERT INTO users (email, password, fullname) VALUES ('${email}', '${password}', '${fullname}')`, (err, result, fields) => {
                if (err) {
                    res.status(500).json(this.response({
                        message: 'Error inserting user into Database'
                    }))
                } else {
                    res.status(201).json(this.response({
                        status: 'pass',
                        message: 'User successfully created'
                    }))
                }
            })
        }
    }
}

export default ExampleController
