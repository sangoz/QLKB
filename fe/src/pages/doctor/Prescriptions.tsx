import { FC, useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Snackbar,
  Autocomplete,
  Stack,
  IconButton,
  Tooltip,
  CircularProgress
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Save,
  Cancel,
  LocalPharmacy,
  Medication,
  Receipt,
  Visibility
} from "@mui/icons-material";

// API imports
import { benhnhanAPI } from "../../utils/api/benhnhanAPI";
import { thuocAPI } from "../../utils/api/thuocAPI";
import { chitiettoathuocAPI } from "../../utils/api/chitiettoathuocAPI";
import axiosInstance from "../../utils/axiosCustomize";

// Interface cho API Response
interface ApiResponse<T = any> {
  statusCode: number;
  message: string;
  data: T;
  author?: string;
}

// Prescription API service
const prescriptionAPI = {
  // Get all prescriptions
  getAll: async (): Promise<ApiResponse<ToaThuoc[]>> => {
    try {
      const response = await axiosInstance.get('/api/v1/toathuoc');
      console.log("Raw API response:", response);
      return response as unknown as ApiResponse<ToaThuoc[]>;
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      throw error;
    }
  },

  // Create prescription
  create: async (data: any): Promise<ApiResponse<ToaThuoc>> => {
    try {
      console.log("Sending prescription data:", data);
      const response = await axiosInstance.post('/api/v1/toathuoc', data);
      console.log("Create response:", response);
      return response as unknown as ApiResponse<ToaThuoc>;
    } catch (error) {
      console.error('Error creating prescription:', error);
      throw error;
    }
  },

  // Update prescription
  update: async (id: string, data: any): Promise<ApiResponse<ToaThuoc>> => {
    try {
      console.log("Updating prescription:", id, data);
      const response = await axiosInstance.put(`/api/v1/toathuoc/${id}`, data);
      console.log("Update response:", response);
      return response as unknown as ApiResponse<ToaThuoc>;
    } catch (error) {
      console.error('Error updating prescription:', error);
      throw error;
    }
  },

  // Delete prescription  
  delete: async (id: string): Promise<ApiResponse<any>> => {
    try {
      console.log("Deleting prescription:", id);
      const response = await axiosInstance.delete(`/api/v1/toathuoc/${id}`);
      console.log("Delete response:", response);
      return response as unknown as ApiResponse<any>;
    } catch (error) {
      console.error('Error deleting prescription:', error);
      throw error;
    }
  },

  // Print prescription - API to get prescription with details for printing
  print: async (id: string): Promise<ApiResponse<any>> => {
    try {
      console.log("Getting prescription for print:", id);
      const response = await axiosInstance.get(`/api/v1/toathuoc/${id}/print`);
      console.log("Print response:", response);
      return response as unknown as ApiResponse<any>;
    } catch (error) {
      console.error('Error getting prescription for print:', error);
      throw error;
    }
  }
};

// Simple interfaces for Prescription management theo backend
interface ToaThuoc {
  MaToaThuoc: string;
  MaBN: string;
  MaNV: string;
  NgayKe: string; // Backend dùng NgayKe thay vì NgayKeToa
  TrangThai: 'Pending' | 'Payed' | 'Done'; // Backend dùng Payed thay vì Cancel
}

interface BenhNhan { 
  MaBN: string;
  HoTen: string;
  CCCD: string;
  SDT: string;
  DiaChi: string;
  MaPhongBenhId?: string;
}

interface ChiTietToaThuoc {
  MaThuoc: string;
  MaToaThuoc: string;
  SoLuong: number;
  LieuLuong: string;
  DonGia: number;
}

interface Thuoc {
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

// Form data interface theo backend DTO
interface PrescriptionFormData {
  MaBN: string;
  NgayKe: string; // Backend yêu cầu NgayKe
  TrangThai: 'Pending' | 'Payed' | 'Done'; // Backend enum
}

interface ChiTietFormData {
  MaThuoc: string;
  SoLuong: number;
  LieuLuong: string;
  DonGia: number;
}

const DoctorPrescriptions: FC = () => {
  // State for data
  const [prescriptions, setPrescriptions] = useState<ToaThuoc[]>([]);
  const [patients, setPatients] = useState<BenhNhan[]>([]);
  const [medicines, setMedicines] = useState<Thuoc[]>([]);
  const [prescriptionDetails, setPrescriptionDetails] = useState<ChiTietToaThuoc[]>([]);
  
  // State for UI
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openDetailForm, setOpenDetailForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editDetailMode, setEditDetailMode] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<ToaThuoc | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<ChiTietToaThuoc | null>(null);
  
