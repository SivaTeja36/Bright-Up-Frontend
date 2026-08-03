import api from './axios';
import { ApiResponse } from '../types/api'
import { LoginRequest, LoginResponse, User, UserCreationRequest, UserCreationResponse, UserInfoResponse } from '../types/auth';

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<ApiResponse<LoginResponse>>('/login', credentials);
  return response.data.data;
};

export interface GetUsersParams {
  search?: string;
  filter_by?: string;
  filter_values?: string;
  sort_by?: string;
  order_by?: string;
  page?: number;
  page_size?: number;
}

export const getAllUsers = async (params?: GetUsersParams): Promise<User[]> => {
  const response = await api.get<ApiResponse<User[]>>('/users', { params });
  return response.data.data;
};

export const getUserById = async (userId: number): Promise<User> => {
  const response = await api.get<ApiResponse<User>>(`/users/details/${userId}`);
  return response.data.data;
};

export const createUser = async (userData: UserCreationRequest): Promise<UserCreationResponse> => {
  const response = await api.post<ApiResponse<UserCreationResponse>>('/users', userData);
  return response.data.data;
};

export const getUserInfo = async (): Promise<UserInfoResponse> => {
  const response = await api.get<ApiResponse<UserInfoResponse>>('/users/info');
  return response.data.data;
};