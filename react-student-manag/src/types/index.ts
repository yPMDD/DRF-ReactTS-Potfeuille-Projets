
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
}

export interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  course: string;
}

export interface Absence {
  id: string;
  studentId: string;
  date: string;
  course: string;
  reason?: string;
}
