export interface LoginRequest {
  userName: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  name: string;
  role: string;
  id: number;
  contact: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  contact: string;
  role: string;
  created_at: string;
  is_active: boolean;
}

export interface UserCreationRequest {
  name: string;
  username: string;
  password: string;
  role: string;
  contact: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
}