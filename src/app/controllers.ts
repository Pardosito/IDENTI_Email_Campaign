import { Request, Response } from "express";
import { IUser, IContact, ICampaign, ITemplate } from "./interfaces";
import { User, Contact, Campaing, Template } from "./models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mjml2html from "mjml";

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
            password: await bcrypt.hash(userInfo.password, saltRounds),
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

        const match = await bcrypt.compare(password, (foundUser as any).password);
        if (!match) {
            return res.status(401).json({ message: "Incorrect Password" });
        }

        const accessToken = jwt.sign(
            { id: foundUser.id, email: foundUser.email, name: foundUser.name },
            process.env.ACCESS_TOKEN_SECRET as jwt.Secret,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { id: foundUser.id },
            process.env.REFRESH_TOKEN_SECRET as jwt.Secret,
            { expiresIn: '7d' }
        );

        await User.updateOne({ _id: foundUser.id }, { $push: { refresh_tokens: refreshToken } });

        return res.status(200).json({
            message: "Login successful",
            accessToken,
            refreshToken
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

export const getAllContacts = async (req: Request, res: Response) => {
  try {
      const contacts = await Contact.find({});
      return res.status(200).json({ contacts });
  } catch (error) {
      console.error("Fetch error:", error);
      return res.status(500).json({message: "Server error"});
  }
};

export const updateContact = async (req: Request, res: Response) => {
  try {
      const { contactId } = req.params;
      const { contactName, contactEmail } = req.body || {};

      if (!contactId) {
        return res.status(400).json({message: "ID de contacto faltante."});
      }

      const contactToUpdate = await Contact.findById(contactId);

      if (!contactToUpdate) {
        return res.status(404).json({message: "Contacto no encontrado."});
      }

      if (contactEmail && contactEmail !== (contactToUpdate as any).email) {
        const emailExists = await Contact.findOne({ email: contactEmail });
        if (emailExists) {
          return res.status(409).json({message: "El email ya está en uso por otro contacto."});
        }
      }

      const updateData: Partial<IContact> = {};
      if (contactName) updateData.name = contactName;
      if (contactEmail) updateData.email = contactEmail;

      await Contact.updateOne({ _id: contactId }, updateData);

      return res.status(200).json({message: "Contacto actualizado."});
  } catch (error) {
      console.error("Update error:", error);
      return res.status(500).json({message: "Server error"});
  }
};

export const deleteContact = async (req: Request, res: Response) => {
  try {
      const { contactId } = req.params;

      if (!contactId) {
        return res.status(400).json({message: "ID de contacto faltante."});
      }

      const contactToDelete = await Contact.findById(contactId);

      if (!contactToDelete) {
        return res.status(404).json({message: "Contacto no encontrado."});
      }

      await Contact.deleteOne({ _id: contactId });

      return res.status(200).json({message: "Contacto eliminado."});
  } catch (error) {
      console.error("Deletion error:", error);
      return res.status(500).json({message: "Server error"});
  }
};

export const addTemplate = async (req: Request, res: Response) => {

};

export const deleteTemplate = async (req: Request, res: Response) => {

};

export const createCampaign = async (req: Request, res: Response) => {

};

export const renderPreview = async (req: Request, res: Response) => {
    try {
        const { mjml } = req.body;
        // Convert MJML string to HTML
        const { html, errors } = mjml2html(mjml);

        if (errors.length > 0) {
            console.log("MJML Errors:", errors); // Optional logging
        }
        res.send(html); // Send back raw HTML
    } catch (error) {
        res.status(500).send("Error rendering template");
    }
};

// 2. Get Data for Campaign Page
export const getCampaignPage = async (req: Request, res: Response) => {
    try {
        // Fetch all templates and contacts to populate the UI
        const templates = await Template.find().lean();
        const contacts = await Contact.find().lean();

        // Render the view with this data
        res.render("campaigns", {
            layout: "main",
            templates,
            contacts
        });
    } catch (error) {
        res.status(500).send("Error loading campaign page");
    }
};