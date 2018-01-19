import AuthController from './controllers/AuthController'
import { auth } from './middleware/AuthMiddleware'

const routes = ({ app, db }) => {
    app.get('/profile', auth({db}), (req,res) => res.status(200).json({hello: 'hi'}))
    // AuthController
    app.post('/createuser', (req, res) => AuthController.createUser({ req, res, db }))
    app.post('/login', (req, res) => AuthController.loginUser({ req, res, db }))
}

export default routes