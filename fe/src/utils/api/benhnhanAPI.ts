import axiosInstance from '../axiosCustomize.tsx';

export interface BenhNhan {
  MaBN: string;
  HoTen: string;
  CCCD: string;
  SDT: string;
  DiaChi: string;
  MaPhongBenhId?: string;
}

export interface CreateBenhNhanData {
  HoTen: string;
  NgaySinh: string;
  GioiTinh: string;
  SoDienThoai: string;
  DiaChi: string;
  Email?: string;
}

export const benhnhanAPI = {
  // Get all patients
  getAll: async (): Promise<any> => {
    try {
      const response = await axiosInstance.get('/api/v1/benhnhan');
      return response; // Return full response structure
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw error;
    }
  },

  // Get patient by ID
  getById: async (id: string): Promise<BenhNhan> => {
    try {
      const response = await axiosInstance.get(`/api/v1/benhnhan/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching patient by id:', error);
      throw error;
    }
  },

  // Create new patient
  create: async (data: CreateBenhNhanData): Promise<BenhNhan> => {
    try {
      const response = await axiosInstance.post('/api/v1/benhnhan', data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error creating patient:', error);
      throw error;
    }
  }
};
