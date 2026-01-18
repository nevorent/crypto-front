import { MessageResponse } from "./message-response.model";

export interface WebsocketResponse {
    type: string;
    message: MessageResponse;
}
