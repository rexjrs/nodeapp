import AuthController from './controllers/AuthController'

const routes = ({ app, db }) => {
    app.get('/', (req, res) => AuthController.use({ method: 'test', req, res, db, middleware: ['auth']}))
    // AuthController
    app.post('/createuser', (req, res) => AuthController.createUser({ req, res, db }))
    app.post('/login', (req, res) => AuthController.loginUser({ req, res, db }))
}

export default routes