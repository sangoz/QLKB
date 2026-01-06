import axiosInstance from './axiosCustomize.tsx';

export interface CreatePrescriptionData {
  MaBN: string;
  MaNV: string;
  NgayKeToa: string;
  TrangThai: string;
  GhiChu?: string;
}

export interface ToaThuoc {
  MaToaThuoc: string;
  MaBN: string;
  NgayKe: string;
  TrangThai: 'Pending' | 'Done' | 'Cancel';
  // Optional computed fields
  MaNV?: string;
  NgayKeToa?: string;
  TongTien?: number;
  GhiChu?: string;
}

export const prescriptionAPI = {
  // Get all prescriptions
  getAll: async (): Promise<any> => {
    try {
      const response = await axiosInstance.get('/api/v1/toathuoc');
      return response.data; // Return full response including data array
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      throw error;
    }
  },

  // Create new prescription
  create: async (data: CreatePrescriptionData): Promise<ToaThuoc> => {
    try {
      const response = await axiosInstance.post('/api/v1/toathuoc', data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error creating prescription:', error);
      throw error;
    }
  },

  // Update prescription
  update: async (id: string, data: Partial<CreatePrescriptionData>): Promise<ToaThuoc> => {
    try {
      const response = await axiosInstance.put(`/api/v1/toathuoc/${id}`, data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error updating prescription:', error);
      throw error;
    }
  },

  // Delete prescription
  delete: async (id: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/api/v1/toathuoc/${id}`);
    } catch (error) {
      console.error('Error deleting prescription:', error);
      throw error;
    }
  },

  // Get prescription by ID
  getById: async (id: string): Promise<ToaThuoc> => {
    try {
      const response = await axiosInstance.get(`/api/v1/toathuoc/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching prescription by id:', error);
      throw error;
    }
  }
};
