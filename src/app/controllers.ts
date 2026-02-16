import { Request, Response } from "express";
import { IUser, IContact, ICampaign, ITemplate } from "./interfaces";
import { User, Contact, Campaing, Template } from "./models";
import bcrypt from "bcrypt";

export const signup = async (req: Request, res: Response) => {
    try {
        const userInfo = req.body;
        const saltRounds = 8;
        let role = "user";

        if (!userInfo?.email || !userInfo?.password) {
            return res.status(400).json({ message: "Credenciales de acceso faltantes" });
        }

        const existingUser = await User.findOne({ email: userInfo.email });
        if (existingUser) {
            return res.status(409).json({ message: "Usuario ya registrado" });
        }

        if (userInfo.email == "diseno@identisoluciones.com") {
          role = "designer"
        }

        const newUser: IUser = {
            name: userInfo.name,
            email: userInfo.email,
            password: await bcrypt.hash(userInfo.password_hash, saltRounds),
            role: role
        };

        await User.create(newUser);

        return res.status(201).json({ message: "Usuario registrado" });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body || {};
        if (!email || !password) {
            return res.status(400).json({ message: "Missing credentials" });
        }

        const foundUser = await User.findOne({ email });

        if (!foundUser) {
            return res.status(404).json({ message: "User Not Found" });
        }

        const match = await bcrypt.compare(password, (foundUser as any).password_hash);
        if (!match) {
            return res.status(401).json({ message: "Incorrect Password" });
        }

        // const accessToken = jwt.sign(
        //     { id: foundUser.id, email: foundUser.email, name: foundUser.name },
        //     process.env.ACCESS_TOKEN_SECRET as jwt.Secret,
        //     { expiresIn: '15m' }
        // );

        // const refreshToken = jwt.sign(
        //     { id: foundUser.id },
        //     process.env.REFRESH_TOKEN_SECRET as jwt.Secret,
        //     { expiresIn: '7d' }
        // );

        // await User.updateOne({ _id: foundUser.id }, { $push: { refresh_tokens: refreshToken } });

        // res.cookie('refresh', refreshToken, {
        //     httpOnly: true,
        //     signed: true,
        //     maxAge: 7 * 24 * 60 * 60 * 1000
        // });
        // res.cookie('accessToken', accessToken, {
        //     httpOnly: true,
        //     maxAge: 15 * 60 * 1000 // 15 minutos
        // });

        return res.status(200).json({
            message: "Login successful",
            // accessToken
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const createContact = async (req: Request, res: Response) => {
  try {
      const {contactName, contactEmail } = req.body || {};

      if (!contactName || !contactEmail) {
        return res.status(400).json({message: "Información de contacto faltante."});
      }

      let doesContactExist = await Contact.findOne({ contactEmail });

      if (doesContactExist) {
        return res.status(409).json({message: "Contacto ya existente."});
      }

      const newContact: IContact = {
            name: contactName,
            email: contactEmail,
        };

      await Contact.create(newContact);

      return res.status(201).json({message: "Nuevo contacto registrado."});
  } catch (error) {
      console.error("Creation error:", error);
      return res.status(500).json({message: "Server error"});
  }
};

export const updateContact = async (req: Request, res: Response) => {

};

export const deleteContact = async (req: Request, res: Response) => {

};

export const addTemplate = async (req: Request, res: Response) => {

};

export const deleteTemplate = async (req: Request, res: Response) => {

};

export const createCampaign = async (req: Request, res: Response) => {

};