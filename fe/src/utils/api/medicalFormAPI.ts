import axiosInstance from '../axiosCustomize';

// Interface cho API Response
interface ApiResponse<T = any> {
  statusCode: number;
  message: string;
  data: T;
  author?: string;
}

// Interface for PhieuYeuCau from API
export interface PhieuYeuCau {
  MaPYC: string;
  NgayYeuCau: string;
  DonGia: string;
  Loai: 'NhapVien' | 'XuatVien' | 'DichVu' | 'KhamBenh';
  MaNV: string;
  MaBN: string;
  MaDichVu?: string;
  TrangThai: 'Pending' | 'Payed' | 'Done';
}

// Interface for detailed PhieuYeuCau with related data
export interface PhieuYeuCauDetail extends PhieuYeuCau {
  BenhNhan?: {
    MaBN: string;
    HoTen: string;
    NgaySinh: string;
    GioiTinh: string;
    DiaChi: string;
    SoDienThoai: string;
    Email?: string;
    CCCD: string;
  };
  NhanVien?: {
    MaNV: string;
    HoTen: string;
    ChucVu: string;
  };
  DichVu?: {
    MaDichVu: string;
    TenDichVu: string;
    DonGia: string;
  };
}

// DTO for create/update
export interface CreateUpdatePhieuDto {
  NgayYeuCau: string;
  DonGia: string;
  Loai: 'NhapVien' | 'XuatVien' | 'DichVu' | 'KhamBenh';
  MaBN: string;
  MaDichVu?: string;
  TrangThai: 'Pending' | 'Payed' | 'Done';
}

// API functions for medical forms
export const medicalFormAPI = {
  // Get all medical forms
  getAllPhieu: async (): Promise<PhieuYeuCau[]> => {
    try {
      const response = await axiosInstance.get('/api/v1/phieu');
      console.log("Raw API response:", response);
      return (response as unknown as ApiResponse<PhieuYeuCau[]>).data;
    } catch (error) {
      console.error('Error fetching medical forms:', error);
      throw error;
    }
  },

  // Get medical form by ID
  getPhieuById: async (maPYC: string): Promise<PhieuYeuCauDetail> => {
    try {
      const response = await axiosInstance.get(`/api/v1/phieu/details/${maPYC}`);
      return (response as unknown as ApiResponse<PhieuYeuCauDetail>).data;
    } catch (error) {
      console.error('Error fetching medical form:', error);
      throw error;
    }
  },

  // Get medical forms by patient ID
  getPhieuByMaBN: async (maBN: string, loai?: string): Promise<PhieuYeuCau[]> => {
    try {
      const url = loai 
        ? `/api/v1/phieu/benhnhan/${maBN}?Loai=${loai}`
        : `/api/v1/phieu/benhnhan/${maBN}`;
      const response = await axiosInstance.get(url);
      return (response as unknown as ApiResponse<PhieuYeuCau[]>).data;
    } catch (error) {
      console.error('Error fetching medical forms by patient:', error);
      throw error;
    }
  },

  // Create new medical form
  createPhieu: async (data: CreateUpdatePhieuDto): Promise<PhieuYeuCau> => {
    try {
      console.log("Creating medical form:", data);
      const response = await axiosInstance.post('/api/v1/phieu', data);
      console.log("Create response:", response);
      return (response as unknown as ApiResponse<PhieuYeuCau>).data;
    } catch (error) {
      console.error('Error creating medical form:', error);
      throw error;
    }
  },

  // Update medical form
  updatePhieu: async (maPYC: string, data: CreateUpdatePhieuDto): Promise<PhieuYeuCau> => {
    try {
      console.log("Updating medical form:", maPYC, data);
      const response = await axiosInstance.put(`/api/v1/phieu/${maPYC}`, data);
      console.log("Update response:", response);
      return (response as unknown as ApiResponse<PhieuYeuCau>).data;
    } catch (error) {
      console.error('Error updating medical form:', error);
      throw error;
    }
  },

  // Delete medical form
  deletePhieu: async (maPYC: string): Promise<void> => {
    try {
      console.log("Deleting medical form:", maPYC);
      const response = await axiosInstance.delete(`/api/v1/phieu/${maPYC}`);
      console.log("Delete response:", response);
    } catch (error) {
      console.error('Error deleting medical form:', error);
      throw error;
    }
  },

  // Download PDF for medical form
  downloadPhieuPdf: async (maPYC: string): Promise<Blob> => {
    try {
      const response = await axiosInstance.get(`/api/v1/phieu/${maPYC}/download-pdf`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error downloading medical form PDF:', error);
      throw error;
    }
  }
};
