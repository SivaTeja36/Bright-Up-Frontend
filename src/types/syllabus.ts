export interface SyllabusRequest {
  name: string;
  topics: string[];
}

export interface SyllabusResponse {
  id: number;
  name: string;
  topics: string[];
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
}