
import { Student, Absence } from '../types';

// Mock data for students
export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    studentId: 'S1001',
    course: 'Computer Science',
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    studentId: 'S1002',
    course: 'Mathematics',
  },
  {
    id: '3',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    studentId: 'S1003',
    course: 'Physics',
  },
  {
    id: '4',
    name: 'Diana Lee',
    email: 'diana@example.com',
    studentId: 'S1004',
    course: 'Chemistry',
  },
  {
    id: '5',
    name: 'Student User',
    email: 'student@example.com',
    studentId: 'S1005',
    course: 'Biology',
  },
];

// Mock data for absences
export const mockAbsences: Absence[] = [
  {
    id: '1',
    studentId: 'S1001',
    date: '2023-05-01',
    course: 'Programming 101',
    reason: 'Medical appointment',
  },
  {
    id: '2',
    studentId: 'S1001',
    date: '2023-05-10',
    course: 'Data Structures',
  },
  {
    id: '3',
    studentId: 'S1002',
    date: '2023-05-05',
    course: 'Calculus',
    reason: 'Family emergency',
  },
  {
    id: '4',
    studentId: 'S1003',
    date: '2023-05-15',
    course: 'Quantum Mechanics',
  },
  {
    id: '5',
    studentId: 'S1005',
    date: '2023-05-02',
    course: 'Biology 101',
    reason: 'Doctor appointment',
  },
  {
    id: '6',
    studentId: 'S1005',
    date: '2023-05-12',
    course: 'Molecular Biology',
  },
];

// Functions to simulate API calls
export const getStudentById = (studentId: string): Student | undefined => {
  return mockStudents.find(student => student.studentId === studentId);
};

export const getAbsencesByStudentId = (studentId: string): Absence[] => {
  return mockAbsences.filter(absence => absence.studentId === studentId);
};

export const getAllStudents = (): Student[] => {
  return [...mockStudents];
};

export const getAllAbsences = (): Absence[] => {
  return [...mockAbsences];
};

export const addAbsence = (absence: Omit<Absence, 'id'>): Absence => {
  const newAbsence = {
    ...absence,
    id: String(mockAbsences.length + 1),
  };
  mockAbsences.push(newAbsence);
  return newAbsence;
};

export const addStudent = (student: Omit<Student, 'id'>): Student => {
  const newStudent = {
    ...student,
    id: String(mockStudents.length + 1),
  };
  mockStudents.push(newStudent);
  return newStudent;
};

export const deleteStudent = (studentId: string): boolean => {
  const initialLength = mockStudents.length;
  const index = mockStudents.findIndex(student => student.studentId === studentId);
  
  if (index !== -1) {
    mockStudents.splice(index, 1);
    
    // Also delete all absences for this student
    const absenceIndices = mockAbsences.filter(absence => absence.studentId === studentId);
    absenceIndices.forEach(absence => {
      const absIndex = mockAbsences.findIndex(abs => abs.id === absence.id);
      if (absIndex !== -1) {
        mockAbsences.splice(absIndex, 1);
      }
    });
    
    return true;
  }
  
  return false;
};
