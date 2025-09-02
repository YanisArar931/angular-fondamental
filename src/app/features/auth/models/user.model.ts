export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}
