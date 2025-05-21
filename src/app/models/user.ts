export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  lastName: string;
}

export interface AuthRequest {
  username?: string;
  email: string;
  password: string;
  name?: string;
  lastName?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
