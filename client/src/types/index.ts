export type Role = 'admin' | 'doctor' | 'cashier';

export interface User {
  id: number;
  fullname: string;
  email: string;
  role: Role;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  tokens: Tokens;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  email: string;
  slots?: string[]; // Array of ISO date strings
}

export interface Cashier {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  phone: string;
}

export interface Appointment {
  id: string;
  doctor_id: number;
  patient_id: number;
  appointment_time: string; // ISO string
  doctor_name?: string;
  patient_name?: string;
}

export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface Payment {
  id: string;
  appointment_id: number;
  amount: number;
  status: PaymentStatus;
}