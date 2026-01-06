import axiosInstance from '../axiosCustomize.tsx';

// Medicine enums matching backend
export enum DonViTinh {
  VIEN = 'VIEN',
  ONG = 'ONG',
  CHAI = 'CHAI',
  LO = 'LO',
  TUYP = 'TUYP',
  ML = 'ML',
  G = 'G',
  MCG = 'MCG',
  VY = 'VY'
}

export enum DonViDongGoi {
  HOP = 'HOP',
  HOP_VI = 'HOP_VI',
  HOP_ONG = 'HOP_ONG',
  THUNG = 'THUNG',
  CHAI_LO = 'CHAI_LO',
  GOI = 'GOI'
}

export enum DangBaoChe {
  VIEN_NEN = 'VIEN_NEN',
  VIEN_NANG = 'VIEN_NANG',
  DUNG_DICH = 'DUNG_DICH',
  BOT_PHA_TIEM = 'BOT_PHA_TIEM',
  THUOC_TIEU_KHONG = 'THUOC_TIEU_KHONG',
  DICH_TRUYEN = 'DICH_TRUYEN',
  SIRUP = 'SIRUP',
  DUNG_DICH_SAT_TRUNG = 'DUNG_DICH_SAT_TRUNG',
  THUOC_BOI = 'THUOC_BOI',
  XI_DANG = 'XI_DANG',
  VIEN_NGAM = 'VIEN_NGAM'
}

export interface Medicine {
  MaThuoc: string;
  TenThuoc: string;
  BHYT: boolean;
  Gia: string;
  DonViTinh: DonViTinh;
  DonViDongGoi: DonViDongGoi;
  DangBaoChe: DangBaoChe;
  HamLuong: string;
  SoLuongDongGoi: number;
}

export interface CreateMedicineDto {
  TenThuoc: string;
  BHYT: boolean;
  Gia: string;
  DonViTinh: DonViTinh;
  DonViDongGoi: DonViDongGoi;
  DangBaoChe: DangBaoChe;
  HamLuong: string;
  SoLuongDongGoi: number;
}

export interface UpdateMedicineDto {
  TenThuoc?: string;
  BHYT?: boolean;
  Gia?: string;
  DonViTinh?: DonViTinh;
  DonViDongGoi?: DonViDongGoi;
  DangBaoChe?: DangBaoChe;
  HamLuong?: string;
  SoLuongDongGoi?: number;
}

const API_BASE_URL = '/api/v1';

class MedicineAPI {
  async getAll(): Promise<any> {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/thuoc/`);
      return response.data; // Return full response structure
    } catch (error) {
      console.error('Error fetching medicines:', error);
      throw error;
    }
  }

  async create(medicineData: CreateMedicineDto): Promise<Medicine> {
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}/thuoc`, medicineData);
      return response.data.data; // Access the nested data
    } catch (error) {
      console.error('Error creating medicine:', error);
      throw error;
    }
  }

  async update(id: string, medicineData: UpdateMedicineDto): Promise<Medicine> {
    try {
      const response = await axiosInstance.put(`${API_BASE_URL}/thuoc/${id}`, medicineData);
      return response.data.data; // Access the nested data
    } catch (error) {
      console.error('Error updating medicine:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`${API_BASE_URL}/thuoc/${id}`);
    } catch (error) {
      console.error('Error deleting medicine:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<Medicine> {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/thuoc/${id}`);
      return response.data.data; // Access the nested data
    } catch (error) {
      console.error('Error fetching medicine by id:', error);
      throw error;
    }
  }
}

export const medicineAPI = new MedicineAPI();
