import {taskRoutes} from "./task.route"
import {userRoutes} from "./user.route"
import {Express} from "express"
import requestAuth from "../middlewares/auth.middleware"
const mainV1Routes = (app: Express) : void => {
    const version = '/api/v1';
    app.use(version + '/tasks', 
        requestAuth,
        taskRoutes);
    app.use(version + '/users', userRoutes);
}

export default mainV1Routes;