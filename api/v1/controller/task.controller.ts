import { Request, Response} from 'express';
import Task from "../models/task.model";
import paginationHelper from '../../helper/pagination';
import searchHelper from '../../helper/search';
import { rmSync } from 'fs';
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
export const changeMulti = async (req : Request, res: Response) => {
    try {
        enum Key {
            STATUS = "status", 
            DELETE = "delete"
        }
        const ids : string[] = req.body.ids;
        const key : string = req.body.key;
        const value: string = req.body.value
        switch (key) {
            case Key.STATUS:
            await Task.updateMany(
                {
                _id: { $in: ids },
                },
                {
                status: value,
                }
            );
            res.json({
                code: 200,
                message: "Change multi status successfully!",
            });
            break;
            case Key.DELETE:
            await Task.updateMany(
                {
                _id: { $in: ids },
                },
                {
                deleted: true,
                deletedAt: new Date(),
                }
            );
            res.json({
                code: 200,
                message: "Delete multi task successfully!",
            });
            break;
            default:
            res.json("Not found");
        }
        } catch (error) {
        res.json({
            code: 400,
            message: "Change multi failed!",
        });
    }
}
export const create = async (req: Request, res: Response) => {
    try {
        const newTask = new Task(req.body);
        await newTask.save();
        res.json(
            {
                code: 200, 
                message: "Create new tasks successfully!",
                task: newTask
            }
        )
    }
    catch(error)
    {
        res.json(
            {
                code: 400, 
                message: "Create new task failed!"
            }
        )
    }
}
export const edit = async (req, res) => {
    try {
        const id = req.params.id; 
        await Task.updateOne(
            {_id: id},
            req.body
        )
        res.json(
            {
                code: 200, 
                message: "Edit task successfully!"
            }
        )
    }
    catch(error) {
        res.json(
            {
                code: 400,
                message: "Edit task failed!"
            }
        )
    }
}
export const deleteTask = async (req : Request, res : Response) => {
    try {
        const id = req.params.id;
        await Task.updateOne(
            {
                _id: id
            }, 
            {
                deleted: true,
                deletedAt: new Date()
            }
        )
        res.json(
            {
                code: 200,
                message: "Delete task successfully!"
            }
        )
    }
    catch(error) {
        res.json(
            {
                code: 400,
                message: "Delete task failed!"
            }
        )
    }
}