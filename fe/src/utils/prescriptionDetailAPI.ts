import axiosInstance from './axiosCustomize.tsx';

export interface ChiTietToaThuoc {
  MaToaThuoc: string;
  MaThuoc: string;
  SoLuong: number;
  DonGia: number;
  LieuLuong: string;
  ThanhTien?: number;
}

export interface CreatePrescriptionDetailData {
  MaToaThuoc: string;
  MaThuoc: string;
  SoLuong: number;
  DonGia: number;
  LieuLuong: string;
}

export const prescriptionDetailAPI = {
  // Get all prescription details for a prescription
  getByPrescriptionId: async (prescriptionId: string): Promise<ChiTietToaThuoc[]> => {
    try {
      const response = await axiosInstance.get(`/api/v1/chitiettoathuoc/prescription/${prescriptionId}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching prescription details:', error);
      throw error;
    }
  },

  // Create new prescription detail
  create: async (data: CreatePrescriptionDetailData): Promise<ChiTietToaThuoc> => {
    try {
      const response = await axiosInstance.post('/api/v1/chitiettoathuoc', data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error creating prescription detail:', error);
      throw error;
    }
  },

  // Update prescription detail
  update: async (medicineId: string, prescriptionId: string, data: Partial<CreatePrescriptionDetailData>): Promise<ChiTietToaThuoc> => {
    try {
      const response = await axiosInstance.put(`/api/v1/chitiettoathuoc/${medicineId}/${prescriptionId}`, data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error updating prescription detail:', error);
      throw error;
    }
  },

  // Delete prescription detail
  delete: async (medicineId: string, prescriptionId: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/api/v1/chitiettoathuoc/${medicineId}/${prescriptionId}`);
    } catch (error) {
      console.error('Error deleting prescription detail:', error);
      throw error;
    }
  },

  // Delete all details for a prescription
  deleteByPrescriptionId: async (prescriptionId: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/api/v1/chitiettoathuoc/prescription/${prescriptionId}`);
    } catch (error) {
      console.error('Error deleting prescription details:', error);
      throw error;
    }
  }
};
