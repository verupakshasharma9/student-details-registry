import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Calendar, 
  Award, 
  Hash, 
  BookOpen, 
  Clock, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { getStudent } from '../services/api';

/**
 * Sidebar drawer/modal view displaying complete student profile details.
 * Performs a dynamic fetch to verify the individual student endpoint.
 * 
 * @param {Object} props
 * @param {number|string|null} props.studentId - Student ID to fetch and display. If null, component remains hidden
 * @param {Function} props.onClose - Close action
 */
export default function StudentDetail({ studentId, onClose }) {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch student profile details when ID changes
  useEffect(() => {
    if (studentId) {
      const fetchStudentData = async () => {
        setLoading(true);
        setError('');
        setStudent(null);
        try {
          const data = await getStudent(studentId);
          setStudent(data);
        } catch (err) {
          console.error('Error fetching student details:', err);
          setError('Failed to load student profile details from the registry.');
        } finally {
          setLoading(false);
        }
      };

      fetchStudentData();
    }
  }, [studentId]);

  if (!studentId) return null;

  // Format dates cleanly
  const formatDateString = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return dateStr;
    }
  };

  const formatTimestamp = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleString(undefined, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  // Calculate age from date_of_birth
  const calculateAge = (dobString) => {
    if (!dobString) return '';
    const dob = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return `${age} years old`;
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      {/* Sliding Sidebar Drawer */}
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 translate-x-0"
        role="dialog"
        aria-modal="true"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50">
          <div>
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Student Profile Card
            </span>
            <h3 className="text-base font-bold text-slate-800 mt-1">
              Personal Information
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {loading ? (
            /* Loading State Spinner */
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <RefreshCw className="h-8 w-8 animate-spin text-indigo-600 mb-2" />
              <p className="text-sm font-medium">Fetching details from registry...</p>
            </div>
          ) : error ? (
            /* Error State Message */
            <div className="flex gap-2.5 p-4 bg-rose-50 border border-rose-100 text-rose-800 rounded-lg text-sm">
              <AlertCircle className="h-5 w-5 text-rose-500 flex-shrink-0" />
              <p className="font-medium">{error}</p>
            </div>
          ) : student ? (
            /* Active Profile Display */
            <>
              {/* Profile Avatar Card */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="h-16 w-16 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-full flex items-center justify-center text-white shadow-md">
                  <span className="text-xl font-bold tracking-wider uppercase">
                    {student.first_name[0]}{student.last_name[0]}
                  </span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">
                    {student.first_name} {student.last_name}
                  </h2>
                  <p className="text-xs text-indigo-600 font-bold bg-indigo-50 border border-indigo-100 rounded px-1.5 py-0.5 inline-block mt-0.5">
                    ID #{student.id}
                  </p>
                </div>
              </div>

              {/* Information list */}
              <div className="space-y-4">
                
                {/* Email Field */}
                <div className="flex gap-3">
                  <div className="p-2 bg-slate-100 text-slate-500 rounded-lg h-9 w-9 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      University Email
                    </span>
                    <a 
                      href={`mailto:${student.email}`} 
                      className="text-sm font-semibold text-slate-800 hover:text-indigo-600 break-all"
                    >
                      {student.email}
                    </a>
                  </div>
                </div>

                {/* Enrollment Number Field */}
                <div className="flex gap-3">
                  <div className="p-2 bg-slate-100 text-slate-500 rounded-lg h-9 w-9 flex items-center justify-center flex-shrink-0">
                    <Hash className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Enrollment Number
                    </span>
                    <code className="text-xs font-mono font-bold bg-slate-50 border border-slate-200 text-slate-700 px-2 py-0.5 rounded inline-block mt-0.5">
                      {student.enrollment_number}
                    </code>
                  </div>
                </div>

                {/* Course Field */}
                <div className="flex gap-3">
                  <div className="p-2 bg-slate-100 text-slate-500 rounded-lg h-9 w-9 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Department & Course
                    </span>
                    <span className="text-sm font-bold text-slate-800">
                      {student.course}
                    </span>
                  </div>
                </div>

                {/* GPA Field */}
                <div className="flex gap-3">
                  <div className="p-2 bg-slate-100 text-slate-500 rounded-lg h-9 w-9 flex items-center justify-center flex-shrink-0">
                    <Award className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Cumulative GPA
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-sm font-extrabold text-slate-800">
                        {parseFloat(student.gpa).toFixed(2)}
                      </span>
                      <span className="text-xs text-slate-400">/ 4.0</span>
                    </div>
                  </div>
                </div>

                {/* Date of Birth Field */}
                <div className="flex gap-3">
                  <div className="p-2 bg-slate-100 text-slate-500 rounded-lg h-9 w-9 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Date of Birth
                    </span>
                    <span className="text-sm font-semibold text-slate-800">
                      {formatDateString(student.date_of_birth)}
                    </span>
                    <span className="block text-xs text-slate-400">
                      {calculateAge(student.date_of_birth)}
                    </span>
                  </div>
                </div>

              </div>

              {/* Timestamp Audit Trail */}
              <div className="pt-6 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  System Audit Trail
                </h4>
                
                <div className="flex gap-3">
                  <div className="p-2 bg-slate-50 text-slate-400 rounded-lg h-8 w-8 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold text-slate-400 uppercase">
                      Record Created
                    </span>
                    <span className="text-xs font-semibold text-slate-600">
                      {formatTimestamp(student.created_at)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="p-2 bg-slate-50 text-slate-400 rounded-lg h-8 w-8 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold text-slate-400 uppercase">
                      Last Updated
                    </span>
                    <span className="text-xs font-semibold text-slate-600">
                      {formatTimestamp(student.updated_at)}
                    </span>
                  </div>
                </div>

              </div>
            </>
          ) : null}

        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-slate-200 hover:bg-slate-300 text-slate-700 active:bg-slate-400 font-bold text-sm rounded-lg transition-colors"
          >
            Close Profile
          </button>
        </div>

      </div>
    </div>
  );
}
