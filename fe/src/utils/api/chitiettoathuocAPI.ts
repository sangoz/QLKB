import axiosInstance from '../axiosCustomize';

export interface ChiTietToaThuoc {
  MaThuoc: string;
  MaToaThuoc: string;
  SoLuong: number;
  LieuLuong: string;
  DonGia: number;
}

export interface CreateChiTietToaThuocData {
  MaThuoc: string;
  MaToaThuoc: string;
  SoLuong: number;
  LieuLuong: string;
  DonGia: number;
}

export const chitiettoathuocAPI = {
  // Get all details by prescription ID
  getByToaThuoc: async (maToaThuoc: string): Promise<any> => {
    try {
      const response = await axiosInstance.get(`/api/v1/chitiettoathuoc/toathuoc/${maToaThuoc}`);
      return response;
    } catch (error) {
      console.error('Error fetching prescription details:', error);
      throw error;
    }
  },

  // Get detail by medicine and prescription ID
  getById: async (maThuoc: string, maToaThuoc: string): Promise<any> => {
    try {
      const response = await axiosInstance.get(`/api/v1/chitiettoathuoc/${maThuoc}/${maToaThuoc}`);
      return response;
    } catch (error) {
      console.error('Error fetching prescription detail:', error);
      throw error;
    }
  },

  // Create prescription detail
  create: async (data: CreateChiTietToaThuocData): Promise<any> => {
    try {
      const response = await axiosInstance.post('/api/v1/chitiettoathuoc', data);
      return response;
    } catch (error) {
      console.error('Error creating prescription detail:', error);
      throw error;
    }
  },

  // Update prescription detail
  update: async (maThuoc: string, maToaThuoc: string, data: CreateChiTietToaThuocData): Promise<any> => {
    try {
      const response = await axiosInstance.put(`/api/v1/chitiettoathuoc/${maThuoc}/${maToaThuoc}`, data);
      return response;
    } catch (error) {
      console.error('Error updating prescription detail:', error);
      throw error;
    }
  },

  // Delete prescription detail
  delete: async (maThuoc: string, maToaThuoc: string): Promise<any> => {
    try {
      const response = await axiosInstance.delete(`/api/v1/chitiettoathuoc/${maThuoc}/${maToaThuoc}`);
      return response;
    } catch (error) {
      console.error('Error deleting prescription detail:', error);
      throw error;
    }
  }
};
