import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AuthService {
    private targetAudience: string = process.env.GOOGLE_CLIENT_ID as string;

    async validateToken(token: string): Promise<boolean> {
        if (!token) {
            console.log('Token is undefined or empty');
            return false;
        }

        try {
            const response = await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`);
            const data = response.data;


            return data.aud === this.targetAudience;

        } catch (error) {
            console.error('Error verifying token:', error.response ? error.response.data : error.message);
            return false;
        }
    }
}