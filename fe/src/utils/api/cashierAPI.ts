import axiosInstance from '../axiosCustomize';

// Interface cho API Response
interface ApiResponse<T = any> {
  statusCode: number;
  message: string;
  data: T;
  author?: string;
}

// Interface for HoaDon from API
export interface HoaDon {
  MaHD: string;
  NgayTao: string;
  TongTien: string;
  TrangThai: 'Pending' | 'Done';
  PhuongThucThanhToan: 'TienMat' | 'MoMo';
  LoaiHoaDon?: 'NhapVien' | 'XuatVien' | 'DichVu' | 'KhamBenh' | 'ToaThuoc';
  MaBN: string;
  MaNV: string;
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

// DTO for create/update
export interface CreateUpdateHoaDonDto {
  NgayTao: string;
  TongTien: string;
  TrangThai: 'Pending' | 'Done';
  PhuongThucThanhToan: 'TienMat' | 'MoMo';
  LoaiHoaDon: 'NhapVien' | 'XuatVien' | 'DichVu' | 'KhamBenh' | 'ToaThuoc';
  MaBN: string;
}

// API functions for cashier
export const cashierAPI = {
  // Get all invoices
  getAllHoaDon: async (): Promise<HoaDon[]> => {
    try {
      const response = await axiosInstance.get('/api/v1/hoadon');
      console.log("Raw API response:", response);
      return (response as unknown as ApiResponse<HoaDon[]>).data;
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  },

  // Create new invoice
  createHoaDon: async (data: CreateUpdateHoaDonDto): Promise<HoaDon> => {
    try {
      console.log("Creating invoice:", data);
      const response = await axiosInstance.post('/api/v1/hoadon', data);
      console.log("Create response:", response);
      return (response as unknown as ApiResponse<HoaDon>).data;
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  },

  // Update invoice
  updateHoaDon: async (maHD: string, data: CreateUpdateHoaDonDto): Promise<HoaDon> => {
    try {
      console.log("Updating invoice:", maHD, data);
      const response = await axiosInstance.put(`/api/v1/hoadon/${maHD}`, data);
      console.log("Update response:", response);
      return (response as unknown as ApiResponse<HoaDon>).data;
    } catch (error) {
      console.error('Error updating invoice:', error);
      throw error;
    }
  },

  // Delete invoice
  deleteHoaDon: async (maHD: string): Promise<void> => {
    try {
      console.log("Deleting invoice:", maHD);
      const response = await axiosInstance.delete(`/api/v1/hoadon/${maHD}`);
      console.log("Delete response:", response);
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    }
  },

  // Get single invoice
  getHoaDonById: async (maHD: string): Promise<HoaDon> => {
    try {
      const response = await axiosInstance.get(`/api/v1/hoadon/${maHD}`);
      return (response as unknown as ApiResponse<HoaDon>).data;
    } catch (error) {
      console.error('Error fetching invoice:', error);
      throw error;
    }
  },

  // Update invoice payment status
  updateInvoicePayment: async (maHD: string, paymentMethod: string, currentInvoice: HoaDon): Promise<HoaDon> => {
    try {
      const response = await axiosInstance.put(`/api/v1/hoadon/${maHD}`, {
        NgayTao: currentInvoice.NgayTao,
        TongTien: currentInvoice.TongTien,
        TrangThai: 'Done',
        PhuongThucThanhToan: paymentMethod,
        LoaiHoaDon: currentInvoice.LoaiHoaDon || 'KhamBenh',
        MaBN: currentInvoice.MaBN
      });
      return (response as unknown as ApiResponse<HoaDon>).data;
    } catch (error) {
      console.error('Error updating payment:', error);
      throw error;
    }
  },

  // Get all patients
  getAllPatients: async (): Promise<BenhNhan[]> => {
    try {
      const response = await axiosInstance.get('/api/v1/benhnhan');
      return (response as unknown as ApiResponse<BenhNhan[]>).data;
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw error;
    }
  },

  // Get patient by ID
  getPatientById: async (maBN: string): Promise<BenhNhan> => {
    try {
      const response = await axiosInstance.get(`/api/v1/benhnhan/${maBN}`);
      return (response as unknown as ApiResponse<BenhNhan>).data;
    } catch (error) {
      console.error('Error fetching patient:', error);
      throw error;
    }
  },

  // Print invoice
  printInvoice: async (maHD: string): Promise<void> => {
    try {
      const response = await axiosInstance.get(`/api/v1/hoadon/${maHD}/print`, {
        responseType: 'blob'
      });
      
      // Create blob and download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `hoadon-${maHD}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error printing invoice:', error);
      throw error;
    }
  }
};
