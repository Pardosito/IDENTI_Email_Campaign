import mongoose, { Schema, model } from 'mongoose';
import { IUser, IContact, ITemplate, ICampaign } from './interfaces';

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: {
    type: String,
    enum: ['user', 'designer'],
    default: 'user'
  }
  }
);

export const User = model<IUser>('User', userSchema);

const contactSchema = new Schema<IContact>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }
});

export const Contact = model<IContact>("Contact", contactSchema);

const templateSchema = new Schema<ITemplate>({
  name: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  preview: { type: String, default: "https://t4.ftcdn.net/jpg/06/57/37/01/360_F_657370150_pdNeG5pjI976ZasVbKN9VqH1rfoykdYU.jpg"}
});

export const Template = model<ITemplate>("Template", templateSchema);

const campaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Template' },
  contactList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact'
  }],
  scheduledDate: { type: Date, default: Date.now },
});

export const Campaing = model<ICampaign>("Campaign", campaignSchema);