export interface RegisterResponse {
    id: number;
    email: string;
    username: string;
    created_at: Date;
    is_active: boolean;
    pki_identity?: {
        private_key: string;
        certificate: string;
    };
}
