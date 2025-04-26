export interface DoctorData {
  uid: string;
  email: string;
  name: string;
  licenseNumber: string;
  specialization?: string;
  createdAt: Date;
}

export interface DoctorSignUpData {
  email: string;
  password: string;
  name: string;
  licenseNumber: string;
  specialization?: string;
}
