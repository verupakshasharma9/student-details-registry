import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

// Get a reference to the mock axios instance that was returned by create
const mockAxiosInstance = {
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
};

vi.mock('axios', () => {
  return {
    default: {
      create: vi.fn(() => mockAxiosInstance),
    },
  };
});

// Import the service after mocking axios
import { getStudents, getStudent, createStudent, updateStudent, deleteStudent } from '../api';

describe('API Service Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getStudents', () => {
    it('should map page and limit to skip and limit params and call get', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({ data: { items: [], total: 0 } });

      const result = await getStudents({ page: 3, limit: 15 });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/students', {
        params: {
          skip: 30,
          limit: 15,
          sort_by: 'id',
          sort_order: 'asc',
        },
      });
      expect(result).toEqual({ items: [], total: 0 });
    });

    it('should prune empty and default filter fields', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({ data: { items: [] } });

      await getStudents({
        page: 1,
        limit: 10,
        search: '  ', // empty search
        course: 'All Courses', // default course filter to ignore
        min_gpa: '', // empty gpa
        max_gpa: null, // null gpa
      });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/students', {
        params: {
          skip: 0,
          limit: 10,
          sort_by: 'id',
          sort_order: 'asc',
        },
      });
    });

    it('should include non-empty filter fields and convert GPAs to float', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({ data: { items: [] } });

      await getStudents({
        page: 2,
        limit: 5,
        search: 'Alice',
        course: 'Computer Science',
        min_gpa: '3.2',
        max_gpa: 4.0,
      });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/students', {
        params: {
          skip: 5,
          limit: 5,
          search: 'Alice',
          course: 'Computer Science',
          min_gpa: 3.2,
          max_gpa: 4.0,
          sort_by: 'id',
          sort_order: 'asc',
        },
      });
    });
  });

  describe('CRUD operations', () => {
    it('should fetch a single student by id', async () => {
      const mockStudent = { id: 123, first_name: 'John' };
      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockStudent });

      const result = await getStudent(123);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/students/123');
      expect(result).toEqual(mockStudent);
    });

    it('should create a student record with post request', async () => {
      const newStudentData = { first_name: 'Jane', email: 'jane@university.edu' };
      const createdStudent = { id: 1, ...newStudentData };
      mockAxiosInstance.post.mockResolvedValueOnce({ data: createdStudent });

      const result = await createStudent(newStudentData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/students', newStudentData);
      expect(result).toEqual(createdStudent);
    });

    it('should update a student record with patch request', async () => {
      const updateData = { gpa: 3.9 };
      const updatedStudent = { id: 1, first_name: 'Jane', gpa: 3.9 };
      mockAxiosInstance.patch.mockResolvedValueOnce({ data: updatedStudent });

      const result = await updateStudent(1, updateData);

      expect(mockAxiosInstance.patch).toHaveBeenCalledWith('/students/1', updateData);
      expect(result).toEqual(updatedStudent);
    });

    it('should delete a student record by id', async () => {
      mockAxiosInstance.delete.mockResolvedValueOnce({ data: { success: true } });

      const result = await deleteStudent(1);

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/students/1');
      expect(result).toEqual({ success: true });
    });
  });
});
