import { User } from '@prisma/client';

export default class UserSessionInfo {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  accessToken?: string;

  public static fromUser(user: User): UserSessionInfo {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
}
