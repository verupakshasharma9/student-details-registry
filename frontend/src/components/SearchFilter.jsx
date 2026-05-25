import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const COMMON_DEPARTMENTS = [
  'All Courses',
  'Computer Science',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Information Technology',
  'Physics',
  'Mathematics'
];

/**
 * Filter and Search toolbar.
 * 
 * @param {Object} props
 * @param {string} props.search - Current search text
 * @param {Function} props.setSearch - Update search text
 * @param {string} props.course - Current course filter
 * @param {Function} props.setCourse - Update course filter
 * @param {string|number} props.minGpa - Current minimum GPA filter
 * @param {Function} props.setMinGpa - Update minimum GPA filter
 * @param {string|number} props.maxGpa - Current maximum GPA filter
 * @param {Function} props.setMaxGpa - Update maximum GPA filter
 * @param {string} props.sortBy - Field to sort by
 * @param {Function} props.setSortBy - Update sort field
 * @param {string} props.sortOrder - 'asc' | 'desc'
 * @param {Function} props.setSortOrder - Update sort direction
 * @param {Function} props.onReset - Trigger resetting all filters to baseline state
 */
export default function SearchFilter({
  search,
  setSearch,
  course,
  setCourse,
  minGpa,
  setMinGpa,
  maxGpa,
  setMaxGpa,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  onReset
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <SlidersHorizontal className="h-4.5 w-4.5 text-slate-500" />
        <h3 className="text-sm font-semibold text-slate-700">Filters & Search Controls</h3>
      </div>

      {/* Grid for filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Search Input */}
        <div className="relative">
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
            Search Students
          </label>
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Name, email, enrollment..."
              className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800 transition-all duration-150"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2 top-2.5 p-0.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Course / Department Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
            Course Department
          </label>
          <select
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800 transition-all duration-150"
          >
            {COMMON_DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* GPA Range Filter */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
            GPA Range
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="number"
                min="0.0"
                max="4.0"
                step="0.1"
                placeholder="Min 0.0"
                value={minGpa}
                onChange={(e) => setMinGpa(e.target.value)}
                className="w-full px-2.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800 transition-all duration-150"
              />
            </div>
            <span className="text-slate-400 text-xs font-medium">to</span>
            <div className="relative flex-1">
              <input
                type="number"
                min="0.0"
                max="4.0"
                step="0.1"
                placeholder="Max 4.0"
                value={maxGpa}
                onChange={(e) => setMaxGpa(e.target.value)}
                className="w-full px-2.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800 transition-all duration-150"
              />
            </div>
          </div>
        </div>

        {/* Sorting controls */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
            Sort Configuration
          </label>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800 transition-all duration-150"
            >
              <option value="id">ID</option>
              <option value="first_name">First Name</option>
              <option value="last_name">Last Name</option>
              <option value="gpa">GPA Score</option>
              <option value="enrollment_number">Enrollment No.</option>
              <option value="course">Course Dept.</option>
              <option value="date_of_birth">Age / DOB</option>
              <option value="created_at">Date Created</option>
            </select>
            
            <button
              type="button"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 border border-slate-200 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 hover:text-slate-800 active:bg-slate-200 transition-colors flex items-center justify-center"
              title={sortOrder === 'asc' ? 'Sort Ascending' : 'Sort Descending'}
            >
              <ArrowUpDown className={`h-4 w-4 transform transition-transform duration-200 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Reset Button container */}
      <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 active:bg-slate-200 rounded-lg transition-all duration-150"
        >
          <X className="h-3.5 w-3.5" />
          Reset All Filters
        </button>
      </div>
    </div>
  );
}
