export enum UserRole {
  ADMIN = 'admin',
  ANONYMOUS = 'anonymous',
  STUDENT = 'student',
  BOT = 'bot',
}

export interface IJWTPayload {
  sub: string;
  usn: string;
  rol: UserRole;
  exp: number;
  cid: string;
}
