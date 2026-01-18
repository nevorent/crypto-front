import { Document } from "./document.model";

export interface MessageResponse {
    id: number;
    sender_id: number;
    receiver_id: number;
    content: string;
    sent_at: Date;
    document: Document;
}
