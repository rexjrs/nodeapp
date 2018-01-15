import Controller from './Controller'

class UserController extends Controller {
    static createUser(req, res, con) {
        // Inputs
        let email = req.body.email
        let password = req.body.password
        // Verify Fields
        if (!this.isRequired([email, password])) {
            res.status(400).json(this.response({
                status: 'fail',
                message: 'Missing email or password'
            }))
            return false
        }
        // Perform Request
        con.query(`INSERT INTO users (email, password) VALUES ('${email}', '${password}')`, (err, result, fields) => {
            if (err) {
                res.status(500).json(err)
            } else {
                res.status(201).json(result)
            }
        })
    }
}

export default UserController
