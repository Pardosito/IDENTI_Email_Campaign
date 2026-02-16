import { Types } from "mongoose";

export interface IUser {
    name: string;
    email: string;
    password: string;
    role: string;
    refresh_tokens?: string[];
}

export interface IContact {
    name: string;
    email: string;
}

export interface ITemplate {
    name: string;
    content: string;
    preview: string;
}

export interface ICampaign {
    name: string;
    templateName: string;
    contactList: Array<string>;
    scheduledDate: Date;
    dateSent: Date;
    stats: {
        totalSent: number;
        opens: number;
        clicks: number;
        bounces: number;
    };
}