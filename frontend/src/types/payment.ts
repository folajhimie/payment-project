export interface Payment {
  id: number;
  amount: number;
  description: string;
  date: string;
}

export interface CreatePaymentDTO {
  amount: string;
  description: string;
}

export interface UpdatePaymentDTO {
  amount?: string;
  description?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}