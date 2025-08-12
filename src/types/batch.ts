export interface BatchRequest {
  name: string;
  syllabus_ids?: number[];
  start_date: string;
  end_date: string;
  mentor_id: number;
}

export interface BatchResponse {
  id: number;
  name: string;
  syllabus: any[];
  start_date: string;
  end_date: string;
  mentor_id: number;
  mentor: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  is_active: boolean;
}

export interface MapUserToBatchRequest {
  student_id: number;
  class_fee: number;
  mentor_fee: number;
  referral_by: number;
  referral_fee: number;
  joined_at: string; 
}

export interface GetMappedBatchStudentResponse {
  id: number;
  name: string;
  gender: string;
  email: string;
  phone_number: string;
  class_fee: number;
  paid_fee: number;
  student_pending_fee: number;
  mentor_fee: number;
  mentor_recieved_fee: number;
  mentor_pending_fee: number;
  referral_by: string;
  referral_fee: number;
  referral_recieved_fee: number;
  referral_pending_fee: number;
  joined_at: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
}

export interface UpdatedBatchStudentRequest {
  class_fee: number;
  mentor_fee: number;
  referral_by: number;
  referral_fee: number;
  joined_at: string;
}

export interface BatchStudentPaymentRequest {
  payment_date: string;
  amount_paid: number;
  mentor_share: number;
  referral_share: number;
}

export interface GetBatchStudentPayment {
  id: number;
  payment_date: string;
  amount_paid: number;
  mentor_share: number;
  referral_share: number;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
}

export enum Day {
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
  Sunday = "Sunday"
}

export interface ClassScheduleRequest {
  day: Day;
  start_time: string;
  end_time: string;
}

export interface UpdateClassScheduleRequest {
  day: Day;
  start_time: string;
  end_time: string;
}

export interface ClassScheduleResponse {
  id: number;
  day: string;
  start_time: string;
  end_time: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  is_active: boolean;
}