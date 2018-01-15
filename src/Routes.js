import UserController from './controllers/UserController'

const routes = (app, db) => {
    app.get('/', (req, res) => res.status(200).json("Welcome to TCNodeApp"))
    // UserControllers
    app.post('/createuser', (req, res) => UserController.createUser({req, res, db}))
}

export default routes