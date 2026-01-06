import axiosInstance from '../axiosCustomize';

const BASE_URL = '/api/v1/dichvu';

// Interface matching backend entity
export interface DichVu {
  MaDichVu: string;
  TenDichVu: string;
  GiaDichVu: number;
}

// API response format
interface APIResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  author: string;
}

export const serviceAPI = {
  // Get all services
  getAll: async (): Promise<DichVu[]> => {
    try {
      const response = await axiosInstance.get<APIResponse<DichVu[]>>(BASE_URL);
      console.log('API Response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  },

  // Create new service
  create: async (serviceData: Omit<DichVu, 'MaDichVu'>): Promise<DichVu> => {
    try {
      // Ensure GiaDichVu is sent as string to match backend expectation
      const payload = {
        TenDichVu: serviceData.TenDichVu,
        GiaDichVu: serviceData.GiaDichVu.toString()
      };
      console.log('Sending create request with payload:', payload);
      const response = await axiosInstance.post<APIResponse<DichVu>>(BASE_URL, payload);
      console.log('Create service response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  },

  // Update service
  update: async (id: string, serviceData: Omit<DichVu, 'MaDichVu'>): Promise<DichVu> => {
    try {
      // Ensure GiaDichVu is sent as string to match backend expectation
      const payload = {
        TenDichVu: serviceData.TenDichVu,
        GiaDichVu: serviceData.GiaDichVu.toString()
      };
      console.log('Sending update request with payload:', payload);
      const response = await axiosInstance.put<APIResponse<DichVu>>(`${BASE_URL}/${id}`, payload);
      console.log('Update service response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error updating service:', error);
      throw error;
    }
  },

  // Delete service
  delete: async (id: string): Promise<void> => {
    try {
      const response = await axiosInstance.delete<APIResponse<null>>(`${BASE_URL}/${id}`);
      console.log('Delete service response:', response.data);
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  }
};
