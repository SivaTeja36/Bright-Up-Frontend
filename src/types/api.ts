export interface ApiResponse<T> {
  status_message: string;
  data: T;
}

export interface SuccessMessageResponse {
  message: string;
}