export interface StudentRequest {
  name: string;
  gender: string;
  email: string;
  phone_number: string;
  degree: string;
  specialization: string;
  passout_year: number;
  city: string;
  state: string;
  refered_by: string;
}

export interface StudentResponse {
  id: number;
  name: string;
  gender: string;
  email: string;
  phone_number: string;
  degree: string;
  specialization: string;
  passout_year: number;
  city: string;
  state: string;
  refered_by: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  is_active: boolean;
}

export interface MapStudentToBatchRequest {
  batch_id: number;
  amount: number;
  joined_at: string;
}

export interface MappedBatchStudentResponse {
  id: number;
  name: string;
  gender: string;
  email: string;
  phone_number: string;
  amount: number;
  joined_at: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
}

export interface UpdatedBatchStudentRequest {
  amount: number;
  joined_at: string;
}