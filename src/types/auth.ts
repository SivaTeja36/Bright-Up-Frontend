export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface UserEducationRequest {
  degree: string;
  specialization: string;
  start_year: number;
  end_year: number;
  current_year_of_study?: number | null;
  status: string; 
  city: string;
  state: string;
}

export interface UserCreationRequest {
  name: string;
  email: string;
  gender: string;
  password: string;
  role: string;
  phone_number: string;
  education: UserEducationRequest;
}

export interface UserCreationResponse {
  id: number;
  message: string;
}

export interface UserEducationResponse {
  id: number;
  degree: string;
  specialization: string;
  start_year: number;
  end_year: number;
  current_year_of_study?: number | null;
  status: string;
  city: string;
  state: string;
  created_at: string; 
  created_by: string;
  updated_at: string;
  updated_by: string;
}

export interface GetUserDetailsResponse {
  id: number;
  name: string;
  email: string;
  gender: string;
  phone_number: string;
  role: string;
  education: UserEducationResponse;
  created_at: string;
  created_by?: string | null;
  updated_at: string;
  updated_by?: string | null;
  is_active: boolean;
}

export interface UpdateUserRequest {
  name: string;
  gender: string;
  role: string;
  phone_number: string;
  education: UserEducationRequest;
  is_active?: boolean;
}

export interface UserPasswordUpdateRequest {
  password: string
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