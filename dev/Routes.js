import Nodeful, { Auth } from '../src/Index'

const routes = ({ app, db }) => {
    app.get('/profile', Auth.middleware({db}), (req,res) => res.status(200).json({hello: 'hi'}))
    // AuthController
    app.post('/createuser', (req, res) => Auth.controller.createUser({ req, res, db }))
    app.post('/login', (req, res) => Auth.controller.loginUser({ req, res, db }))
}

export default routes