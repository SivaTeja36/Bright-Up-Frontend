export interface BatchRequest {
  syllabus_ids?: number[];
  start_date: string;
  end_date: string;
  mentor_name: string;
  is_active?: boolean;
}

export interface BatchResponse {
  id: number;
  syllabus: any[];
  start_date: string;
  end_date: string;
  mentor_name: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  is_active: boolean;
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