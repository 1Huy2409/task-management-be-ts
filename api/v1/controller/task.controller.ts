import { Request, Response} from 'express';
import Task from "../models/task.model";
import paginationHelper from '../../helper/pagination';
import searchHelper from '../../helper/search';
export const index = async (req: Request, res: Response) : Promise<void> => {
    interface Find {
        deleted: boolean,
        title?: RegExp, 
        status?: string
    }
    const find : Find = {
        deleted: false,
    }
    if (req.query.status) {
        find.status = req.query.status.toString();
    }
    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey.toString()] = req.query.sortValue;
    }
    let paginationObject = {
        currentPage: 1,
        limitTasks: 2,
    };
    const countTasks = await Task.countDocuments(find);
    paginationObject = paginationHelper(req.query, paginationObject, countTasks);

    //search helper
    let objectSearch = searchHelper(req.query);
    if (objectSearch.regex) {
    find.title = objectSearch.regex;
    }
    const tasks = await Task.find(find).sort(sort).skip(paginationObject["skipTasks"]).limit(paginationObject["limitTasks"]);
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
export const changeStatus = async (req : Request, res : Response) => {
    try {
        const id = req.params.id;
        const newStatus = req.body.status;
        await Task.updateOne(
            {
                _id: id
            },
            {
                status: newStatus
            }
        )
        res.json(
            {
                code: 200, 
                message: "Change status successfully!"
            }
        )
    }
    catch(error) {
        res.json(
            {
                code: 400,
                message: "Change status failed!"
            }
        )
    }
}