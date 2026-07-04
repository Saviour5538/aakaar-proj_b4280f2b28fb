import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
});

api.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface RegisterResponse {
  id: number;
  username: string;
}

export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
  const response = await api.post<RegisterResponse>('/api/auth/register', data);
  return response.data;
};

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/api/auth/login', data);
  return response.data;
};

export interface Category {
  id: number;
  name: string;
}

export interface CreateCategoryRequest {
  name: string;
}

export const createCategory = async (data: CreateCategoryRequest): Promise<Category> => {
  const response = await api.post<Category>('/api/categories', data);
  return response.data;
};

export const listCategories = async (): Promise<Category[]> => {
  const response = await api.get<Category[]>('/api/categories');
  return response.data;
};

export interface Expense {
  id: number;
  description: string;
  amount: number;
  category_id: number;
  date: string;
}

export interface CreateExpenseRequest {
  description: string;
  amount: number;
  category_id: number;
  date: string;
}

export const createExpense = async (data: CreateExpenseRequest): Promise<Expense> => {
  const response = await api.post<Expense>('/api/expenses', data);
  return response.data;
};

export const listExpenses = async (): Promise<Expense[]> => {
  const response = await api.get<Expense[]>('/api/expenses');
  return response.data;
};

export const deleteExpense = async (id: number): Promise<void> => {
  await api.delete(`/api/expenses/${id}`);
};

export interface Summary {
  total_expenses: number;
  total_income: number;
  net_savings: number;
  category_breakdown: {
    [category: string]: number;
  };
}

export const getSummary = async (): Promise<Summary> => {
  const response = await api.get<Summary>('/api/summary');
  return response.data;
};

// Auto-added stubs for functions a page imported but the client omitted.
export const deleteCategory = async (id: string) => {
  const res = await api.delete(`/api/categorys/${id}`);
  return res.data;
};
export const getCategoryById = async (id: string) => {
  const res = await api.get(`/api/categorybyids/${id}`);
  return res.data;
};
export const updateCategory = async (id: string, data?: any) => {
  const res = await api.put(`/api/categorys/${id}`, data);
  return res.data;
};
