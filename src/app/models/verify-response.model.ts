import { StatusEnum } from "./status-enum";

export interface VerifyResponse {
    status: StatusEnum,
    reason?: string;
}
