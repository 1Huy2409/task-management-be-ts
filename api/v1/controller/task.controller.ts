import { Request, Response} from 'express';
import Task from "../models/task.model"
export const index = async (req: Request, res: Response) : Promise<void> => {
    const find = {
        deleted: false,
    }
    if (req.query.status) {
        find["status"] = req.query.status;
    }
    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey.toString()] = req.query.sortValue;
    }
    const tasks = await Task.find(find).sort(sort);
    res.json(
        {
            code: 200, 
            tasks: tasks
        }
    )
}
export const detail = async (req: Request, res: Response) => {
    const task = await Task.findOne(
        {   _id: req.params.id,
            deleted: false
        }
    )
    res.json(
        {
            code: 200, 
            tasks: task
        }
    )
}