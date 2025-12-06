export enum Role {
  ADMIN = 1,
  MODERATOR = 2,
  USER = 3,
}
export interface ISignup {
  id?: number;
  name: string;
  email: string;
  password: string;
  role_id: number;
  profile?: Partial<{
    bio: string;
    avatar: string;
    // add other profile fields here if you want
  }>;
}


export interface ILogin {
    email: string;
    password: string;
}
