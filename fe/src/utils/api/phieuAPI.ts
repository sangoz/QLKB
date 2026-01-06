import axiosInstance from '../axiosCustomize';

// Interface cho API Response
interface ApiResponse<T = any> {
  statusCode: number;
  message: string;
  data: T;
  author?: string;
}

// Interface for Phieu from API
export interface Phieu {
  MaPYC: string;
  NgayYeuCau: string;
  DonGia: string;
  Loai: 'NhapVien' | 'XuatVien' | 'DichVu' | 'KhamBenh';
  MaNV: string;
  MaBN: string;
  MaDichVu?: string;
  TrangThai: 'Pending' | 'Payed' | 'Done';
}

// Interface for BenhNhan from API
export interface BenhNhan {
  MaBN: string;
  HoTen: string;
  NgaySinh: string;
  GioiTinh: string;
  DiaChi: string;
  SoDienThoai: string;
  Email?: string;
  CCCD: string;
}

// API functions for phieu (medical forms)
export const phieuAPI = {
  // Get all phieu
  getAllPhieu: async (): Promise<Phieu[]> => {
    try {
      const response = await axiosInstance.get('/api/v1/phieu');
      console.log("Raw API response:", response);
      return (response as unknown as ApiResponse<Phieu[]>).data;
    } catch (error) {
      console.error('Error fetching phieu:', error);
      throw error;
    }
  },

  // Get phieu by ID
  getPhieuById: async (maPYC: string): Promise<Phieu> => {
    try {
      const response = await axiosInstance.get(`/api/v1/phieu/${maPYC}`);
      return (response as unknown as ApiResponse<Phieu>).data;
    } catch (error) {
      console.error('Error fetching phieu:', error);
      throw error;
    }
  },

  // Get phieu by patient ID
  getPhieuByMaBN: async (maBN: string, loai?: string): Promise<Phieu[]> => {
    try {
      const url = loai 
        ? `/api/v1/phieu/benhnhan/${maBN}?Loai=${loai}`
        : `/api/v1/phieu/benhnhan/${maBN}`;
      const response = await axiosInstance.get(url);
      return (response as unknown as ApiResponse<Phieu[]>).data;
    } catch (error) {
      console.error('Error fetching phieu by patient:', error);
      throw error;
    }
  }
};
