import { Document } from "./document.model";

export interface Message {
    id: number;
    senderId: number;
    receiverId: number;
    content: string;
    sentAt: Date;
    document: Document;
}
