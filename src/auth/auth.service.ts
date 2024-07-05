import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
    private client: OAuth2Client;

    constructor() {
        this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID as string);
    }

    async validateToken(token: string): Promise<boolean> {
        try {
            const ticket = await this.client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID as string, 
            });
            const payload = ticket.getPayload();
            // Verifique o payload conforme necessário
            return payload ? true : false;
        } catch (error) {
            return false;
        }
    }
}