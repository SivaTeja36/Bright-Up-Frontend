import api from './axios';
import { ApiResponse, StudentRequest, StudentResponse, MapStudentToBatchRequest, MappedBatchStudentResponse, UpdatedBatchStudentRequest, SuccessMessageResponse } from '../types/';

export const getAllStudents = async (): Promise<StudentResponse[]> => {
  const response = await api.get<ApiResponse<StudentResponse[]>>('/students');
  return response.data.data;
};

export const getStudentById = async (studentId: number): Promise<StudentResponse> => {
  const response = await api.get<ApiResponse<StudentResponse>>(`/students/${studentId}`);
  return response.data.data;
};

export const createStudent = async (studentData: StudentRequest): Promise<SuccessMessageResponse> => {
  const response = await api.post<ApiResponse<SuccessMessageResponse>>('/students', studentData);
  return response.data.data;
};

export const updateStudent = async (studentId: number, studentData: StudentRequest): Promise<SuccessMessageResponse> => {
  const response = await api.put<ApiResponse<SuccessMessageResponse>>(`/students/${studentId}`, studentData);
  return response.data.data;
};

export const deleteStudent = async (studentId: number): Promise<SuccessMessageResponse> => {
  const response = await api.delete<ApiResponse<SuccessMessageResponse>>(`/students/${studentId}`);
  return response.data.data;
};

export const mapStudentToBatch = async (studentId: number, mappingData: MapStudentToBatchRequest): Promise<SuccessMessageResponse> => {
  const response = await api.post<ApiResponse<SuccessMessageResponse>>(`/students/${studentId}/batches`, mappingData);
  return response.data.data;
};

export const getBatchStudents = async (batchId: number): Promise<MappedBatchStudentResponse[]> => {
  const response = await api.get<ApiResponse<MappedBatchStudentResponse[]>>(`/students/batches/${batchId}`);
  return response.data.data;
};

export const getBatchStudentById = async (mappingId: number): Promise<MappedBatchStudentResponse> => {
  const response = await api.get<ApiResponse<MappedBatchStudentResponse>>(`/students/mappings/${mappingId}`);
  return response.data.data;
};

export const updateBatchStudent = async (mappingId: number, mappingData: UpdatedBatchStudentRequest): Promise<SuccessMessageResponse> => {
  const response = await api.put<ApiResponse<SuccessMessageResponse>>(`/students/mappings/${mappingId}`, mappingData);
  return response.data.data;
};

export const deleteBatchStudent = async (mappingId: number): Promise<SuccessMessageResponse> => {
  const response = await api.delete<ApiResponse<SuccessMessageResponse>>(`/students/mappings/${mappingId}`);
  return response.data.data;
};