import ExampleController from './controllers/ExampleController'

const routes = ({ app, db }) => {
    app.get('/', (req, res) => res.status(200).json("Welcome to TCNodeApp"))
    // ExampleController
    app.post('/createuser', (req, res) => ExampleController.createUser({ req, res, db }))
    app.post('/login', (req, res) => ExampleController.loginUser({ req, res, db }))
}

export default routes