import React from 'react';
import { 
  Eye, 
  Pencil, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUp, 
  ArrowDown, 
  ChevronsUpDown,
  GraduationCap
} from 'lucide-react';

/**
 * StudentList Table grid with sorting headers, loading states, and dynamic pagination.
 * 
 * @param {Object} props
 * @param {Array} props.students - List of student objects to render
 * @param {boolean} props.loading - Loading state
 * @param {number} props.total - Total number of student records matched
 * @param {number} props.page - Current active page (1-indexed)
 * @param {Function} props.setPage - Update active page
 * @param {number} props.limit - Number of students per page
 * @param {Function} props.setLimit - Update page limit size
 * @param {string} props.sortBy - Current field sorted by
 * @param {Function} props.setSortBy - Update sort field
 * @param {string} props.sortOrder - Current sort direction ('asc' | 'desc')
 * @param {Function} props.setSortOrder - Update sort direction
 * @param {Function} props.onViewProfile - Action trigger for student details modal
 * @param {Function} props.onEditRecord - Action trigger for student editing modal
 * @param {Function} props.onDeleteRecord - Action trigger for student deleting confirmation
 */
export default function StudentList({
  students = [],
  loading = false,
  total = 0,
  page = 1,
  setPage,
  limit = 10,
  setLimit,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  onViewProfile,
  onEditRecord,
  onDeleteRecord
}) {
  
  // Columns configuration for sortable headers
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'first_name', label: 'Name' },
    { key: 'enrollment_number', label: 'Enrollment No' },
    { key: 'course', label: 'Course / Department' },
    { key: 'gpa', label: 'GPA' }
  ];

  // Handles header sorting click
  const handleSortClick = (columnKey) => {
    if (sortBy === columnKey) {
      // Toggle order
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(columnKey);
      setSortOrder('asc');
    }
    setPage(1); // Reset page on sort change
  };

  // Render sorting icon for columns
  const renderSortIcon = (columnKey) => {
    if (sortBy !== columnKey) {
      return <ChevronsUpDown className="h-3.5 w-3.5 ml-1 text-slate-400 group-hover:text-slate-600 transition-colors" />;
    }
    return sortOrder === 'asc' 
      ? <ArrowUp className="h-3.5 w-3.5 ml-1 text-indigo-600 font-bold" />
      : <ArrowDown className="h-3.5 w-3.5 ml-1 text-indigo-600 font-bold" />;
  };

  // Determine GPA badges classes
  const getGpaBadgeClass = (gpa) => {
    const score = parseFloat(gpa);
    if (score >= 3.5) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (score >= 3.0) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (score >= 2.0) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-rose-50 text-rose-700 border-rose-200';
  };

  // Calculate pagination statistics
  const totalPages = Math.ceil(total / limit) || 1;
  const startEntry = total === 0 ? 0 : (page - 1) * limit + 1;
  const endEntry = Math.min(page * limit, total);

  // Generate pagination numeric pages list
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      
      {/* Table Data view */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {columns.map((col) => (
                <th 
                  key={col.key}
                  onClick={() => handleSortClick(col.key)}
                  className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer select-none group"
                >
                  <div className="flex items-center">
                    {col.label}
                    {renderSortIcon(col.key)}
                  </div>
                </th>
              ))}
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              // Loading Skeleton State
              Array.from({ length: limit }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="px-6 py-4.5"><div className="h-4 bg-slate-200 rounded w-8"></div></td>
                  <td className="px-6 py-4.5">
                    <div className="h-4 bg-slate-200 rounded w-28 mb-2"></div>
                    <div className="h-3 bg-slate-150 rounded w-36"></div>
                  </td>
                  <td className="px-6 py-4.5"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                  <td className="px-6 py-4.5"><div className="h-4 bg-slate-200 rounded w-32"></div></td>
                  <td className="px-6 py-4.5"><div className="h-6 bg-slate-200 rounded w-12"></div></td>
                  <td className="px-6 py-4.5 text-right"><div className="h-8 bg-slate-200 rounded w-24 ml-auto"></div></td>
                </tr>
              ))
            ) : students.length === 0 ? (
              // Empty Table State
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                    <div className="p-4 bg-slate-50 text-slate-400 rounded-full mb-3">
                      <GraduationCap className="h-10 w-10" />
                    </div>
                    <h4 className="text-slate-800 font-bold text-base mb-1">No Student Records Found</h4>
                    <p className="text-slate-500 text-sm">
                      We couldn't find any students matching your search filters. Try resetting the filters or add a new student record to get started.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              // Active Student Records
              students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/55 transition-colors group">
                  <td className="px-6 py-4 text-sm font-semibold text-slate-500">
                    #{student.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-800">
                      {student.first_name} {student.last_name}
                    </div>
                    <div className="text-xs text-slate-400 font-medium">
                      {student.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-xs font-mono font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">
                      {student.enrollment_number}
                    </code>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                    {student.course}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getGpaBadgeClass(student.gpa)}`}>
                      {parseFloat(student.gpa).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                      
                      <button
                        onClick={() => onViewProfile(student.id)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="View Profile Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => onEditRecord(student)}
                        className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Edit Record"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => onDeleteRecord(student.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Record"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages >= 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-slate-200 gap-4">
          
          {/* Entries dropdown and count info */}
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-1.5">
              <span>Show</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(parseInt(e.target.value));
                  setPage(1); // Reset page on limit size change
                }}
                className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={55}>50</option>
              </select>
              <span>entries</span>
            </div>
            <span className="hidden sm:inline border-l border-slate-200 pl-4">
              Showing <span className="font-bold text-slate-700">{startEntry}</span> to{' '}
              <span className="font-bold text-slate-700">{endEntry}</span> of{' '}
              <span className="font-bold text-slate-700">{total}</span> records
            </span>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1 || loading}
              className={`p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 active:bg-slate-100 transition-colors ${
                page === 1 ? 'opacity-40 cursor-not-allowed hover:bg-transparent' : ''
              }`}
              title="Previous Page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {getPageNumbers().map((num) => (
              <button
                key={num}
                onClick={() => setPage(num)}
                disabled={loading}
                className={`min-w-[36px] h-9 px-3 text-sm font-semibold rounded-lg transition-all ${
                  page === num
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                    : 'border border-slate-200 text-slate-600 hover:bg-slate-50 active:bg-slate-100'
                }`}
              >
                {num}
              </button>
            ))}

            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages || loading}
              className={`p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 active:bg-slate-100 transition-colors ${
                page === totalPages ? 'opacity-40 cursor-not-allowed hover:bg-transparent' : ''
              }`}
              title="Next Page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
