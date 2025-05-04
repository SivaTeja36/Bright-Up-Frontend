import api from './axios';
import { ApiResponse, BatchRequest, BatchResponse, ClassScheduleRequest, ClassScheduleResponse, SuccessMessageResponse, UpdateClassScheduleRequest } from '../types';

export const getAllBatches = async (): Promise<BatchResponse[]> => {
  const response = await api.get<ApiResponse<BatchResponse[]>>('/batches');
  return response.data.data;
};

export const getBatchById = async (batchId: number): Promise<BatchResponse> => {
  const response = await api.get<ApiResponse<BatchResponse>>(`/batches/${batchId}`);
  return response.data.data;
};

export const createBatch = async (batchData: BatchRequest): Promise<SuccessMessageResponse> => {
  const response = await api.post<ApiResponse<SuccessMessageResponse>>('/batches', batchData);
  return response.data.data;
};

export const updateBatch = async (batchId: number, batchData: BatchRequest): Promise<SuccessMessageResponse> => {
  const response = await api.put<ApiResponse<SuccessMessageResponse>>(`/batches/${batchId}`, batchData);
  return response.data.data;
};

export const deleteBatch = async (batchId: number): Promise<SuccessMessageResponse> => {
  const response = await api.delete<ApiResponse<SuccessMessageResponse>>(`/batches/${batchId}`);
  return response.data.data;
};

export const getClassSchedulesByBatch = async (batchId: number): Promise<ClassScheduleResponse[]> => {
  const response = await api.get<ApiResponse<ClassScheduleResponse[]>>(`/batches/${batchId}/schedule-class`);
  return response.data.data;
};

export const createClassSchedule = async (batchId: number, scheduleData: ClassScheduleRequest): Promise<SuccessMessageResponse> => {
  const response = await api.post<ApiResponse<SuccessMessageResponse>>(`/batches/${batchId}/schedule-class`, scheduleData);
  return response.data.data;
};

export const updateClassSchedule = async (batchId: number, scheduleId: number, scheduleData: UpdateClassScheduleRequest): Promise<SuccessMessageResponse> => {
  const response = await api.put<ApiResponse<SuccessMessageResponse>>(`/batches/${batchId}/schedule-class/${scheduleId}`, scheduleData);
  return response.data.data;
};

export const deleteClassSchedule = async (batchId: number, scheduleId: number): Promise<SuccessMessageResponse> => {
  const response = await api.delete<ApiResponse<SuccessMessageResponse>>(`/batches/${batchId}/schedule-class/${scheduleId}`);
  return response.data.data;
};