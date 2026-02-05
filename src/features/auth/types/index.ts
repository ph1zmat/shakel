// Auth Feature Types

export interface User {
  id: string;
  username: string;
  email: string;
  firstname?: string | null;
  lastname?: string | null;
  isAuthenticated: boolean;
  roles: 'ADMINISTRATOR' | 'USER' | 'SUPER_USER';
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  firstname?: string;
  lastname?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
