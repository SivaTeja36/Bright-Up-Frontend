import api from './axios';
import { ApiResponse, LoginRequest, LoginResponse, User, UserCreationRequest } from '../types';

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<ApiResponse<LoginResponse>>('/login', credentials);
  return response.data.data;
};

export const getAllUsers = async (): Promise<User[]> => {
  const response = await api.get<ApiResponse<User[]>>('/users');
  return response.data.data;
};

export const getUserById = async (userId: number): Promise<User> => {
  const response = await api.get<ApiResponse<User>>(`/users/details/${userId}`);
  return response.data.data;
};

export const createUser = async (userData: UserCreationRequest): Promise<User> => {
  const response = await api.post<ApiResponse<User>>('/users', userData);
  return response.data.data;
};