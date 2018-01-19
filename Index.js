require('babel-register')({
	presets: ['es2015']
});

import DefaultController from './controllers/Controller'
import AuthController from './controllers/AuthController'
import { authMiddleware } from './middleware/Middleware'

const Nodeful = {
    Controller: Controller,
    Auth: {
        controller: AuthController,
        middleware: authMiddleware
    }
}

export const Auth = {
    controller: AuthController,
    middleware: authMiddleware
}
export const Controller = DefaultController

export default Nodeful