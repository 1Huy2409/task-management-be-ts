import User from "../models/user.model"
import { NextFunction, Request, Response } from "express";
const requestAuth = async (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        const user = await User.findOne(
            {
                token: token,
                deleted: false
            }
        ).select("-password")
        if (!user) {
            res.json(
                {
                    code: 400,
                    message: "Invalid account!"
                }
            )
            return;
        }
        req["user"] = user;
        next();
    }
    else {
        res.json(
            {
                code: 400,
                message: "Please send request attach token"
            }
        )
    }
}
export default requestAuth