import api from './axios';
import { ApiResponse } from '../types/api'
import { 
  LoginRequest, 
  LoginResponse, 
  UserDetails, 
  UserCreationRequest, 
  UserCreationResponse, 
  UserInfoResponse, 
  UserUpdateRequest, 
  UserPasswordUpdateRequest 
} from '../types/auth';

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<ApiResponse<LoginResponse>>('/login', credentials);
  return response.data.data;
};

export const getAllUsers = async (): Promise<UserDetails[]> => {
  const response = await api.get<ApiResponse<UserDetails[]>>('/users');
  return response.data.data;
};

export const getUserById = async (userId: number): Promise<UserDetails> => {
  const response = await api.get<ApiResponse<UserDetails>>(`/users/data/${userId}`);
  return response.data.data;
};

export const createUser = async (userData: UserCreationRequest): Promise<UserCreationResponse> => {
  const response = await api.post<ApiResponse<UserCreationResponse>>('/users', userData);
  return response.data.data;
};

export const updateUser = async (
  userId: number,
  userData: UserUpdateRequest & { is_active?: boolean }
): Promise<UserCreationResponse> => {
  const response = await api.put<ApiResponse<UserCreationResponse>>(
    `/users/data/${userId}`,
    userData
  );
  return response.data.data;
};

export const updateUserPassword = async (userData: UserPasswordUpdateRequest): Promise<UserCreationResponse> => {
  const response = await api.put<ApiResponse<UserCreationResponse>>('/users/password', userData);
  return response.data.data;
};

export const getUserInfo = async (): Promise<UserInfoResponse> => {
  const response = await api.get<ApiResponse<UserInfoResponse>>('/users/info');
  return response.data.data;
};