import { RoleType } from "src/common/role-type";


export const UserDB = 'User';

export class UserModel {
    fullname: string;

    role: RoleType;

    email: string;

    avatar: string;

    isGoogleAuth: boolean;
}