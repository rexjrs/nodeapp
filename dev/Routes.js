import Nodeful, { Auth, TestController } from './src/Index'
console.log(TestController)
const routes = ({ app, db }) => {
    app.get('/profile', Auth.middleware({db}), (req,res) => res.status(200).json({hello: 'hi'}))
    app.get('/eloq', (req, res) => TestController.eloq({req, res, db}))
    // AuthController
    app.post('/createuser', (req, res) => Auth.controller.createUser({ req, res, db }))
    app.post('/login', (req, res) => Auth.controller.loginUser({ req, res, db }))
}

export default routes