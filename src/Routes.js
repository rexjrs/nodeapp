import { getUser } from './controllers/UserController';

const routes = (app, con) => {
    app.get('/', (req, res) => getUser(req, res, con))
    // app.get('/', (req, res) => getUser(req, res, con))
}

export default routes