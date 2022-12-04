import { Injectable } from '@nestjs/common';
import { UserModel } from 'src/models/user';

@Injectable()
export class AuthService {

    async googleAuthenticate(token: string): Promise<UserModel> {
        const { OAuth2Client } = require('google-auth-library');
        const client = new OAuth2Client(process.env.client_id);
        try {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.client_id, // Specify the client_id of the app that accesses the backend
            });

            const payload = ticket.getPayload();
            if (payload && payload['email_verified']) {
                return {
                            email: payload['email'],
                            fullname: payload['name'],
                            avatar: payload['picture'],
                            isGoogleAuth: true,
                            lastSeen: new Date(),
                            role: 'USER',
                        } as UserModel
            }
        } catch (e) {
            return null;
        }
    }
}
