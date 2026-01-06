import axiosInstance from '../axiosCustomize';

export interface Thuoc {
  MaThuoc: string;
  TenThuoc: string;
  BHYT: boolean;
  Gia: string;
  DonViTinh: string;
  DonViDongGoi: string;
  DangBaoChe: string;
  HanSuDung: string;
  SoLuongTon: number;
}

export const thuocAPI = {
  // Get all medicines
  getAll: async (): Promise<any> => {
    try {
      const response = await axiosInstance.get('/api/v1/thuoc');
      return response;
    } catch (error) {
      console.error('Error fetching medicines:', error);
      throw error;
    }
  },

  // Get medicine by ID
  getById: async (id: string): Promise<any> => {
    try {
      const response = await axiosInstance.get(`/api/v1/thuoc/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching medicine by id:', error);
      throw error;
    }
  },

  // Create medicine
  create: async (data: any): Promise<any> => {
    try {
      const response = await axiosInstance.post('/api/v1/thuoc', data);
      return response;
    } catch (error) {
      console.error('Error creating medicine:', error);
      throw error;
    }
  },

  // Update medicine
  update: async (id: string, data: any): Promise<any> => {
    try {
      const response = await axiosInstance.put(`/api/v1/thuoc/${id}`, data);
      return response;
    } catch (error) {
      console.error('Error updating medicine:', error);
      throw error;
    }
  },

  // Delete medicine
  delete: async (id: string): Promise<any> => {
    try {
      const response = await axiosInstance.delete(`/api/v1/thuoc/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting medicine:', error);
      throw error;
    }
  }
};
