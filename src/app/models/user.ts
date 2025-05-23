export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  lastName: string;
  status: boolean;
}

export interface AuthRequest {
  username?: string;
  password: string;
  email: string;
  name?: string;
  lastName?: string;
  status?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
