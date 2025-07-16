export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface DemoCredentials {
  email: string;
  password: string;
}

export interface ApiError {
  message: string;
  code?: string;
} 