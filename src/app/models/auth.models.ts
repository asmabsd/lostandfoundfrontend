export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  cin: string;
  code: string;
  premium: boolean;
  email: string;
  role: string;
}