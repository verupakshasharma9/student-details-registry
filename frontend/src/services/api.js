import axios from 'axios';

// Detect if we should run in mock/localStorage mode (e.g. deployed on GitHub Pages)
const isMockMode = typeof window !== 'undefined' && 
  (window.location.hostname.includes('github.io') || window.location.hostname.includes('localhost') && !window.location.port);

// Axios instance configured with Vite proxy baseURL
const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==============================================================================
// LocalStorage Mock Implementation for serverless/GitHub Pages execution
// ==============================================================================
const SEED_STUDENTS = [
  {
    id: 1,
    first_name: "Aisha",
    last_name: "Aminu",
    email: "aisha.aminu@university.edu",
    date_of_birth: "2004-03-12",
    enrollment_number: "CS-2022-0041",
    course: "Computer Science",
    gpa: 3.85,
    created_at: "2026-05-25T12:00:00Z",
    updated_at: "2026-05-25T12:00:00Z"
  },
  {
    id: 2,
    first_name: "Benjamin",
    last_name: "Chen",
    email: "ben.chen@university.edu",
    date_of_birth: "2003-08-24",
    enrollment_number: "EE-2021-0812",
    course: "Electrical Engineering",
    gpa: 3.92,
    created_at: "2026-05-25T12:05:00Z",
    updated_at: "2026-05-25T12:05:00Z"
  },
  {
    id: 3,
    first_name: "Carlos",
    last_name: "Mendoza",
    email: "carlos.m@university.edu",
    date_of_birth: "2005-01-15",
    enrollment_number: "ME-2023-0105",
    course: "Mechanical Engineering",
    gpa: 2.78,
    created_at: "2026-05-25T12:10:00Z",
    updated_at: "2026-05-25T12:10:00Z"
  },
  {
    id: 4,
    first_name: "Diana",
    last_name: "Prince",
    email: "diana.p@university.edu",
    date_of_birth: "2002-11-30",
    enrollment_number: "CS-2020-0010",
    course: "Computer Science",
    gpa: 4.00,
    created_at: "2026-05-25T12:15:00Z",
    updated_at: "2026-05-25T12:15:00Z"
  },
  {
    id: 5,
    first_name: "Elena",
    last_name: "Rostova",
    email: "elena.r@university.edu",
    date_of_birth: "2004-06-05",
    enrollment_number: "BA-2022-0315",
    course: "Business Administration",
    gpa: 3.45,
    created_at: "2026-05-25T12:20:00Z",
    updated_at: "2026-05-25T12:20:00Z"
  }
];

const getLocalStorageStudents = () => {
  const data = localStorage.getItem('student_registry_records');
  if (!data) {
    localStorage.setItem('student_registry_records', JSON.stringify(SEED_STUDENTS));
    return SEED_STUDENTS;
  }
  return JSON.parse(data);
};

const saveLocalStorageStudents = (students) => {
  localStorage.setItem('student_registry_records', JSON.stringify(students));
};

/**
 * Fetch paginated, filtered, and sorted students list.
 * Calculates `skip` from `(page - 1) * limit`.
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
  if (isMockMode) {
    let students = getLocalStorageStudents();

    // 1. Search filter
    if (search.trim()) {
      const s = search.toLowerCase().trim();
      students = students.filter(student => 
        student.first_name.toLowerCase().includes(s) ||
        student.last_name.toLowerCase().includes(s) ||
        student.email.toLowerCase().includes(s) ||
        student.enrollment_number.toLowerCase().includes(s)
      );
    }

    // 2. Course filter
    if (course && course !== 'All Courses') {
      students = students.filter(student => student.course === course);
    }

    // 3. GPA bounds
    if (min_gpa !== '' && min_gpa !== null && min_gpa !== undefined) {
      students = students.filter(student => student.gpa >= parseFloat(min_gpa));
    }
    if (max_gpa !== '' && max_gpa !== null && max_gpa !== undefined) {
      students = students.filter(student => student.gpa <= parseFloat(max_gpa));
    }

    // 4. Sorting
    students.sort((a, b) => {
      let valA = a[sort_by];
      let valB = b[sort_by];

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return sort_order === 'asc' ? -1 : 1;
      if (valA > valB) return sort_order === 'asc' ? 1 : -1;
      return 0;
    });

    // 5. Pagination
    const total = students.length;
    const skip = (page - 1) * limit;
    const paginatedItems = students.slice(skip, skip + limit);

    return {
      items: paginatedItems,
      total,
      page,
      size: limit
    };
  }

  // Normal API Call
  const skip = (page - 1) * limit;
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
 */
export const getStudent = async (id) => {
  if (isMockMode) {
    const students = getLocalStorageStudents();
    const student = students.find(s => String(s.id) === String(id));
    if (!student) {
      throw new Error("Student not found");
    }
    return student;
  }

  const response = await api.get(`/students/${id}`);
  return response.data;
};

/**
 * Create a new student record.
 */
export const createStudent = async (data) => {
  if (isMockMode) {
    const students = getLocalStorageStudents();
    
    // Unique checks
    if (students.some(s => s.email.toLowerCase() === data.email.toLowerCase())) {
      const err = new Error("Email already registered");
      err.response = { status: 409, data: { detail: "Email already registered" } };
      throw err;
    }
    if (students.some(s => s.enrollment_number.toLowerCase() === data.enrollment_number.toLowerCase())) {
      const err = new Error("Enrollment number already registered");
      err.response = { status: 409, data: { detail: "Enrollment number already registered" } };
      throw err;
    }

    const newStudent = {
      ...data,
      id: students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    students.push(newStudent);
    saveLocalStorageStudents(students);
    return newStudent;
  }

  const response = await api.post('/students', data);
  return response.data;
};

/**
 * Update an existing student record (uses PATCH/PATCH for updates).
 */
export const updateStudent = async (id, data) => {
  if (isMockMode) {
    const students = getLocalStorageStudents();
    const index = students.findIndex(s => String(s.id) === String(id));
    if (index === -1) {
      throw new Error("Student not found");
    }

    // Unique checks for email and enrollment number
    if (data.email && students.some(s => String(s.id) !== String(id) && s.email.toLowerCase() === data.email.toLowerCase())) {
      const err = new Error("Email already registered");
      err.response = { status: 409, data: { detail: "Email already registered" } };
      throw err;
    }
    if (data.enrollment_number && students.some(s => String(s.id) !== String(id) && s.enrollment_number.toLowerCase() === data.enrollment_number.toLowerCase())) {
      const err = new Error("Enrollment number already registered");
      err.response = { status: 409, data: { detail: "Enrollment number already registered" } };
      throw err;
    }

    const updatedStudent = {
      ...students[index],
      ...data,
      updated_at: new Date().toISOString()
    };

    students[index] = updatedStudent;
    saveLocalStorageStudents(students);
    return updatedStudent;
  }

  const response = await api.patch(`/students/${id}`, data);
  return response.data;
};

/**
 * Delete a student record by ID.
 */
export const deleteStudent = async (id) => {
  if (isMockMode) {
    let students = getLocalStorageStudents();
    const originalLength = students.length;
    students = students.filter(s => String(s.id) !== String(id));
    
    if (students.length === originalLength) {
      throw new Error("Student not found");
    }

    saveLocalStorageStudents(students);
    return { detail: "Student deleted successfully" };
  }

  const response = await api.delete(`/students/${id}`);
  return response.data;
};

export default api;
