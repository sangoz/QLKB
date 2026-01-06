import axiosInstance from '../axiosCustomize.tsx';

export interface NhanVien {
  MaNV: string;
  HoTen: string;
  NgaySinh: Date;
  GioiTinh: string;
  SoDienThoai: string;
  DiaChi: string;
  Email: string;
  MaKhoa: string;
  ChucVu: string;
  ChuyenMon?: string;
}

export const nhanvienAPI = {
  // Get all employees
  getAll: async (): Promise<any> => {
    try {
      const response = await axiosInstance.get('/api/v1/nhanvien/list');
      return response.data; // Return full response structure
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  },

  // Get employee by ID
  getById: async (id: string): Promise<NhanVien> => {
    try {
      const response = await axiosInstance.get(`/api/v1/nhanvien/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching employee by id:', error);
      throw error;
    }
  },

  // Get doctors only
  getDoctors: async (): Promise<any> => {
    try {
      const response = await axiosInstance.get('/api/v1/nhanvien/bacsi');
      return response.data; // Return full response structure
    } catch (error) {
      console.error('Error fetching doctors:', error);
      throw error;
    }
  }
};
