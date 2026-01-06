import axiosInstance from '../axiosCustomize';

// Interfaces matching backend entities
export interface ToaThuoc {
  MaToaThuoc: string;
  MaBN: string;
  MaNV: string;
  NgayKe: string;
  TrangThai: 'Pending' | 'Payed' | 'Done';
}

export interface ToaThuocDetail extends ToaThuoc {
  BenhNhan?: {
    MaBN: string;
    HoTen: string;
    NgaySinh: string;
    GioiTinh: string;
    SoDienThoai: string;
    DiaChi: string;
    CCCD: string;
  };
  ChiTietToaThuoc?: ChiTietToaThuocDetail[];
}

export interface ChiTietToaThuocDetail {
  MaThuoc: string;
  MaToaThuoc: string;
  SoLuong: number;
  LieuLuong: string;
  DonGia: number;
  Thuoc?: {
    MaThuoc: string;
    TenThuoc: string;
    DonVi: string;
    GiaBan: number;
  };
}

export interface CreateUpdateToaThuocDto {
  MaBN: string;
  NgayKe: string;
  TrangThai: 'Pending' | 'Payed' | 'Done';
}

// API Response wrapper
interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}

// API functions for prescriptions
export const toathuocAPI = {
  // Get all prescriptions
  getAllToaThuoc: async (): Promise<ToaThuoc[]> => {
    try {
      const response = await axiosInstance.get('/api/v1/toathuoc');
      console.log("Raw API response:", response);
      return (response as unknown as ApiResponse<ToaThuoc[]>).data;
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      throw error;
    }
  },

  // Get prescription by ID with details
  getToaThuocById: async (maToaThuoc: string): Promise<ToaThuocDetail> => {
    try {
      const response = await axiosInstance.get(`/api/v1/toathuoc/${maToaThuoc}`);
      console.log("Raw API response:", response);
      return (response as unknown as ApiResponse<ToaThuocDetail>).data;
    } catch (error) {
      console.error('Error fetching prescription details:', error);
      throw error;
    }
  },

  // Create new prescription
  createToaThuoc: async (data: CreateUpdateToaThuocDto): Promise<ToaThuoc> => {
    try {
      const response = await axiosInstance.post('/api/v1/toathuoc', data);
      console.log("Raw API response:", response);
      return (response as unknown as ApiResponse<ToaThuoc>).data;
    } catch (error) {
      console.error('Error creating prescription:', error);
      throw error;
    }
  },

  // Update prescription
  updateToaThuoc: async (maToaThuoc: string, data: CreateUpdateToaThuocDto): Promise<ToaThuoc> => {
    try {
      const response = await axiosInstance.put(`/api/v1/toathuoc/${maToaThuoc}`, data);
      console.log("Raw API response:", response);
      return (response as unknown as ApiResponse<ToaThuoc>).data;
    } catch (error) {
      console.error('Error updating prescription:', error);
      throw error;
    }
  },

  // Delete prescription
  deleteToaThuoc: async (maToaThuoc: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/api/v1/toathuoc/${maToaThuoc}`);
      console.log("Prescription deleted successfully");
    } catch (error) {
      console.error('Error deleting prescription:', error);
      throw error;
    }
  }
};
