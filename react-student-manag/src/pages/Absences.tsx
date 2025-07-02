
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from "@/components/ui/use-toast";
import Layout from '@/components/Layout';
import { getAllAbsences, getAllStudents, addAbsence } from '@/services/mockData';
import { Absence, Student } from '@/types';

const Absences = () => {
  const [absences, setAbsences] = useState<Absence[]>(getAllAbsences());
  const students = getAllStudents();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newAbsence, setNewAbsence] = useState({
    studentId: '',
    date: new Date().toISOString().split('T')[0], // Current date as default
    course: '',
    reason: '',
  });
  const { toast } = useToast();

  // Helper to get student name from ID
  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.studentId === studentId);
    return student ? student.name : 'Unknown Student';
  };

  // Filter absences by search term
  const filteredAbsences = absences.filter(absence => {
    const studentName = getStudentName(absence.studentId).toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    return (
      studentName.includes(searchLower) ||
      absence.studentId.toLowerCase().includes(searchLower) ||
      absence.course.toLowerCase().includes(searchLower) ||
      (absence.reason && absence.reason.toLowerCase().includes(searchLower))
    );
  });

  const handleAddAbsence = () => {
    // Basic validation
    if (!newAbsence.studentId || !newAbsence.date || !newAbsence.course) {
      toast({
        title: "Error",
        description: "Student, date, and course are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = addAbsence(newAbsence);
      setAbsences(getAllAbsences());
      
      toast({
        title: "Success",
        description: "Absence recorded successfully",
      });
      
      // Reset form and close dialog
      setNewAbsence({
        studentId: '',
        date: new Date().toISOString().split('T')[0],
        course: '',
        reason: '',
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record absence",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout requireAuth requiredRole="admin">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-800">Absence Management</h1>
            <p className="text-gray-600">Record and track student absences</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search absences..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="min-w-[200px]"
              />
              {searchTerm && (
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setSearchTerm('')}
                >
                  ✕
                </button>
              )}
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">Record New Absence</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Record New Absence</DialogTitle>
                  <DialogDescription>Enter the details for the student absence</DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="student">Student</Label>
                    <Select
                      value={newAbsence.studentId}
                      onValueChange={(value) => setNewAbsence({...newAbsence, studentId: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a student" />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem key={student.id} value={student.studentId}>
                            {student.name} ({student.studentId})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newAbsence.date}
                      onChange={(e) => setNewAbsence({...newAbsence, date: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="course">Course</Label>
                    <Input
                      id="course"
                      placeholder="Enter course name"
                      value={newAbsence.course}
                      onChange={(e) => setNewAbsence({...newAbsence, course: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason (Optional)</Label>
                    <Input
                      id="reason"
                      placeholder="Enter reason for absence"
                      value={newAbsence.reason}
                      onChange={(e) => setNewAbsence({...newAbsence, reason: e.target.value})}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  <Button className="bg-green-600 hover:bg-green-700" onClick={handleAddAbsence}>Record Absence</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {/* Absences Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-green-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                    Student ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                    Reason
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAbsences.length > 0 ? (
                  filteredAbsences.map((absence) => (
                    <tr key={absence.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {new Date(absence.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {getStudentName(absence.studentId)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {absence.studentId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {absence.course}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {absence.reason || '—'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      {searchTerm ? "No absences match your search" : "No absences recorded"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Absence count */}
        <p className="mt-4 text-sm text-gray-500">
          Showing {filteredAbsences.length} of {absences.length} absences
        </p>
      </div>
    </Layout>
  );
};

export default Absences;
