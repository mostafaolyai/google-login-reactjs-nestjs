import { UserModel } from "src/models/user";

/**
 * It is extract from database using Payload of JWT
 */
export class Identity {
    user: UserModel;
    webhookAccess: boolean = false;
    public get isAuthenticated(): boolean {
        return this.user ? true : false;
    }
}
