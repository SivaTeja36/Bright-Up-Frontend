import { ApiResponse, SuccessMessageResponse } from '../types/api';
import {
  BatchRequest,
  BatchResponse,
  ClassScheduleRequest,
  ClassScheduleResponse,
  UpdateClassScheduleRequest,
  MapUserToBatchRequest,
  GetMappedBatchStudentResponse,
  UpdatedBatchStudentRequest,
  BatchStudentPaymentRequest,
  GetBatchStudentPayment
} from '../types/batch';
import api from './axios';

// ==================== Batch APIs ====================

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

// ==================== Batch Students APIs ====================

export const createBatchStudent = async (
  batchId: number,
  studentData: MapUserToBatchRequest
): Promise<SuccessMessageResponse> => {
  const response = await api.post<ApiResponse<SuccessMessageResponse>>(`/batches/${batchId}/students`, studentData);
  return response.data.data;
};

export const getBatchStudents = async (batchId: number): Promise<GetMappedBatchStudentResponse[]> => {
  const response = await api.get<ApiResponse<GetMappedBatchStudentResponse[]>>(`/batches/${batchId}/students`);
  return response.data.data;
};

export const getBatchStudentById = async (
  batchId: number,
  batchStudentId: number
): Promise<GetMappedBatchStudentResponse> => {
  const response = await api.get<ApiResponse<GetMappedBatchStudentResponse>>(
    `/batches/${batchId}/students/${batchStudentId}`
  );
  return response.data.data;
};

export const updateBatchStudent = async (
  batchId: number,
  batchStudentId: number,
  studentData: UpdatedBatchStudentRequest
): Promise<SuccessMessageResponse> => {
  const response = await api.put<ApiResponse<SuccessMessageResponse>>(
    `/batches/${batchId}/students/${batchStudentId}`,
    studentData
  );
  return response.data.data;
};

export const deleteBatchStudent = async (batchId: number, batchStudentId: number): Promise<SuccessMessageResponse> => {
  const response = await api.delete<ApiResponse<SuccessMessageResponse>>(
    `/batches/${batchId}/students/${batchStudentId}`
  );
  return response.data.data;
};

// ==================== Batch Student Payments APIs ====================

export const createBatchStudentPayment = async (
  batchId: number,
  batchStudentId: number,
  paymentData: BatchStudentPaymentRequest
): Promise<SuccessMessageResponse> => {
  const response = await api.post<ApiResponse<SuccessMessageResponse>>(
    `/batches/${batchId}/students/${batchStudentId}/payments`,
    paymentData
  );
  return response.data.data;
};

export const getBatchStudentPayments = async (
  batchId: number,
  batchStudentId: number
): Promise<GetBatchStudentPayment[]> => {
  const response = await api.get<ApiResponse<GetBatchStudentPayment[]>>(
    `/batches/${batchId}/students/${batchStudentId}/payments`
  );
  return response.data.data;
};

export const updateBatchStudentPayment = async (
  batchId: number,
  batchStudentId: number,
  paymentId: number,
  paymentData: BatchStudentPaymentRequest
): Promise<SuccessMessageResponse> => {
  const response = await api.put<ApiResponse<SuccessMessageResponse>>(
    `/batches/${batchId}/students/${batchStudentId}/payments/${paymentId}`,
    paymentData
  );
  return response.data.data;
};

// ==================== Class Schedule APIs ====================

export const getClassSchedulesByBatch = async (batchId: number): Promise<ClassScheduleResponse[]> => {
  const response = await api.get<ApiResponse<ClassScheduleResponse[]>>(`/batches/${batchId}/schedule-class`);
  return response.data.data;
};

export const createClassSchedule = async (
  batchId: number,
  scheduleData: ClassScheduleRequest
): Promise<SuccessMessageResponse> => {
  const response = await api.post<ApiResponse<SuccessMessageResponse>>(
    `/batches/${batchId}/schedule-class`,
    scheduleData
  );
  return response.data.data;
};

export const updateClassSchedule = async (
  batchId: number,
  scheduleId: number,
  scheduleData: UpdateClassScheduleRequest
): Promise<SuccessMessageResponse> => {
  const response = await api.put<ApiResponse<SuccessMessageResponse>>(
    `/batches/${batchId}/schedule-class/${scheduleId}`,
    scheduleData
  );
  return response.data.data;
};

export const deleteClassSchedule = async (batchId: number, scheduleId: number): Promise<SuccessMessageResponse> => {
  const response = await api.delete<ApiResponse<SuccessMessageResponse>>(
    `/batches/${batchId}/schedule-class/${scheduleId}`
  );
  return response.data.data;
};