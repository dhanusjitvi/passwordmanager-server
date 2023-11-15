import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import {
  create,
  findOne,
  UserFindById as findUserById,
  savePassword,
  findPasswordsByUserId,
  deletePassword
} from "../repositeries/userRepositories/userRespositories";
import { IUser } from "../models/userSchema/userSchema";
import { IPassword } from "../models/passwordSchema/passwordSchema";



export const registerUser = async (req: Request, res: Response) => {
  const { userName, email, password }: IUser = req.body;
  try {
    const existingUser = await findOne(email);
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userData: any = { userName, email, password: hashedPassword };

    const newUser = await create(userData);

    const token = jwt.sign({ userId: newUser._id }, process.env.SECRET_KEY as string, {
      expiresIn: "7d",
    });

    res.status(201).json({ user: newUser.userName, token: `Bearer ${token}` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to register user" });
  }
};


export const userLogin = async (req: Request, res: Response) => {
  console.log("on controller")
  const { email, password }: IUser = req.body;
  try {
    const existingUser = await findOne(email);
    if (!existingUser) {
      return res.status(400).json({ error: "Email does not exist" });
    }
    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.SECRET_KEY as string,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({ user: existingUser.userName, token: `Bearer ${token}` });
  } catch (error) {
    res.status(500).json({ error: "Failed to login User" });
  }
};


export const savedPassword = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;
    const { appName, userName, password } = req.body;

    const user = await findUserById(userId);
    console.log(1)
    if (!user) {
      res.status(400).json({ error: "No User Found" })
    }
    const savedPasswordData: any = {
      appName,
      userName,
      password,
    };

    await savePassword(userId, savedPasswordData);

    res.status(201).json(savedPasswordData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const fetchSavedData = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;

    const savedPasswords = await findPasswordsByUserId(userId);

    const savedPass = savedPasswords ? savedPasswords.savedPassword.map((item: any) => ({
      userName: item.userName,
      appName: item.appName,
      password: item.password,
    })) : [];

    return res.status(200).json(savedPass);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteSavedData = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;
    const passWord: string = req.body.passWord

    const savedPasswords = await findPasswordsByUserId(userId);
    let result = savedPasswords
    if (savedPasswords) {
      result = await deletePassword(savedPasswords, passWord)
    }
    return res.status(200).json(result?.savedPassword);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}