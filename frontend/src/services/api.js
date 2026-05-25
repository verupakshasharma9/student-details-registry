import axios from 'axios';

// Axios instance configured with Vite proxy baseURL
const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetch paginated, filtered, and sorted students list.
 * Calculates `skip` from `(page - 1) * limit`.
 * 
 * @param {Object} params - Query filters and pagination
 * @param {number} params.page - Current active page (1-indexed)
 * @param {number} params.limit - Page size limit
 * @param {string} [params.search] - Search text for name/email/enrollment
 * @param {string} [params.course] - Filter by Course Department
 * @param {number|string} [params.min_gpa] - Minimum GPA filter
 * @param {number|string} [params.max_gpa] - Maximum GPA filter
 * @param {string} [params.sort_by] - Field to sort by
 * @param {string} [params.sort_order] - Sort direction ('asc' or 'desc')
 */
export const getStudents = async ({
  page = 1,
  limit = 10,
  search = '',
  course = '',
  min_gpa = '',
  max_gpa = '',
  sort_by = 'id',
  sort_order = 'asc',
}) => {
  const skip = (page - 1) * limit;

  // Build clean parameters object - ignore empty filters
  const params = {
    skip,
    limit,
    sort_by,
    sort_order,
  };

  if (search.trim()) params.search = search.trim();
  if (course && course !== 'All Courses') params.course = course;
  if (min_gpa !== '' && min_gpa !== null && min_gpa !== undefined) params.min_gpa = parseFloat(min_gpa);
  if (max_gpa !== '' && max_gpa !== null && max_gpa !== undefined) params.max_gpa = parseFloat(max_gpa);

  const response = await api.get('/students', { params });
  return response.data;
};

/**
 * Fetch a single student record by their ID.
 * @param {number|string} id 
 */
export const getStudent = async (id) => {
  const response = await api.get(`/students/${id}`);
  return response.data;
};

/**
 * Create a new student record.
 * @param {Object} data 
 */
export const createStudent = async (data) => {
  const response = await api.post('/students', data);
  return response.data;
};

/**
 * Update an existing student record (uses PATCH for partial/full updates).
 * @param {number|string} id 
 * @param {Object} data 
 */
export const updateStudent = async (id, data) => {
  const response = await api.patch(`/students/${id}`, data);
  return response.data;
};

/**
 * Delete a student record by ID.
 * @param {number|string} id 
 */
export const deleteStudent = async (id) => {
  const response = await api.delete(`/students/${id}`);
  return response.data;
};

export default api;
