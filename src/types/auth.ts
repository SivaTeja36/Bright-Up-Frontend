export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  role: string;
  created_at: string;
  is_active: boolean;
}

export interface UserCreationRequest {
  name: string;
  email: string;
  gender: string;
  password: string;
  role: string;
  phone_number: string;
}

export interface UserCreationResponse {
  id: number;
  message: string;
}


export interface UserInfoResponse {
    id: number;
    name: string;
    email: string;
    role: string;
}

export interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
}