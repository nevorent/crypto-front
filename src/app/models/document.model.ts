export interface Document {
    id: number;
    filename: string;
    status: string;
    createdAt?: Date;
    mimeType?: string;
}