  // Form data
  const [formData, setFormData] = useState<PrescriptionFormData>({
    MaBN: "",
    NgayKe: new Date().toISOString().split('T')[0], // Backend yêu cầu NgayKe
    TrangThai: "Pending"
  });

  const [detailFormData, setDetailFormData] = useState<ChiTietFormData>({
    MaThuoc: "",
    SoLuong: 1,
    LieuLuong: "",
    DonGia: 0
  });
  
  // Notifications
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    message: "",
    severity: "success"
  });

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          loadPrescriptions(),
          loadPatients(),
          loadMedicines()
        ]);
      } catch (error) {
        console.error("Error initializing data:", error);
        showNotification("Lỗi khi tải dữ liệu", "error");
      } finally {
        setLoading(false);
      }
    };
    
    initializeData();
  }, []);

  const loadPrescriptions = async () => {
    try {
      console.log("Loading prescriptions...");
      const response = await prescriptionAPI.getAll();
      
      console.log("API Response:", response);
      
      if (response && response.statusCode === 200 && response.data) {
        console.log("Prescription data:", response.data);
        setPrescriptions(response.data);
        showNotification(`Đã tải ${response.data.length} toa thuốc`, "success");
      } else {
        console.log("No data or error in response:", response);
        setPrescriptions([]);
        showNotification("Không có dữ liệu toa thuốc", "info");
      }
    } catch (error) {
      console.error("Error loading prescriptions:", error);
      setPrescriptions([]);
      showNotification("Lỗi khi tải danh sách toa thuốc", "error");
    }
  };

  const loadPatients = async () => {
    try {
      console.log("Loading patients...");
      const response = await benhnhanAPI.getAll();
      
      console.log("Patients API Response:", response);
      
      if (response && response.statusCode === 200 && response.data) {
        setPatients(response.data);
      } else {
        setPatients([]);
        showNotification("Không có dữ liệu bệnh nhân", "info");
      }
    } catch (error) {
      console.error("Error loading patients:", error);
      setPatients([]);
      showNotification("Lỗi khi tải danh sách bệnh nhân", "error");
    }
  };

  const loadMedicines = async () => {
    try {
      console.log("Loading medicines...");
      const response = await thuocAPI.getAll();
      
      console.log("Medicines API Response:", response);
      
      if (response && response.statusCode === 200 && response.data) {
        setMedicines(response.data);
      } else {
        setMedicines([]);
        showNotification("Không có dữ liệu thuốc", "info");
      }
    } catch (error) {
      console.error("Error loading medicines:", error);
      setMedicines([]);
      showNotification("Lỗi khi tải danh sách thuốc", "error");
    }
  };

  const loadPrescriptionDetails = async (maToaThuoc: string) => {
    try {
      console.log("Loading prescription details for:", maToaThuoc);
      const response = await chitiettoathuocAPI.getByToaThuoc(maToaThuoc);
      
      console.log("Prescription Details API Response:", response);
      
      if (response && response.statusCode === 200 && response.data) {
        setPrescriptionDetails(response.data);
        return response.data;
      } else {
        setPrescriptionDetails([]);
        return [];
      }
    } catch (error) {
      console.error("Error loading prescription details:", error);
      setPrescriptionDetails([]);
      showNotification("Lỗi khi tải chi tiết toa thuốc", "error");
      return [];
    }
  };

  const handleCreatePrescription = async () => {
    try {
      if (!formData.MaBN) {
        showNotification("Vui lòng chọn bệnh nhân", "warning");
        return;
      }

      console.log("Creating prescription:", formData);
      
      // Khi tạo toa thuốc: Ngày luôn là hôm nay, trạng thái luôn là "Pending" (Chờ thanh toán)
      const prescriptionData = {
        MaBN: formData.MaBN,
        NgayKe: new Date().toISOString(), // Luôn gán ngày hôm nay
        TrangThai: "Pending" as "Pending" // Luôn là "Chờ thanh toán"
      };
      
      const response = await prescriptionAPI.create(prescriptionData);
      
      if (response.statusCode === 201 || response.statusCode === 200) {
        // Reload prescriptions to show updated data
        await loadPrescriptions();
        showNotification("Tạo toa thuốc thành công", "success");
        setOpenDialog(false);
        resetFormData();
      } else {
        showNotification("Lỗi khi tạo toa thuốc", "error");
      }
    } catch (error) {
      console.error("Error creating prescription:", error);
      showNotification("Lỗi khi tạo toa thuốc", "error");
    }
  };

  const handleEditPrescription = (prescription: ToaThuoc) => {
    console.log("Loading prescription for edit:", prescription.MaToaThuoc);
    
    setFormData({
      MaBN: prescription.MaBN,
      NgayKe: prescription.NgayKe.split('T')[0], // Convert ISO date to YYYY-MM-DD for date input
      TrangThai: prescription.TrangThai
    });
    
    setSelectedPrescription(prescription);
    setEditMode(true);
    setOpenDialog(true);
  };

  const handleUpdatePrescription = async () => {
    try {
      if (!selectedPrescription) return;
      
      console.log("Updating prescription:", selectedPrescription.MaToaThuoc);
      
      // Backend chỉ yêu cầu MaBN, NgayKe, TrangThai
      const updateData = {
        MaBN: formData.MaBN,
        NgayKe: new Date(formData.NgayKe).toISOString(), // Convert to ISO date
        TrangThai: formData.TrangThai
      };
      
      const response = await prescriptionAPI.update(selectedPrescription.MaToaThuoc, updateData);
      
      if (response.statusCode === 200) {
        // Reload prescriptions to show updated data
        await loadPrescriptions();
        showNotification("Cập nhật toa thuốc thành công", "success");
        setOpenDialog(false);
        resetFormData();
      } else {
        showNotification("Lỗi khi cập nhật toa thuốc", "error");
      }
    } catch (error) {
      console.error("Error updating prescription:", error);
      showNotification("Lỗi khi cập nhật toa thuốc", "error");
    }
  };

  const handleDeletePrescription = async (prescription: ToaThuoc) => {
    try {
      if (!confirm(`Bạn có chắc chắn muốn xóa toa thuốc ${prescription.MaToaThuoc}?`)) {
        return;
      }
      
      console.log("Deleting prescription:", prescription.MaToaThuoc);
      
      const response = await prescriptionAPI.delete(prescription.MaToaThuoc);
      
      if (response.statusCode === 200) {
        // Reload prescriptions to show updated data
        await loadPrescriptions();
        showNotification("Xóa toa thuốc thành công", "success");
      } else {
        showNotification("Lỗi khi xóa toa thuốc", "error");
      }
    } catch (error) {
      console.error("Error deleting prescription:", error);
      showNotification("Lỗi khi xóa toa thuốc", "error");
    }
  };

  const handlePrintPrescription = async (prescription: ToaThuoc) => {
    try {
      console.log("Printing prescription:", prescription.MaToaThuoc);
      
      const response = await prescriptionAPI.print(prescription.MaToaThuoc);
      
      if (response.statusCode === 200 && response.data) {
        // Tạo nội dung in với thông tin toa thuốc và chi tiết thuốc
        const printContent = formatPrescriptionForPrint(response.data, prescription);
        
        // Mở cửa sổ in
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(printContent);
          printWindow.document.close();
          printWindow.print();
        }
        
        showNotification("Đã chuẩn bị in toa thuốc", "success");
      } else {
        showNotification("Lỗi khi lấy thông tin in toa thuốc", "error");
      }
    } catch (error) {
      console.error("Error printing prescription:", error);
      showNotification("Lỗi khi in toa thuốc", "error");
    }
  };

  const formatPrescriptionForPrint = (prescriptionData: any, prescription: ToaThuoc) => {
    const patientName = prescriptionData.benhNhan?.HoTen || getPatientName(prescription.MaBN);
    const patientCCCD = prescriptionData.benhNhan?.CCCD || 'N/A';
    const patientPhone = prescriptionData.benhNhan?.SDT || 'N/A';
    const patientAddress = prescriptionData.benhNhan?.DiaChi || 'N/A';
    const printDate = new Date().toLocaleDateString('vi-VN');
    const prescriptionDate = new Date(prescription.NgayKe).toLocaleDateString('vi-VN');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Toa Thuốc - ${prescription.MaToaThuoc}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .title { font-size: 24px; font-weight: bold; color: #094067; margin-bottom: 10px; }
          .info-section { margin-bottom: 20px; }
          .info-row { margin-bottom: 8px; }
          .label { font-weight: bold; display: inline-block; width: 150px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f8f9fa; font-weight: bold; }
          .footer { margin-top: 30px; text-align: right; }
          .total-row { font-weight: bold; background-color: #f8f9fa; }
          @media print { button { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">TOA THUỐC</div>
          <div>Mã toa thuốc: ${prescription.MaToaThuoc}</div>
        </div>
        
        <div class="info-section">
          <div class="info-row">
            <span class="label">Bệnh nhân:</span> ${patientName}
          </div>
          <div class="info-row">
            <span class="label">Mã bệnh nhân:</span> ${prescription.MaBN}
          </div>
          <div class="info-row">
            <span class="label">CCCD:</span> ${patientCCCD}
          </div>
          <div class="info-row">
            <span class="label">Số điện thoại:</span> ${patientPhone}
          </div>
          <div class="info-row">
            <span class="label">Địa chỉ:</span> ${patientAddress}
          </div>
          <div class="info-row">
            <span class="label">Ngày kê toa:</span> ${prescriptionDate}
          </div>
          <div class="info-row">
            <span class="label">Trạng thái:</span> ${prescription.TrangThai === 'Pending' ? 'Chờ thanh toán' : prescription.TrangThai === 'Payed' ? 'Đã thanh toán' : 'Đã hoàn thành'}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên thuốc</th>
              <th>Dạng bào chế</th>
              <th>Số lượng</th>
              <th>Đơn vị</th>
              <th>Liều lượng</th>
              <th>Đơn giá</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            ${prescriptionData.details && prescriptionData.details.length > 0 ? 
              prescriptionData.details.map((detail: any, index: number) => {
                const thanhTien = detail.SoLuong * Number(detail.DonGia);
                return `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${detail.TenThuoc || 'N/A'}</td>
                    <td>${detail.DangBaoChe || 'N/A'}</td>
                    <td>${detail.SoLuong}</td>
                    <td>${detail.DonViTinh || 'N/A'}</td>
                    <td>${detail.LieuLuong || 'N/A'}</td>
                    <td>${Number(detail.DonGia).toLocaleString('vi-VN')} VNĐ</td>
                    <td>${thanhTien.toLocaleString('vi-VN')} VNĐ</td>
                  </tr>
                `;
              }).join('') + 
              `<tr class="total-row">
                <td colspan="7"><strong>Tổng cộng:</strong></td>
                <td><strong>${prescriptionData.details.reduce((total: number, detail: any) => total + (detail.SoLuong * Number(detail.DonGia)), 0).toLocaleString('vi-VN')} VNĐ</strong></td>
              </tr>`
              : '<tr><td colspan="8">Không có chi tiết thuốc</td></tr>'
            }
          </tbody>
        </table>

        <div class="footer">
          <div>Ngày in: ${printDate}</div>
          <div style="margin-top: 40px;">
            <div style="float: left;">
              <div><strong>Bệnh nhân</strong></div>
              <div style="margin-top: 60px; border-top: 1px solid #000; width: 200px;">
                Chữ ký và họ tên
              </div>
            </div>
            <div style="float: right;">
              <div><strong>Bác sĩ kê toa</strong></div>
              <div style="margin-top: 60px; border-top: 1px solid #000; width: 200px;">
                Chữ ký và họ tên
              </div>
            </div>
            <div style="clear: both;"></div>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const resetFormData = () => {
    setFormData({
      MaBN: "",
      NgayKe: new Date().toISOString().split('T')[0],
      TrangThai: "Pending"
    });
    setEditMode(false);
    setSelectedPrescription(null);
  };

  const showNotification = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const getStatusChip = (status: string) => {
    const statusConfig = {
      'Pending': { label: 'Chờ thanh toán', color: 'warning' as const },
      'Payed': { label: 'Đã thanh toán', color: 'primary' as const },
      'Done': { label: 'Đã hoàn thành', color: 'success' as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, color: 'default' as const };
    
    return (
      <Chip 
        label={config.label}
        color={config.color}
        size="small"
        sx={{ fontWeight: 500 }}
      />
    );
  };

  const getPatientName = (maBN: string) => {
    const patient = patients.find(p => p.MaBN === maBN);
    return patient?.HoTen || "Không tìm thấy";
  };

  const getMedicineName = (maThuoc: string) => {
    const medicine = medicines.find(m => m.MaThuoc === maThuoc);
    return medicine?.TenThuoc || "Không tìm thấy";
  };

  const handleViewDetails = async (prescription: ToaThuoc) => {
    setSelectedPrescription(prescription);
    await loadPrescriptionDetails(prescription.MaToaThuoc);
    setOpenDetailDialog(true);
  };

  const handleAddDetail = () => {
    setDetailFormData({
      MaThuoc: "",
      SoLuong: 1,
      LieuLuong: "",
      DonGia: 0
    });
    setEditDetailMode(false);
    setOpenDetailForm(true);
  };

  const handleEditDetail = (detail: ChiTietToaThuoc) => {
    setDetailFormData({
      MaThuoc: detail.MaThuoc,
      SoLuong: detail.SoLuong,
      LieuLuong: detail.LieuLuong,
      DonGia: detail.DonGia
    });
    setSelectedDetail(detail);
    setEditDetailMode(true);
    setOpenDetailForm(true);
  };

  // Hàm tính đơn giá tự động khi chọn thuốc và nhập số lượng
  const calculateDonGia = (maThuoc: string, soLuong: number) => {
    const medicine = medicines.find(m => m.MaThuoc === maThuoc);
    if (medicine && medicine.Gia) {
      const giaPerUnit = parseFloat(medicine.Gia);
      return giaPerUnit * soLuong;
    }
    return 0;
  };

  // Hàm xử lý khi thay đổi thuốc được chọn
  const handleMedicineChange = (selectedMedicine: Thuoc | null) => {
    if (selectedMedicine) {
      const donGia = calculateDonGia(selectedMedicine.MaThuoc, detailFormData.SoLuong);
      setDetailFormData({
        ...detailFormData,
        MaThuoc: selectedMedicine.MaThuoc,
        DonGia: donGia
      });
    } else {
      setDetailFormData({
        ...detailFormData,
        MaThuoc: "",
        DonGia: 0
      });
    }
  };

  // Hàm xử lý khi thay đổi số lượng
  const handleQuantityChange = (soLuong: number) => {
    const donGia = calculateDonGia(detailFormData.MaThuoc, soLuong);
    setDetailFormData({
      ...detailFormData,
      SoLuong: soLuong,
      DonGia: donGia
    });
  };

  const handleCreateDetail = async () => {
    try {
      if (!selectedPrescription || !detailFormData.MaThuoc) {
        showNotification("Vui lòng điền đầy đủ thông tin", "warning");
        return;
      }

      const detailData = {
        MaThuoc: detailFormData.MaThuoc,
        MaToaThuoc: selectedPrescription.MaToaThuoc,
        SoLuong: detailFormData.SoLuong,
        LieuLuong: detailFormData.LieuLuong,
        DonGia: detailFormData.DonGia
      };

      const response = await chitiettoathuocAPI.create(detailData);

      if (response.statusCode === 201 || response.statusCode === 200) {
        await loadPrescriptionDetails(selectedPrescription.MaToaThuoc);
        showNotification("Thêm chi tiết toa thuốc thành công", "success");
        setOpenDetailForm(false);
      } else {
        showNotification("Lỗi khi thêm chi tiết toa thuốc", "error");
      }
    } catch (error) {
      console.error("Error creating detail:", error);
      showNotification("Lỗi khi thêm chi tiết toa thuốc", "error");
    }
  };

  const handleUpdateDetail = async () => {
    try {
      if (!selectedDetail || !selectedPrescription) return;

      const updateData = {
        MaThuoc: detailFormData.MaThuoc,
        MaToaThuoc: selectedPrescription.MaToaThuoc,
        SoLuong: detailFormData.SoLuong,
        LieuLuong: detailFormData.LieuLuong,
        DonGia: detailFormData.DonGia
      };

      const response = await chitiettoathuocAPI.update(
        selectedDetail.MaThuoc,
        selectedPrescription.MaToaThuoc,
        updateData
      );

      if (response.statusCode === 200) {
        await loadPrescriptionDetails(selectedPrescription.MaToaThuoc);
        showNotification("Cập nhật chi tiết toa thuốc thành công", "success");
        setOpenDetailForm(false);
      } else {
        showNotification("Lỗi khi cập nhật chi tiết toa thuốc", "error");
      }
    } catch (error) {
      console.error("Error updating detail:", error);
      showNotification("Lỗi khi cập nhật chi tiết toa thuốc", "error");
    }
  };

  const handleDeleteDetail = async (detail: ChiTietToaThuoc) => {
    try {
      if (!confirm(`Bạn có chắc chắn muốn xóa thuốc ${getMedicineName(detail.MaThuoc)}?`)) {
        return;
      }

      const response = await chitiettoathuocAPI.delete(detail.MaThuoc, detail.MaToaThuoc);

      if (response.statusCode === 200) {
        await loadPrescriptionDetails(detail.MaToaThuoc);
        showNotification("Xóa chi tiết toa thuốc thành công", "success");
      } else {
        showNotification("Lỗi khi xóa chi tiết toa thuốc", "error");
      }
    } catch (error) {
      console.error("Error deleting detail:", error);
      showNotification("Lỗi khi xóa chi tiết toa thuốc", "error");
    }
  };

  const handleOpenCreateDialog = () => {
    resetFormData();
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    resetFormData();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} sx={{ color: "#3da9fc" }} />
        </Box>
      ) : (
        <>
          {/* Header */}
          <Box mb={4}>
            <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700, mb: 1 }}>
              Quản lý toa thuốc
            </Typography>
            <Typography variant="body1" sx={{ color: "#5f6c7b" }}>
              Kê toa và quản lý đơn thuốc cho bệnh nhân
            </Typography>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={3}>
              <Card sx={{ borderRadius: 3, borderLeft: "4px solid #3da9fc" }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Receipt sx={{ fontSize: 40, color: "#3da9fc" }} />
                    <Box>
                      <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                        {prescriptions.length}
                      </Typography>
                      <Typography variant="body2" color="#5f6c7b">
                        Tổng số toa thuốc
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Card sx={{ borderRadius: 3, borderLeft: "4px solid #ffc107" }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <LocalPharmacy sx={{ fontSize: 40, color: "#ffc107" }} />
                    <Box>
                      <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                        {prescriptions.filter(p => p.TrangThai === "Pending").length}
                      </Typography>
                      <Typography variant="body2" color="#5f6c7b">
                        Toa chờ thanh toán
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Card sx={{ borderRadius: 3, borderLeft: "4px solid #28a745" }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Receipt sx={{ fontSize: 40, color: "#28a745" }} />
                    <Box>
                      <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                        {prescriptions.filter(p => p.TrangThai === "Done").length}
                      </Typography>
                      <Typography variant="body2" color="#5f6c7b">
                        Toa đã hoàn thành
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Card sx={{ borderRadius: 3, borderLeft: "4px solid #17a2b8" }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Medication sx={{ fontSize: 40, color: "#17a2b8" }} />
                    <Box>
                      <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                        {prescriptions.filter(p => p.TrangThai === "Payed").length}
                      </Typography>
                      <Typography variant="body2" color="#5f6c7b">
                        Toa đã thanh toán
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Action Button */}
          <Box mb={3}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleOpenCreateDialog}
              sx={{
                bgcolor: "#3da9fc",
                "&:hover": { bgcolor: "#2b8fd1" },
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600
              }}
            >
              Kê toa thuốc mới
            </Button>
          </Box>

          {/* Prescriptions Table */}
          <Card sx={{ borderRadius: 3, boxShadow: "0 8px 32px rgba(9, 64, 103, 0.15)" }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: "#094067", fontWeight: 600, mb: 3 }}>
                Danh sách toa thuốc
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                      <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Bệnh nhân</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Ngày kê toa</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Trạng thái</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Chi tiết toa thuốc</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {prescriptions.map((prescription) => (
                      <TableRow key={prescription.MaToaThuoc} hover>
                        <TableCell>
                          <Typography variant="subtitle2" sx={{ color: "#094067", fontWeight: 600 }}>
                            {getPatientName(prescription.MaBN)}
                          </Typography>
                          <Typography variant="body2" color="#5f6c7b">
                            Mã BN: {prescription.MaBN}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="#5f6c7b">
                            {new Date(prescription.NgayKe).toLocaleDateString('vi-VN')}
                          </Typography>
                        </TableCell>
                        <TableCell>{getStatusChip(prescription.TrangThai)}</TableCell>
                        <TableCell>
                          <Tooltip title={selectedPrescription?.TrangThai === "Pending" ? "Xem chi tiết toa thuốc" : "Xem chi tiết toa thuốc (chỉ xem)"}>
                            <IconButton
                              size="small"
                              onClick={() => handleViewDetails(prescription)}
                              sx={{ color: "#3da9fc" }}
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Tooltip title={prescription.TrangThai === "Pending" ? "Chỉnh sửa" : "Chỉ có thể chỉnh sửa toa thuốc chờ thanh toán"}>
                              <span>
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditPrescription(prescription)}
                                  disabled={prescription.TrangThai !== "Pending"}
                                  sx={{ 
                                    color: prescription.TrangThai === "Pending" ? "#28a745" : "#ccc",
                                    "&:disabled": { color: "#ccc" }
                                  }}
                                >
                                  <Edit />
                                </IconButton>
                              </span>
                            </Tooltip>
                            <Tooltip title="In toa thuốc">
                              <IconButton
                                size="small"
                                onClick={() => handlePrintPrescription(prescription)}
                                sx={{ color: "#3da9fc" }}
                              >
                                <Receipt />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={prescription.TrangThai === "Pending" ? "Xóa" : "Chỉ có thể xóa toa thuốc chờ thanh toán"}>
                              <span>
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeletePrescription(prescription)}
                                  disabled={prescription.TrangThai !== "Pending"}
                                  sx={{ 
                                    color: prescription.TrangThai === "Pending" ? "#dc3545" : "#ccc",
                                    "&:disabled": { color: "#ccc" }
                                  }}
                                >
                                  <Delete />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Create/Edit Prescription Dialog */}
          <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
            <DialogTitle sx={{ color: "#094067", fontWeight: 600 }}>
              {editMode ? "Chỉnh sửa toa thuốc" : "Tạo toa thuốc mới"}
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={editMode ? 6 : 12}>
                  <Autocomplete
                    options={patients}
                    getOptionLabel={(option) => `${option.HoTen} - ${option.MaBN}`}
                    value={patients.find(p => p.MaBN === formData.MaBN) || null}
                    onChange={(_, value) => {
                      setFormData({ ...formData, MaBN: value?.MaBN || "" });
                    }}
                    disabled={editMode} // Không cho sửa bệnh nhân khi edit
                    renderInput={(params) => (
                      <TextField {...params} label="Chọn bệnh nhân" required />
                    )}
                  />
                </Grid>
                {editMode && (
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Ngày kê toa"
                      type="date"
                      value={formData.NgayKe}
                      onChange={(e) => setFormData({ ...formData, NgayKe: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                      required
                    />
                  </Grid>
                )}
                {editMode && (
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Trạng thái</InputLabel>
                      <Select
                        value={formData.TrangThai}
                        onChange={(e) => setFormData({ ...formData, TrangThai: e.target.value as any })}
                      >
                        <MenuItem value="Pending">Chờ thanh toán</MenuItem>
                        <MenuItem value="Payed">Đã thanh toán</MenuItem>
                        <MenuItem value="Done">Đã hoàn thành</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                )}
                {!editMode && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      * Ngày kê toa sẽ được tự động đặt là ngày hôm nay
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      * Trạng thái mặc định: Chờ thanh toán
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={handleCloseDialog} startIcon={<Cancel />} color="inherit">
                Hủy
              </Button>
              <Button
                variant="contained"
                onClick={editMode ? handleUpdatePrescription : handleCreatePrescription}
                disabled={!formData.MaBN}
                startIcon={<Save />}
                sx={{
                  bgcolor: "#3da9fc",
                  "&:hover": { bgcolor: "#2b8fd1" }
                }}
              >
                {editMode ? "Cập nhật" : "Tạo toa thuốc"}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Prescription Details Dialog */}
          <Dialog open={openDetailDialog} onClose={() => setOpenDetailDialog(false)} maxWidth="lg" fullWidth>
            <DialogTitle sx={{ color: "#094067", fontWeight: 600 }}>
              Chi tiết toa thuốc - {selectedPrescription ? getPatientName(selectedPrescription.MaBN) : ""}
              {selectedPrescription?.TrangThai !== "Pending" && (
                <Typography variant="body2" color="warning.main" sx={{ fontWeight: 400, mt: 1 }}>
                  ⚠️ Toa thuốc này {selectedPrescription?.TrangThai === "Payed" ? "đã thanh toán" : "đã hoàn thành"} - chỉ có thể xem, không thể chỉnh sửa
                </Typography>
              )}
            </DialogTitle>
            <DialogContent dividers>
              <Box mb={2}>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleAddDetail}
                  disabled={selectedPrescription?.TrangThai !== "Pending"}
                  sx={{
                    bgcolor: selectedPrescription?.TrangThai === "Pending" ? "#3da9fc" : "#ccc",
                    "&:hover": { 
                      bgcolor: selectedPrescription?.TrangThai === "Pending" ? "#2b8fd1" : "#ccc" 
                    },
                    "&:disabled": { 
                      bgcolor: "#ccc",
                      color: "#999"
                    },
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600
                  }}
                >
                  {selectedPrescription?.TrangThai === "Pending" ? "Thêm thuốc" : "Chỉ được thêm thuốc khi toa chờ thanh toán"}
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                      <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Tên thuốc</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Số lượng</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Liều lượng</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Đơn giá</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {prescriptionDetails.map((detail) => (
                      <TableRow key={`${detail.MaThuoc}-${detail.MaToaThuoc}`} hover>
                        <TableCell>
                          <Typography variant="subtitle2" sx={{ color: "#094067", fontWeight: 600 }}>
                            {getMedicineName(detail.MaThuoc)}
                          </Typography>
                          <Typography variant="body2" color="#5f6c7b">
                            Mã: {detail.MaThuoc}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="#5f6c7b">
                            {detail.SoLuong}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="#5f6c7b">
                            {detail.LieuLuong}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="#5f6c7b">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(detail.DonGia)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Tooltip title={selectedPrescription?.TrangThai === "Pending" ? "Chỉnh sửa" : "Chỉ có thể chỉnh sửa khi toa chờ thanh toán"}>
                              <span>
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditDetail(detail)}
                                  disabled={selectedPrescription?.TrangThai !== "Pending"}
                                  sx={{ 
                                    color: selectedPrescription?.TrangThai === "Pending" ? "#28a745" : "#ccc",
                                    "&:disabled": { color: "#ccc" }
                                  }}
                                >
                                  <Edit />
                                </IconButton>
                              </span>
                            </Tooltip>
                            <Tooltip title={selectedPrescription?.TrangThai === "Pending" ? "Xóa" : "Chỉ có thể xóa khi toa chờ thanh toán"}>
                              <span>
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteDetail(detail)}
                                  disabled={selectedPrescription?.TrangThai !== "Pending"}
                                  sx={{ 
                                    color: selectedPrescription?.TrangThai === "Pending" ? "#dc3545" : "#ccc",
                                    "&:disabled": { color: "#ccc" }
                                  }}
                                >
                                  <Delete />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => setOpenDetailDialog(false)} startIcon={<Cancel />} color="inherit">
                Đóng
              </Button>
            </DialogActions>
          </Dialog>

          {/* Add/Edit Detail Dialog */}
          <Dialog open={openDetailForm} onClose={() => setOpenDetailForm(false)} maxWidth="md" fullWidth>
            <DialogTitle sx={{ color: "#094067", fontWeight: 600 }}>
              {editDetailMode ? "Chỉnh sửa chi tiết" : "Thêm thuốc vào toa"}
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    options={medicines}
                    getOptionLabel={(option) => `${option.TenThuoc} - ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseFloat(option.Gia))}`}
                    value={medicines.find(m => m.MaThuoc === detailFormData.MaThuoc) || null}
                    onChange={(_, value) => handleMedicineChange(value)}
                    disabled={editDetailMode}
                    renderInput={(params) => (
                      <TextField {...params} label="Chọn thuốc" required />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Số lượng"
                    type="number"
                    value={detailFormData.SoLuong}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    inputProps={{ min: 1 }}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Liều lượng"
                    value={detailFormData.LieuLuong}
                    onChange={(e) => setDetailFormData({ 
                      ...detailFormData, 
                      LieuLuong: e.target.value 
                    })}
                    placeholder="VD: Uống 2 viên/lần, 3 lần/ngày sau ăn"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Đơn giá (VND)"
                    type="number"
                    value={detailFormData.DonGia}
                    InputProps={{
                      readOnly: true,
                    }}
                    helperText="Đơn giá được tính tự động: Giá thuốc × Số lượng"
                    variant="filled"
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => setOpenDetailForm(false)} startIcon={<Cancel />} color="inherit">
                Hủy
              </Button>
              <Button
                variant="contained"
                onClick={editDetailMode ? handleUpdateDetail : handleCreateDetail}
                disabled={!detailFormData.MaThuoc || !detailFormData.LieuLuong || detailFormData.SoLuong < 1}
                startIcon={<Save />}
                sx={{
                  bgcolor: "#3da9fc",
                  "&:hover": { bgcolor: "#2b8fd1" }
                }}
              >
                {editDetailMode ? "Cập nhật" : "Thêm thuốc"}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Notification */}
          <Snackbar
            open={notification.open}
            autoHideDuration={6000}
            onClose={() => setNotification({ ...notification, open: false })}
          >
            <Alert
              severity={notification.severity}
              onClose={() => setNotification({ ...notification, open: false })}
            >
              {notification.message}
            </Alert>
          </Snackbar>
        </>
      )}
    </Container>
  );
};

export default DoctorPrescriptions;
