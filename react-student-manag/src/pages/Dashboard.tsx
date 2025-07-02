
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { mockStudents, getAbsencesByStudentId, getAllStudents, getAllAbsences } from '@/services/mockData';
import Layout from '@/components/Layout';

const Dashboard = () => {
  const { user } = useAuth();
  
  if (!user) {
    return null; // Let the Layout handle redirection
  }
  
  if (user.role === 'admin') {
    return <AdminDashboard />;
  } else {
    return <StudentDashboard />;
  }
};

const AdminDashboard = () => {
  const students = getAllStudents();
  const absences = getAllAbsences();
  
  // Calculate basic stats
  const totalStudents = students.length;
  const totalAbsences = absences.length;
  const studentsWithAbsences = new Set(absences.map(a => a.studentId)).size;
  const absentRate = totalStudents > 0 ? (studentsWithAbsences / totalStudents) * 100 : 0;
  
  // Count absences by course
  const absencesByCourse = absences.reduce((acc: Record<string, number>, absence) => {
    acc[absence.course] = (acc[absence.course] || 0) + 1;
    return acc;
  }, {});
  
  // Get top courses with most absences
  const topCourses = Object.entries(absencesByCourse)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  
  // Calculate absences by day to show pattern
  const absencesByDay = absences.reduce((acc: Record<string, number>, absence) => {
    const date = new Date(absence.date);
    const day = date.toLocaleDateString('en-US', { weekday: 'long' });
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});
  
  // For recent absences, sort by date
  const recentAbsences = [...absences]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <Layout requireAuth requiredRole="admin">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-green-800">Administrator Dashboard</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-md border-green-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-green-700">{totalStudents}</CardTitle>
              <CardDescription>Total Students</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="shadow-md border-green-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-green-700">{totalAbsences}</CardTitle>
              <CardDescription>Total Absences</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="shadow-md border-green-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-green-700">{studentsWithAbsences}</CardTitle>
              <CardDescription>Students with Absences</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="shadow-md border-green-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-green-700">{absentRate.toFixed(1)}%</CardTitle>
              <CardDescription>Absence Rate</CardDescription>
            </CardHeader>
          </Card>
        </div>
        
        {/* Two column layout for charts/data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-md border-green-100">
            <CardHeader>
              <CardTitle>Courses with Most Absences</CardTitle>
              <CardDescription>Top courses by number of absences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCourses.map(([course, count], index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-5">
                      <div
                        className="bg-green-600 h-5 rounded-full"
                        style={{ width: `${(count / totalAbsences) * 100}%` }}
                      ></div>
                    </div>
                    <div className="ml-4 min-w-[120px]">
                      <div className="text-sm font-medium">{course}</div>
                      <div className="text-sm text-gray-500">{count} absences</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-md border-green-100">
            <CardHeader>
              <CardTitle>Recent Absences</CardTitle>
              <CardDescription>Latest recorded absences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAbsences.map((absence) => {
                  const student = students.find(s => s.studentId === absence.studentId);
                  return (
                    <div key={absence.id} className="border-b pb-3 last:border-b-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{student?.name || 'Unknown Student'}</p>
                          <p className="text-sm text-gray-500">{absence.course}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{new Date(absence.date).toLocaleDateString()}</p>
                          <p className="text-xs text-gray-500">{absence.reason || 'No reason provided'}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 text-green-800">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a 
              href="/students" 
              className="bg-white p-4 rounded-lg shadow border border-green-100 hover:shadow-md transition-shadow flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <span>Manage Students</span>
            </a>
            
            <a 
              href="/absences" 
              className="bg-white p-4 rounded-lg shadow border border-green-100 hover:shadow-md transition-shadow flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span>Record Absences</span>
            </a>
            
            <a 
              href="#" 
              className="bg-white p-4 rounded-lg shadow border border-green-100 hover:shadow-md transition-shadow flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span>Generate Reports</span>
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const StudentDashboard = () => {
  const { user } = useAuth();
  
  // Find student data based on email
  const student = mockStudents.find(s => s.email === user?.email);
  
  if (!student) {
    return (
      <Layout requireAuth requiredRole="student">
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-green-800">Student Profile Not Found</h2>
          <p>Your student profile is not yet set up. Please contact an administrator.</p>
        </div>
      </Layout>
    );
  }
  
  // Get student's absences
  const absences = getAbsencesByStudentId(student.studentId);
  const totalAbsences = absences.length;
  
  // Count absences by course
  const absencesByCourse = absences.reduce((acc: Record<string, number>, absence) => {
    acc[absence.course] = (acc[absence.course] || 0) + 1;
    return acc;
  }, {});
  
  // Get courses sorted by absence count
  const coursesByAbsence = Object.entries(absencesByCourse)
    .sort((a, b) => b[1] - a[1]);
  
  // Format absences for display, most recent first
  const recentAbsences = [...absences]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Layout requireAuth requiredRole="student">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2 text-green-800">Student Dashboard</h1>
        <p className="text-gray-600 mb-8">Welcome back, {student.name}</p>
        
        {/* Student Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-green-100">
          <div className="flex flex-col md:flex-row md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-green-800">Student Information</h2>
              <p className="text-gray-500 mt-1">Your personal details</p>
            </div>
            <div className="mt-4 md:mt-0 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500">Student ID</p>
                <p className="font-medium">{student.studentId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{student.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Program</p>
                <p className="font-medium">{student.course}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Absence Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-md border-green-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-green-700">{totalAbsences}</CardTitle>
              <CardDescription>Total Absences</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="shadow-md border-green-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-green-700">{coursesByAbsence.length}</CardTitle>
              <CardDescription>Courses with Absences</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="shadow-md border-green-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-green-700">
                {coursesByAbsence.length > 0 ? coursesByAbsence[0][0] : 'None'}
              </CardTitle>
              <CardDescription>Course with Most Absences</CardDescription>
            </CardHeader>
          </Card>
        </div>
        
        {/* Detailed Absence Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-md border-green-100">
            <CardHeader>
              <CardTitle>Absences by Course</CardTitle>
              <CardDescription>Number of absences in each course</CardDescription>
            </CardHeader>
            <CardContent>
              {coursesByAbsence.length > 0 ? (
                <div className="space-y-4">
                  {coursesByAbsence.map(([course, count], index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-5">
                        <div
                          className="bg-green-600 h-5 rounded-full"
                          style={{ width: `${(count / totalAbsences) * 100}%` }}
                        ></div>
                      </div>
                      <div className="ml-4 min-w-[120px]">
                        <div className="text-sm font-medium">{course}</div>
                        <div className="text-sm text-gray-500">{count} absences</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-gray-500">No absences recorded</p>
              )}
            </CardContent>
          </Card>
          
          <Card className="shadow-md border-green-100">
            <CardHeader>
              <CardTitle>Recent Absences</CardTitle>
              <CardDescription>Your latest recorded absences</CardDescription>
            </CardHeader>
            <CardContent>
              {recentAbsences.length > 0 ? (
                <div className="space-y-4">
                  {recentAbsences.map((absence) => (
                    <div key={absence.id} className="border-b pb-3 last:border-b-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{absence.course}</p>
                          <p className="text-sm text-gray-500">{absence.reason || 'No reason provided'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{new Date(absence.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-gray-500">No absences recorded</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
