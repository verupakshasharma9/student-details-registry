import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  PlusCircle, 
  HelpCircle, 
  GraduationCap, 
  Info,
  Trash2,
  AlertTriangle,
  RefreshCw,
  Search,
  BookOpen,
  X
} from 'lucide-react';
import Layout from './components/Layout';
import SearchFilter from './components/SearchFilter';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';
import StudentDetail from './components/StudentDetail';
import { getStudents, deleteStudent } from './services/api';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('students');

  // Search & Filtering States
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [course, setCourse] = useState('All Courses');
  const [minGpa, setMinGpa] = useState('');
  const [maxGpa, setMaxGpa] = useState('');

  // Sorting and Pagination States
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Student list and loading states
  const [students, setStudents] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorNotification, setErrorNotification] = useState('');

  // Modals visibility states
  const [selectedStudentDetailId, setSelectedStudentDetailId] = useState(null);
  const [studentToEdit, setStudentToEdit] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Success Notification banner
  const [successBanner, setSuccessBanner] = useState('');

  // 1. Debounce Search Input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on new search term
    }, 250);

    return () => clearTimeout(handler);
  }, [search]);

  // 2. Fetch Students List from API
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setErrorNotification('');
    try {
      const data = await getStudents({
        page,
        limit,
        search: debouncedSearch,
        course,
        min_gpa: minGpa,
        max_gpa: maxGpa,
        sort_by: sortBy,
        sort_order: sortOrder
      });

      setStudents(data.items || []);
      setTotalStudents(data.total || 0);
    } catch (err) {
      console.error('Error fetching students:', err);
      setErrorNotification('Unable to sync registry records with backend server.');
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, course, minGpa, maxGpa, sortBy, sortOrder]);

  useEffect(() => {
    if (activeTab === 'students') {
      fetchStudents();
    }
  }, [fetchStudents, activeTab]);

  // Reset all filters to baseline values
  const handleResetFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setCourse('All Courses');
    setMinGpa('');
    setMaxGpa('');
    setSortBy('id');
    setSortOrder('asc');
    setPage(1);
  };

  // Triggers when a student record is added or modified
  const handleSaveSuccess = () => {
    const message = studentToEdit
      ? 'Student record has been updated successfully.'
      : 'New student has been registered successfully.';
    
    setSuccessBanner(message);
    fetchStudents();
    
    // Clear banner after 4 seconds
    setTimeout(() => {
      setSuccessBanner('');
    }, 4000);
  };

  // Triggers Student deletion permanently
  const handleDeleteConfirmSubmit = async () => {
    if (!deleteConfirmId) return;
    setDeleting(true);
    setErrorNotification('');
    try {
      await deleteStudent(deleteConfirmId);
      setSuccessBanner(`Student record #${deleteConfirmId} has been deleted permanently.`);
      setDeleteConfirmId(null);
      fetchStudents();

      setTimeout(() => {
        setSuccessBanner('');
      }, 4000);
    } catch (err) {
      console.error('Error deleting student:', err);
      setErrorNotification('An error occurred while attempting to delete the record.');
    } finally {
      setDeleting(false);
    }
  };

  // Open Form modal for creation
  const handleAddStudentClick = () => {
    setStudentToEdit(null);
    setIsFormOpen(true);
  };

  // Open Form modal for editing
  const handleEditStudentClick = (student) => {
    setStudentToEdit(student);
    setIsFormOpen(true);
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      onAddStudentClick={handleAddStudentClick}
    >
      
      {/* Dynamic Tab view rendering */}
      {activeTab === 'students' ? (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
          
          {/* Action Success Alert banner */}
          {successBanner && (
            <div className="flex justify-between items-center p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-semibold animate-fadeIn shadow-sm">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-emerald-600 rounded-full text-white">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>{successBanner}</span>
              </div>
              <button 
                onClick={() => setSuccessBanner('')}
                className="text-emerald-500 hover:text-emerald-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Sync Connection Error Alert banner */}
          {errorNotification && (
            <div className="flex justify-between items-center p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm font-semibold animate-fadeIn shadow-sm">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-rose-500 flex-shrink-0" />
                <span>{errorNotification}</span>
              </div>
              <button 
                onClick={() => setErrorNotification('')}
                className="text-rose-500 hover:text-rose-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Search, filters controls component */}
          <SearchFilter
            search={search}
            setSearch={setSearch}
            course={course}
            setCourse={(val) => { setCourse(val); setPage(1); }}
            minGpa={minGpa}
            setMinGpa={(val) => { setMinGpa(val); setPage(1); }}
            maxGpa={maxGpa}
            setMaxGpa={(val) => { setMaxGpa(val); setPage(1); }}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            onReset={handleResetFilters}
          />

          {/* Student Grid Table Container */}
          <StudentList
            students={students}
            loading={loading}
            total={totalStudents}
            page={page}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            onViewProfile={setSelectedStudentDetailId}
            onEditRecord={handleEditStudentClick}
            onDeleteRecord={setDeleteConfirmId}
          />

        </div>
      ) : (
        /* About Tab Panel Contents */
        <div className="p-6 max-w-4xl mx-auto space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-slate-900 px-6 py-8 text-white">
              <div className="flex items-center gap-3 mb-2">
                <GraduationCap className="h-8 w-8 text-indigo-400" />
                <h2 className="text-xl font-bold tracking-tight">University Registry Core</h2>
              </div>
              <p className="text-slate-400 text-sm max-w-xl">
                A robust, enterprise-ready fullstack Student Details Registry system compiled using FastAPI back-end architectures, SQLite databases, and dynamic React components.
              </p>
            </div>
            
            <div className="p-6 space-y-6 text-slate-600 text-sm leading-relaxed">
              
              {/* Architecture Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
                    FastAPI Server Architecture
                  </h3>
                  <p className="text-slate-500 mb-2">
                    Features highly performance-optimized REST routes validating models and data payload schemas in Python using Pydantic validation decorators.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-500 font-medium pl-2">
                    <li>Pydantic Type & Format checking</li>
                    <li>Fast SQLite database synchronization</li>
                    <li>CORS support config mapping</li>
                    <li>Centralized SQL Alchemy CRUD hooks</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                    Modern Vite React Client
                  </h3>
                  <p className="text-slate-500 mb-2">
                    A responsive single-page web environment compiled using Tailwind CSS grids, interactive drawers, robust forms validation, and loading indicators.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-500 font-medium pl-2">
                    <li>Debounced full-text search limits</li>
                    <li>Clickable header sorting grids</li>
                    <li>Axios API mapping layers</li>
                    <li>Responsive drawer details and modal forms</li>
                  </ul>
                </div>
              </div>

              {/* Form Validation details panel */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">
                  Strict Validation Rules Enforced
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  <div className="p-2 bg-white rounded border border-slate-100 shadow-sm">
                    <span className="font-bold text-slate-700 block">Name Fields</span>
                    First and last name strings must be between 2 and 50 characters long.
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-100 shadow-sm">
                    <span className="font-bold text-slate-700 block">University Email</span>
                    Must represent a valid email format ending strictly in <strong>@university.edu</strong>.
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-100 shadow-sm">
                    <span className="font-bold text-slate-700 block">Enrollment No.</span>
                    Follows <strong>XX-YYYY-ZZZZ</strong> (e.g. CS-2026-0042) where XX is department, YYYY is year, ZZZZ is serial.
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-100 shadow-sm">
                    <span className="font-bold text-slate-700 block">GPA Boundaries</span>
                    Must float accurately inside a range strictly between <strong>0.00</strong> and <strong>4.00</strong>.
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-100 shadow-sm">
                    <span className="font-bold text-slate-700 block">Minimum Age Limit</span>
                    Student's computed age (checking year/day gaps) must represent at least <strong>16 years of age</strong>.
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ----------------- Modals and Overlay Components ----------------- */}

      {/* Student Form Modal (Create / Edit) */}
      <StudentForm
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setStudentToEdit(null); }}
        studentToEdit={studentToEdit}
        onSaveSuccess={handleSaveSuccess}
      />

      {/* Student Detail Slide-in Drawer */}
      <StudentDetail
        studentId={selectedStudentDetailId}
        onClose={() => setSelectedStudentDetailId(null)}
      />

      {/* Custom Tailwind Deletion Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden transform scale-100">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                  <Trash2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    Confirm Deletion Action
                  </h3>
                  <p className="text-xs text-slate-400">
                    This step will execute permanent database changes
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-xs font-semibold flex gap-2 mb-4 leading-relaxed">
                <AlertTriangle className="h-4.5 w-4.5 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>
                  Warning: You are about to permanently delete student record #{deleteConfirmId}. This action will delete the database row, and cannot be undone.
                </span>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  disabled={deleting}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 active:bg-slate-200 rounded-lg transition-colors disabled:opacity-40"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirmSubmit}
                  disabled={deleting}
                  className="flex items-center gap-1.5 px-4.5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 active:bg-rose-700 rounded-lg shadow-md hover:shadow-rose-600/10 transition-all disabled:opacity-50"
                >
                  {deleting ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete Record
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </Layout>
  );
}
