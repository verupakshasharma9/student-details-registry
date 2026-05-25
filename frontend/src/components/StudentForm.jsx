import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, RefreshCw } from 'lucide-react';
import { createStudent, updateStudent } from '../services/api';

/**
 * Modal form dialog for creating/editing student records with strict validation rules.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is visible
 * @param {Function} props.onClose - Close handler
 * @param {Object|null} props.studentToEdit - If editing, the active student object; null if creating
 * @param {Function} props.onSaveSuccess - Action to run when saving is complete (trigger refetch)
 */
export default function StudentForm({
  isOpen,
  onClose,
  studentToEdit = null,
  onSaveSuccess
}) {
  const isEditMode = !!studentToEdit;

  // Form Fields State
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    enrollment_number: '',
    course: '',
    gpa: '',
    date_of_birth: ''
  });

  // UI status states
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Sync state with selected student when editing
  useEffect(() => {
    if (isOpen) {
      if (studentToEdit) {
        // Format date_of_birth from datetime/date string (YYYY-MM-DD)
        const dob = studentToEdit.date_of_birth 
          ? studentToEdit.date_of_birth.substring(0, 10) 
          : '';
        setFormData({
          first_name: studentToEdit.first_name || '',
          last_name: studentToEdit.last_name || '',
          email: studentToEdit.email || '',
          enrollment_number: studentToEdit.enrollment_number || '',
          course: studentToEdit.course || '',
          gpa: studentToEdit.gpa !== undefined && studentToEdit.gpa !== null ? studentToEdit.gpa.toString() : '',
          date_of_birth: dob
        });
      } else {
        // Reset to default empty values
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          enrollment_number: '',
          course: '',
          gpa: '',
          date_of_birth: ''
        });
      }
      setErrors({});
      setApiError('');
    }
  }, [isOpen, studentToEdit]);

  if (!isOpen) return null;

  // Real-time onChange handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear validation error on type
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };

  // Age calculation and age limit checker
  const calculateAge = (dobString) => {
    if (!dobString) return 0;
    const dob = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  // Perform complete form validation checks
  const validateForm = () => {
    const newErrors = {};

    // 1. First & Last Names Validation
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required.';
    } else if (formData.first_name.trim().length < 2) {
      newErrors.first_name = 'First name must be at least 2 characters.';
    } else if (formData.first_name.trim().length > 50) {
      newErrors.first_name = 'First name cannot exceed 50 characters.';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required.';
    } else if (formData.last_name.trim().length < 2) {
      newErrors.last_name = 'Last name must be at least 2 characters.';
    } else if (formData.last_name.trim().length > 50) {
      newErrors.last_name = 'Last name cannot exceed 50 characters.';
    }

    // 2. Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email format.';
    } else if (!formData.email.trim().endsWith('@university.edu')) {
      newErrors.email = 'University email must end with @university.edu';
    }

    // 3. Enrollment Number Validation
    const enrollRegex = /^[A-Z]{2,4}-\d{4}-\d{4}$/;
    if (!formData.enrollment_number.trim()) {
      newErrors.enrollment_number = 'Enrollment number is required.';
    } else if (!enrollRegex.test(formData.enrollment_number.trim())) {
      newErrors.enrollment_number = 'Must match format XX-YYYY-ZZZZ (e.g. CS-2026-0042).';
    }

    // 4. Course Validation
    if (!formData.course.trim()) {
      newErrors.course = 'Course department is required.';
    } else if (formData.course.trim().length > 100) {
      newErrors.course = 'Course department name is too long (max 100).';
    }

    // 5. GPA Validation
    const gpaFloat = parseFloat(formData.gpa);
    if (formData.gpa === '' || isNaN(gpaFloat)) {
      newErrors.gpa = 'GPA is required.';
    } else if (gpaFloat < 0.0 || gpaFloat > 4.0) {
      newErrors.gpa = 'GPA score must be between 0.0 and 4.0.';
    }

    // 6. Age Validation
    if (!formData.date_of_birth) {
      newErrors.date_of_birth = 'Date of birth is required.';
    } else {
      const age = calculateAge(formData.date_of_birth);
      if (age < 16) {
        newErrors.date_of_birth = 'Student must be at least 16 years old.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
        enrollment_number: formData.enrollment_number.trim(),
        course: formData.course.trim(),
        gpa: parseFloat(formData.gpa),
        date_of_birth: formData.date_of_birth
      };

      if (isEditMode) {
        await updateStudent(studentToEdit.id, payload);
      } else {
        await createStudent(payload);
      }

      onSaveSuccess();
      onClose();
    } catch (error) {
      console.error('API Error saving student:', error);
      
      // Handle conflict duplicate error response gracefully
      if (error.response && error.response.status === 409) {
        setApiError(error.response.data.detail || 'A student conflict occurred (Duplicate email or enrollment number).');
      } else if (error.response && error.response.data && error.response.data.detail) {
        // Validation or other details
        const detail = error.response.data.detail;
        if (Array.isArray(detail)) {
          // Pydantic/FastAPI request validation array structure
          const msg = detail.map((err) => `${err.loc.join('.')}: ${err.msg}`).join(', ');
          setApiError(msg);
        } else {
          setApiError(detail);
        }
      } else {
        setApiError('A connection problem occurred while communicating with the server. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      
      {/* Modal Card content wrapper */}
      <div 
        className="relative bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden transform transition-all duration-300 scale-100 my-8"
        role="dialog" 
        aria-modal="true"
      >
        
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-800">
              {isEditMode ? `Edit Student Profile #${studentToEdit.id}` : 'Register New Student'}
            </h3>
            <p className="text-xs text-slate-400">
              {isEditMode ? 'Modify record fields and save changes' : 'Fill in the information below to create a new student'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Form body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[calc(100vh-14rem)] overflow-y-auto">
            
            {/* Conflict / Server Error Banner */}
            {apiError && (
              <div className="flex gap-2.5 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-sm font-medium animate-fadeIn">
                <AlertCircle className="h-5 w-5 text-rose-500 flex-shrink-0" />
                <span className="flex-1">{apiError}</span>
              </div>
            )}

            {/* Row: First and Last Names */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
                  First Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="e.g. Jane"
                  className={`w-full px-3.5 py-2 text-sm bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:bg-white text-slate-800 transition-all duration-150 ${
                    errors.first_name ? 'border-rose-300 focus:ring-rose-400' : 'border-slate-200 focus:ring-indigo-500'
                  }`}
                />
                {errors.first_name && (
                  <p className="text-xs text-rose-600 font-medium mt-1">{errors.first_name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
                  Last Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="e.g. Doe"
                  className={`w-full px-3.5 py-2 text-sm bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:bg-white text-slate-800 transition-all duration-150 ${
                    errors.last_name ? 'border-rose-300 focus:ring-rose-400' : 'border-slate-200 focus:ring-indigo-500'
                  }`}
                />
                {errors.last_name && (
                  <p className="text-xs text-rose-600 font-medium mt-1">{errors.last_name}</p>
                )}
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="username@university.edu"
                className={`w-full px-3.5 py-2 text-sm bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:bg-white text-slate-800 transition-all duration-150 ${
                  errors.email ? 'border-rose-300 focus:ring-rose-400' : 'border-slate-200 focus:ring-indigo-500'
                }`}
              />
              <p className="text-[10px] text-slate-400 mt-1 font-medium">Must end with @university.edu</p>
              {errors.email && (
                <p className="text-xs text-rose-600 font-medium mt-1">{errors.email}</p>
              )}
            </div>

            {/* Enrollment Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
                Enrollment Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="enrollment_number"
                value={formData.enrollment_number}
                onChange={handleChange}
                placeholder="e.g. CS-2026-0042"
                className={`w-full px-3.5 py-2 text-sm font-mono bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:bg-white text-slate-800 transition-all duration-150 ${
                  errors.enrollment_number ? 'border-rose-300 focus:ring-rose-400' : 'border-slate-200 focus:ring-indigo-500'
                }`}
              />
              <p className="text-[10px] text-slate-400 mt-1 font-medium">Format: XX-YYYY-ZZZZ (2-4 letters, 4-digit year, 4-digit serial)</p>
              {errors.enrollment_number && (
                <p className="text-xs text-rose-600 font-medium mt-1">{errors.enrollment_number}</p>
              )}
            </div>

            {/* Course / Department */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
                Course / Department <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="course"
                value={formData.course}
                onChange={handleChange}
                placeholder="e.g. Computer Science"
                className={`w-full px-3.5 py-2 text-sm bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:bg-white text-slate-800 transition-all duration-150 ${
                  errors.course ? 'border-rose-300 focus:ring-rose-400' : 'border-slate-200 focus:ring-indigo-500'
                }`}
              />
              {errors.course && (
                <p className="text-xs text-rose-600 font-medium mt-1">{errors.course}</p>
              )}
            </div>

            {/* Row: GPA and DOB */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
                  GPA (0.0 to 4.0) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  name="gpa"
                  step="0.01"
                  min="0.0"
                  max="4.0"
                  value={formData.gpa}
                  onChange={handleChange}
                  placeholder="e.g. 3.75"
                  className={`w-full px-3.5 py-2 text-sm bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:bg-white text-slate-800 transition-all duration-150 ${
                    errors.gpa ? 'border-rose-300 focus:ring-rose-400' : 'border-slate-200 focus:ring-indigo-500'
                  }`}
                />
                {errors.gpa && (
                  <p className="text-xs text-rose-600 font-medium mt-1">{errors.gpa}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
                  Date of Birth <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2 text-sm bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:bg-white text-slate-800 transition-all duration-150 ${
                    errors.date_of_birth ? 'border-rose-300 focus:ring-rose-400' : 'border-slate-200 focus:ring-indigo-500'
                  }`}
                />
                {errors.date_of_birth && (
                  <p className="text-xs text-rose-600 font-medium mt-1">{errors.date_of_birth}</p>
                )}
              </div>
            </div>

          </div>

          {/* Footer action buttons */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-150 active:bg-slate-200 rounded-lg transition-colors disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-1.5 px-5 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg shadow-md hover:shadow-indigo-500/10 transition-all disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {isEditMode ? 'Save Changes' : 'Register Student'}
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
