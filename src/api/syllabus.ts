import { ApiResponse, SuccessMessageResponse } from '../types/api';
import { SyllabusRequest, SyllabusResponse } from '../types/syllabus';
import api from './axios';

export const getAllSyllabi = async (): Promise<SyllabusResponse[]> => {
  const response = await api.get<ApiResponse<SyllabusResponse[]>>('/syllabus');
  return response.data.data;
};

export const getSyllabusById = async (syllabusId: number): Promise<SyllabusResponse> => {
  const response = await api.get<ApiResponse<SyllabusResponse>>(`/syllabus/${syllabusId}`);
  return response.data.data;
};

export const createSyllabus = async (syllabusData: SyllabusRequest): Promise<SuccessMessageResponse> => {
  const response = await api.post<ApiResponse<SuccessMessageResponse>>('/syllabus', syllabusData);
  return response.data.data;
};

export const updateSyllabus = async (syllabusId: number, syllabusData: SyllabusRequest): Promise<SuccessMessageResponse> => {
  const response = await api.put<ApiResponse<SuccessMessageResponse>>(`/syllabus/${syllabusId}`, syllabusData);
  return response.data.data;
};

export const deleteSyllabus = async (syllabusId: number): Promise<SuccessMessageResponse> => {
  const response = await api.delete<ApiResponse<SuccessMessageResponse>>(`/syllabus/${syllabusId}`);
  return response.data.data;
};