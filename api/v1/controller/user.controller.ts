import { Request, Response } from "express";
import md5 from "md5"
import User from "../models/user.model"
import * as generateHelper from "../../helper/generate"
export const register = async (req: Request, res: Response) => {
    req.body.password = md5(req.body.password);
  //kiem tra email da ton tai chua
  const existEmail = await User.findOne({
    email: req.body.email,
    deleted: false,
  });
  if (existEmail) {
    res.json({
      code: 400,
      message: "Email already exists",
    });
  } else {
    const user = new User(
      {
        fullName: req.body.fullName,
        email: req.body.email,
        password: req.body.password,
        token: generateHelper.generateRandomString(20)
      }
    );
    await user.save();
    const token = user.token;
    res.cookie("token", token);
    res.json({
      code: 200,
      message: "Account registration successful",
      tokenUser: token,
    });
  }
}
export const login = async (req: Request, res: Response) => {
    console.log("ok");
}