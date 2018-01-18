import AuthController from './controllers/AuthController'

const routes = ({ app, db }) => {
    // AuthController
    app.post('/createuser', (req, res) => AuthController.createUser({ req, res, db }))
    app.post('/login', (req, res) => AuthController.loginUser({ req, res, db }))
}

export default routes