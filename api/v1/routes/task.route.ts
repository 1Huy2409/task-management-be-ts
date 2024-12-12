import {Router, Request, Response} from "express" //import router tu express => goi den no
import * as controller from "../controller/task.controller"
const router : Router = Router();
router.get("/", controller.index);
router.get("/detail/:id", controller.detail);
router.patch("/change-status/:id", controller.changeStatus);
export const taskRoutes: Router = router;
