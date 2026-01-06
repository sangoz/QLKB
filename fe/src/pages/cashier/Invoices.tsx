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
  Divider,
  Stack,
  TablePagination
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Print,
  Receipt,
  Payment,
  Money,
  CreditCard,
  AttachMoney,
  LocalAtm
} from "@mui/icons-material";
import { cashierAPI, HoaDon, CreateUpdateHoaDonDto, BenhNhan } from "../../utils/api/cashierAPI";
import { medicalFormAPI, PhieuYeuCau, PhieuYeuCauDetail } from "../../utils/api/medicalFormAPI";
import { toathuocAPI, ToaThuocDetail } from "../../utils/api/toathuocAPI";
import { chitiettoathuocAPI } from "../../utils/api/chitiettoathuocAPI";

// Use API interface
interface Invoice extends HoaDon {}

const CashierInvoices: FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [patients, setPatients] = useState<BenhNhan[]>([]);
  const [patientInfo, setPatientInfo] = useState<{[key: string]: BenhNhan}>({});  
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openNewDialog, setOpenNewDialog] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Medical form lookup states
  const [medicalFormId, setMedicalFormId] = useState("");
  const [searchedMedicalForm, setSearchedMedicalForm] = useState<PhieuYeuCauDetail | null>(null);
  const [loadingMedicalForm, setLoadingMedicalForm] = useState(false);
  
  // Prescription lookup states
  const [prescriptionId, setPrescriptionId] = useState("");
  const [searchedPrescription, setSearchedPrescription] = useState<ToaThuocDetail | null>(null);
  const [loadingPrescription, setLoadingPrescription] = useState(false);
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Search & filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Form data matching API DTO
  const [formData, setFormData] = useState<{
    NgayTao: string;
    TongTien: string;
    TrangThai: 'Pending' | 'Done';
    PhuongThucThanhToan: 'TienMat' | 'MoMo';
    LoaiHoaDon: 'NhapVien' | 'XuatVien' | 'DichVu' | 'KhamBenh' | 'ToaThuoc';
    MaBN: string;
  }>({
    NgayTao: new Date().toISOString().split('T')[0],
    TongTien: "",
    TrangThai: 'Pending', // Mặc định là chờ thanh toán
    PhuongThucThanhToan: 'TienMat',
    LoaiHoaDon: 'KhamBenh',
    MaBN: ""
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
    loadInvoices();
    loadPatients();
  }, []);

  useEffect(() => {
    filterInvoices();
  }, [invoices, searchTerm, statusFilter, patientInfo]);

  const loadPatients = async () => {
    try {
      console.log("Loading patients from API...");
      const patientsData = await cashierAPI.getAllPatients();
      console.log("Loaded patients:", patientsData);
      
      if (patientsData && Array.isArray(patientsData)) {
        setPatients(patientsData);
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

  const loadPatientInfo = async (maBN: string) => {
    if (patientInfo[maBN]) return patientInfo[maBN];
    
    try {
      const patient = await cashierAPI.getPatientById(maBN);
      setPatientInfo(prev => ({ ...prev, [maBN]: patient }));
      return patient;
    } catch (error) {
      console.error("Error loading patient info:", error);
      return null;
    }
  };

  // Medical form search function
  const handleSearchMedicalForm = async () => {
    if (!medicalFormId.trim()) {
      showNotification("Vui lòng nhập mã số phiếu", "warning");
      return;
    }

    setLoadingMedicalForm(true);
    try {
      console.log("Searching medical form:", medicalFormId);
      const medicalForm = await medicalFormAPI.getPhieuById(medicalFormId);
      console.log("Found medical form:", medicalForm);
      
      setSearchedMedicalForm(medicalForm);
      showNotification("Tìm thấy phiếu yêu cầu", "success");
    } catch (error) {
      console.error("Error searching medical form:", error);
      setSearchedMedicalForm(null);
      showNotification("Không tìm thấy phiếu yêu cầu với mã này", "error");
    } finally {
      setLoadingMedicalForm(false);
    }
  };

  // Prescription search function
  const handleSearchPrescription = async () => {
    if (!prescriptionId.trim()) {
      showNotification("Vui lòng nhập mã toa thuốc", "warning");
      return;
    }

    setLoadingPrescription(true);
    try {
      console.log("Searching prescription:", prescriptionId);
      const prescription = await toathuocAPI.getToaThuocById(prescriptionId);
      console.log("Found prescription:", prescription);

      // Get prescription details to calculate total price
      let prescriptionDetails: any[] = [];
      try {
        const detailsResponse = await chitiettoathuocAPI.getByToaThuoc(prescriptionId);
        prescriptionDetails = detailsResponse?.data || [];
      } catch (detailError) {
        console.error("Error getting prescription details:", detailError);
      }

      // Add details to prescription object
      const prescriptionWithDetails = {
        ...prescription,
        ChiTietToaThuoc: prescriptionDetails
      };
      
      setSearchedPrescription(prescriptionWithDetails);
      showNotification("Tìm thấy toa thuốc", "success");
    } catch (error) {
      console.error("Error searching prescription:", error);
      setSearchedPrescription(null);
      showNotification("Không tìm thấy toa thuốc với mã này", "error");
    } finally {
      setLoadingPrescription(false);
    }
  };

  // Create invoice from medical form
  const handleCreateInvoiceFromMedicalForm = async () => {
    if (!searchedMedicalForm) {
      showNotification("Vui lòng tìm phiếu yêu cầu trước", "warning");
      return;
    }

    // Kiểm tra trạng thái phiếu - chỉ cho phép tạo hóa đơn từ phiếu Pending
    if (searchedMedicalForm.TrangThai !== 'Pending') {
      showNotification("Chỉ có thể tạo hóa đơn từ phiếu có trạng thái 'Chờ thanh toán'", "warning");
      return;
    }

    try {
      console.log("Creating invoice from medical form:", searchedMedicalForm);
      
      // Map LoaiPhieu to LoaiHoaDon
      const loaiHoaDonMapping: {[key: string]: 'NhapVien' | 'XuatVien' | 'DichVu' | 'KhamBenh' | 'ToaThuoc'} = {
        'NhapVien': 'NhapVien',
        'XuatVien': 'XuatVien', 
        'DichVu': 'DichVu',
        'KhamBenh': 'KhamBenh'
      };

      const invoiceData = {
        NgayTao: new Date().toISOString(),
        TongTien: searchedMedicalForm.DonGia,
        TrangThai: 'Pending' as const, // Tạo hóa đơn chờ thanh toán
        PhuongThucThanhToan: 'TienMat' as const,
        LoaiHoaDon: loaiHoaDonMapping[searchedMedicalForm.Loai] || 'KhamBenh',
        MaBN: searchedMedicalForm.MaBN
      };
      
      await cashierAPI.createHoaDon(invoiceData);
      
      showNotification("Tạo hóa đơn từ phiếu yêu cầu thành công", "success");
      
      // Reset form and reload
      setMedicalFormId("");
      setSearchedMedicalForm(null);
      loadInvoices();
    } catch (error: any) {
      console.error("Error creating invoice from medical form:", error);
      const errorMessage = error?.response?.data?.message || "Lỗi khi tạo hóa đơn từ phiếu yêu cầu";
      showNotification(errorMessage, "error");
    }
  };

  // Create invoice from prescription
  const handleCreateInvoiceFromPrescription = async () => {
    if (!searchedPrescription) {
      showNotification("Vui lòng tìm toa thuốc trước", "warning");
      return;
    }

    // Kiểm tra trạng thái toa thuốc - chỉ cho phép tạo hóa đơn từ toa thuốc Pending
    if (searchedPrescription.TrangThai !== 'Pending') {
      showNotification("Chỉ có thể tạo hóa đơn từ toa thuốc có trạng thái 'Chờ thanh toán'", "warning");
      return;
    }

    try {
      console.log("Creating invoice from prescription:", searchedPrescription);
      
      // Tính tổng tiền từ chi tiết toa thuốc
      const totalAmount = searchedPrescription.ChiTietToaThuoc?.reduce((total, detail) => {
        return total + (Number(detail.DonGia) * detail.SoLuong);
      }, 0) || 0;

      if (totalAmount <= 0) {
        showNotification("Toa thuốc không có thuốc hoặc giá trị không hợp lệ", "warning");
        return;
      }

      const invoiceData = {
        NgayTao: new Date().toISOString(),
        TongTien: totalAmount.toString(),
        TrangThai: 'Pending' as const, // Tạo hóa đơn chờ thanh toán
        PhuongThucThanhToan: 'TienMat' as const,
        LoaiHoaDon: 'ToaThuoc' as const,
        MaBN: searchedPrescription.MaBN
      };
      
      await cashierAPI.createHoaDon(invoiceData);
      
      showNotification("Tạo hóa đơn từ toa thuốc thành công", "success");
      
      // Reset form and reload
      setPrescriptionId("");
      setSearchedPrescription(null);
      loadInvoices();
    } catch (error: any) {
      console.error("Error creating invoice from prescription:", error);
      const errorMessage = error?.response?.data?.message || "Lỗi khi tạo hóa đơn từ toa thuốc";
      showNotification(errorMessage, "error");
    }
  };

  // Print invoice function
  const handlePrintInvoice = (invoice: Invoice) => {
    const patient = patientInfo[invoice.MaBN];
    
    if (!patient) {
      showNotification("Không tìm thấy thông tin bệnh nhân", "error");
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showNotification("Không thể mở cửa sổ in. Vui lòng kiểm tra popup blocker", "error");
      return;
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Hóa đơn - ${invoice.MaHD}</title>
        <meta charset="UTF-8">
        <style>
          body { 
            font-family: 'Times New Roman', serif; 
            margin: 20px;
            line-height: 1.6;
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
          }
          .hospital-name { 
            font-size: 24px; 
            font-weight: bold; 
            color: #094067; 
            margin-bottom: 5px;
          }
          .hospital-address { 
            font-size: 14px; 
            color: #666; 
          }
          .invoice-title { 
            font-size: 28px; 
            font-weight: bold; 
            margin: 20px 0;
            color: #094067;
          }
          .info-section { 
            margin: 20px 0; 
          }
          .info-row { 
            display: flex; 
            margin: 8px 0; 
          }
          .info-label { 
            font-weight: bold; 
            width: 150px; 
            flex-shrink: 0;
          }
          .info-value { 
            flex: 1; 
          }
          .total-section { 
            margin-top: 30px; 
            padding: 20px; 
            background-color: #f8f9fa; 
            border: 2px solid #094067;
            border-radius: 8px;
          }
          .total-amount { 
            font-size: 24px; 
            font-weight: bold; 
            color: #094067; 
            text-align: center;
          }
          .signature-section { 
            margin-top: 40px; 
            display: flex; 
            justify-content: space-between; 
          }
          .signature-box { 
            text-align: center; 
            width: 200px; 
          }
          .signature-title { 
            font-weight: bold; 
            margin-bottom: 60px; 
          }
          .footer { 
            margin-top: 40px; 
            text-align: center; 
            font-size: 12px; 
            color: #666; 
            border-top: 1px solid #ccc; 
            padding-top: 20px;
          }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="hospital-name">BỆNH VIỆN ĐẠI HỌC Y DƯỢC</div>
          <div class="hospital-address">123 Đường ABC, Quận XYZ, TP. HCM</div>
          <div class="hospital-address">Điện thoại: (028) 1234 5678 | Email: info@hospital.vn</div>
        </div>

        <div class="invoice-title">HÓA ĐƠN VIỆN PHÍ</div>

        <div class="info-section">
          <div class="info-row">
            <span class="info-label">Mã hóa đơn:</span>
            <span class="info-value">${invoice.MaHD}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Ngày tạo:</span>
            <span class="info-value">${new Date(invoice.NgayTao).toLocaleDateString('vi-VN')}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Loại hóa đơn:</span>
            <span class="info-value">${getLoaiHoaDonLabel(invoice.LoaiHoaDon)}</span>
          </div>
        </div>

        <div class="info-section">
          <h3 style="color: #094067; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Thông tin bệnh nhân</h3>
          <div class="info-row">
            <span class="info-label">Mã bệnh nhân:</span>
            <span class="info-value">${patient.MaBN}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Họ và tên:</span>
            <span class="info-value">${patient.HoTen}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Ngày sinh:</span>
            <span class="info-value">${new Date(patient.NgaySinh).toLocaleDateString('vi-VN')}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Giới tính:</span>
            <span class="info-value">${patient.GioiTinh}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Số điện thoại:</span>
            <span class="info-value">${patient.SoDienThoai}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Địa chỉ:</span>
            <span class="info-value">${patient.DiaChi}</span>
          </div>
          <div class="info-row">
            <span class="info-label">CCCD:</span>
            <span class="info-value">${patient.CCCD}</span>
          </div>
        </div>

        <div class="total-section">
          <div class="info-row">
            <span class="info-label">Phương thức thanh toán:</span>
            <span class="info-value">${getPaymentMethodLabel(invoice.PhuongThucThanhToan)}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Trạng thái:</span>
            <span class="info-value">${invoice.TrangThai === 'Done' ? 'Đã thanh toán' : 'Chờ thanh toán'}</span>
          </div>
          <div class="total-amount">
            TỔNG TIỀN: ${Number(invoice.TongTien).toLocaleString('vi-VN')} VNĐ
          </div>
        </div>

        <div class="signature-section">
          <div class="signature-box">
            <div class="signature-title">Thu ngân</div>
            <div>(Ký và ghi rõ họ tên)</div>
          </div>
          <div class="signature-box">
            <div class="signature-title">Bệnh nhân/Người thân</div>
            <div>(Ký và ghi rõ họ tên)</div>
          </div>
        </div>

        <div class="footer">
          <p>Cảm ơn quý khách đã sử dụng dịch vụ của bệnh viện!</p>
          <p>Hóa đơn được in lúc: ${new Date().toLocaleString('vi-VN')}</p>
        </div>

        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const loadInvoices = async () => {
    setLoading(true);
    try {
      console.log("Loading invoices from API...");
      const invoicesData = await cashierAPI.getAllHoaDon();
      console.log("Loaded invoices:", invoicesData);
      
      if (invoicesData && Array.isArray(invoicesData)) {
        setInvoices(invoicesData);
        showNotification(`Đã tải ${invoicesData.length} hóa đơn`, "success");
        
        // Load patient info for each invoice
        const patientPromises = invoicesData.map(invoice => 
          loadPatientInfo(invoice.MaBN)
        );
        await Promise.all(patientPromises);
      } else {
        setInvoices([]);
        showNotification("Không có dữ liệu hóa đơn", "info");
      }
    } catch (error) {
      console.error("Error loading invoices:", error);
      setInvoices([]);
      showNotification("Lỗi khi tải danh sách hóa đơn", "error");
    } finally {
      setLoading(false);
    }
  };

  const filterInvoices = () => {
    if (!invoices || !Array.isArray(invoices)) {
      setFilteredInvoices([]);
      return;
    }
    
    let filtered = invoices;
    
    if (searchTerm) {
      filtered = filtered.filter(invoice => {
        const patient = patientInfo[invoice.MaBN];
        return invoice.MaHD?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               invoice.MaBN?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               patient?.HoTen?.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(invoice => invoice.TrangThai === statusFilter);
    }
    
    setFilteredInvoices(filtered);
  };
  // CRUD Functions
  const handleCreateInvoice = async () => {
    if (!formData.TongTien.trim()) {
      showNotification("Vui lòng nhập tổng tiền", "warning");
      return;
    }
    if (!formData.MaBN.trim()) {
      showNotification("Vui lòng chọn bệnh nhân", "warning");
      return;
    }
    if (Number(formData.TongTien) <= 0) {
      showNotification("Tổng tiền phải lớn hơn 0", "warning");
      return;
    }
    
    try {
      console.log("Creating invoice:", formData);
      
      // Prepare data theo định dạng backend yêu cầu
      const invoiceData = {
        NgayTao: new Date(formData.NgayTao).toISOString(),
        TongTien: formData.TongTien,
        TrangThai: formData.TrangThai,
        PhuongThucThanhToan: formData.PhuongThucThanhToan,
        LoaiHoaDon: formData.LoaiHoaDon,
        MaBN: formData.MaBN
      };
      
      await cashierAPI.createHoaDon(invoiceData);
      showNotification("Tạo hóa đơn mới thành công", "success");
      setOpenNewDialog(false);
      resetForm();
      loadInvoices();
    } catch (error: any) {
      console.error("Error creating invoice:", error);
      const errorMessage = error?.response?.data?.message || "Lỗi khi tạo hóa đơn mới";
      showNotification(errorMessage, "error");
    }
  };

  const handleUpdateInvoice = async () => {
    if (!editingInvoice) return;
    
    // Khi sửa hóa đơn, chỉ cần validate các trường có thể thay đổi
    try {
      console.log("Updating invoice:", formData);
      
      // Prepare data theo định dạng backend yêu cầu
      // Chỉ gửi các trường có thể thay đổi khi sửa hóa đơn
      const invoiceData = {
        NgayTao: new Date(formData.NgayTao).toISOString(),
        TongTien: editingInvoice.TongTien, // Giữ nguyên tổng tiền gốc
        TrangThai: formData.TrangThai,
        PhuongThucThanhToan: formData.PhuongThucThanhToan,
        LoaiHoaDon: editingInvoice.LoaiHoaDon, // Giữ nguyên loại hóa đơn gốc
        MaBN: editingInvoice.MaBN // Giữ nguyên bệnh nhân gốc
      };
      
      await cashierAPI.updateHoaDon(editingInvoice.MaHD, invoiceData);
      showNotification("Cập nhật hóa đơn thành công", "success");
      setOpenEditDialog(false);
      setEditingInvoice(null);
      resetForm();
      loadInvoices();
    } catch (error: any) {
      console.error("Error updating invoice:", error);
      const errorMessage = error?.response?.data?.message || "Lỗi khi cập nhật hóa đơn";
      showNotification(errorMessage, "error");
    }
  };

  const handleDeleteInvoice = async (invoice: Invoice) => {
    // Không cho phép xóa hóa đơn đã thanh toán
    if (invoice.TrangThai === 'Done') {
      showNotification("Không thể xóa hóa đơn đã thanh toán", "warning");
      return;
    }
    setDeleteConfirm(invoice);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    
    try {
      console.log("Deleting invoice:", deleteConfirm.MaHD);
      await cashierAPI.deleteHoaDon(deleteConfirm.MaHD);
      showNotification("Xóa hóa đơn thành công", "success");
      setDeleteConfirm(null);
      loadInvoices();
    } catch (error: any) {
      console.error("Error deleting invoice:", error);
      const errorMessage = error?.response?.data?.message || "Lỗi khi xóa hóa đơn";
      showNotification(errorMessage, "error");
      setDeleteConfirm(null);
    }
  };

  const resetForm = () => {
    setFormData({
      NgayTao: new Date().toISOString().split('T')[0],
      TongTien: "",
      TrangThai: 'Pending', // Mặc định là chờ thanh toán khi tạo mới
      PhuongThucThanhToan: 'TienMat',
      LoaiHoaDon: 'KhamBenh',
      MaBN: ""
    });
  };

  const handleEdit = (invoice: Invoice) => {
    // Không cho phép sửa hóa đơn đã thanh toán
    if (invoice.TrangThai === 'Done') {
      showNotification("Không thể sửa hóa đơn đã thanh toán", "warning");
      return;
    }
    
    setEditingInvoice(invoice);
    setFormData({
      NgayTao: invoice.NgayTao ? invoice.NgayTao.split('T')[0] : new Date().toISOString().split('T')[0],
      TongTien: invoice.TongTien?.toString() || "",
      TrangThai: invoice.TrangThai || 'Pending',
      PhuongThucThanhToan: invoice.PhuongThucThanhToan || 'TienMat',
      LoaiHoaDon: invoice.LoaiHoaDon || 'KhamBenh',
      MaBN: invoice.MaBN || ""
    });
    setOpenEditDialog(true);
  };

  const handleOpenDialog = (invoice?: Invoice) => {
    if (invoice) {
      handleEdit(invoice);
    } else {
      setEditingInvoice(null);
      resetForm();
      setOpenNewDialog(true);
    }
  };

  const showNotification = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusChip = (status: 'Pending' | 'Done') => {
    const config = {
      'Pending': { label: 'Chờ thanh toán', color: 'warning' as const },
      'Done': { label: 'Đã thanh toán', color: 'success' as const }
    };
    
    const { label, color } = config[status];
    return (
      <Chip 
        label={label}
        color={color}
        size="small"
        sx={{ fontWeight: 500 }}
      />
    );
  };

  const getPaymentMethodIcon = (method: 'TienMat' | 'MoMo') => {
    const icons = {
      "TienMat": <Money sx={{ fontSize: 20 }} />,
      "MoMo": <Payment sx={{ fontSize: 20 }} />
    };
    return icons[method] || <AttachMoney sx={{ fontSize: 20 }} />;
  };

  const getPaymentMethodLabel = (method: 'TienMat' | 'MoMo') => {
    const labels = {
      "TienMat": "Tiền mặt",
      "MoMo": "MoMo"
    };
    return labels[method] || method;
  };

  const getLoaiHoaDonLabel = (loai: 'NhapVien' | 'XuatVien' | 'DichVu' | 'KhamBenh' | 'ToaThuoc' | undefined) => {
    const labels = {
      'NhapVien': 'Nhập viện',
      'XuatVien': 'Xuất viện', 
      'DichVu': 'Dịch vụ',
      'KhamBenh': 'Khám bệnh',
      'ToaThuoc': 'Toa thuốc'
    };
    return labels[loai || 'KhamBenh'];
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700, mb: 1 }}>
          Thu tiền viện phí
        </Typography>
        <Typography variant="body1" sx={{ color: "#5f6c7b" }}>
          Quản lý và thu tiền hóa đơn viện phí
        </Typography>
      </Box>

      {/* Medical Form Search Section */}
      <Card sx={{ borderRadius: 3, mb: 4, border: "2px solid #e3f2fd" }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: "#094067", fontWeight: 600, mb: 2 }}>
            Tra cứu phiếu yêu cầu để tạo hóa đơn
          </Typography>
          
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Mã số phiếu yêu cầu"
                placeholder="Nhập mã phiếu (VD: PYC001)"
                value={medicalFormId}
                onChange={(e) => setMedicalFormId(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchMedicalForm();
                  }
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleSearchMedicalForm}
                disabled={loadingMedicalForm}
                sx={{
                  bgcolor: "#3da9fc",
                  "&:hover": { bgcolor: "#2d7dd2" },
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  py: 1.5
                }}
              >
                {loadingMedicalForm ? "Đang tìm..." : "Tra cứu phiếu"}
              </Button>
            </Grid>
            {searchedMedicalForm && searchedMedicalForm.TrangThai === 'Pending' && (
              <Grid item xs={12} md={5}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Receipt />}
                  onClick={handleCreateInvoiceFromMedicalForm}
                  sx={{
                    bgcolor: "#4caf50",
                    "&:hover": { bgcolor: "#45a049" },
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    py: 1.5
                  }}
                >
                  Tạo hóa đơn từ phiếu này
                </Button>
              </Grid>
            )}
          </Grid>

          {/* Medical Form Details */}
          {searchedMedicalForm && (
            <Box mt={3} p={3} sx={{ 
              bgcolor: "#f8f9fa", 
              borderRadius: 2, 
              border: "1px solid #dee2e6" 
            }}>
              <Typography variant="h6" sx={{ color: "#094067", fontWeight: 600, mb: 2 }}>
                Thông tin phiếu yêu cầu
              </Typography>
              
              {/* Cảnh báo nếu phiếu không thể tạo hóa đơn */}
              {searchedMedicalForm.TrangThai !== 'Pending' && (
                <Box mb={2} p={2} sx={{ 
                  bgcolor: "#fff3cd", 
                  borderRadius: 1, 
                  border: "1px solid #ffeaa7" 
                }}>
                  <Typography variant="body2" sx={{ color: "#856404", fontWeight: 600 }}>
                    ⚠️ Phiếu này không thể tạo hóa đơn vì đã có trạng thái "
                    {searchedMedicalForm.TrangThai === 'Payed' ? 'Đã thanh toán' : 'Hoàn thành'}".
                    Chỉ phiếu có trạng thái "Chờ thanh toán" mới có thể tạo hóa đơn.
                  </Typography>
                </Box>
              )}
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <Box display="flex">
                      <Typography variant="body2" sx={{ fontWeight: 600, minWidth: "140px" }}>
                        Mã phiếu:
                      </Typography>
                      <Typography variant="body2">{searchedMedicalForm.MaPYC}</Typography>
                    </Box>
                    <Box display="flex">
                      <Typography variant="body2" sx={{ fontWeight: 600, minWidth: "140px" }}>
                        Loại phiếu:
                      </Typography>
                      <Typography variant="body2">{getLoaiHoaDonLabel(searchedMedicalForm.Loai as any)}</Typography>
                    </Box>
                    <Box display="flex">
                      <Typography variant="body2" sx={{ fontWeight: 600, minWidth: "140px" }}>
                        Ngày yêu cầu:
                      </Typography>
                      <Typography variant="body2">
                        {new Date(searchedMedicalForm.NgayYeuCau).toLocaleDateString('vi-VN')}
                      </Typography>
                    </Box>
                    <Box display="flex">
                      <Typography variant="body2" sx={{ fontWeight: 600, minWidth: "140px" }}>
                        Trạng thái:
                      </Typography>
                      <Chip 
                        size="small"
                        label={
                          searchedMedicalForm.TrangThai === 'Pending' ? 'Đang chờ' :
                          searchedMedicalForm.TrangThai === 'Payed' ? 'Đã thanh toán' : 'Hoàn thành'
                        }
                        color={
                          searchedMedicalForm.TrangThai === 'Pending' ? 'warning' :
                          searchedMedicalForm.TrangThai === 'Payed' ? 'success' : 'primary'
                        }
                      />
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <Box display="flex">
                      <Typography variant="body2" sx={{ fontWeight: 600, minWidth: "140px" }}>
                        Mã bệnh nhân:
                      </Typography>
                      <Typography variant="body2">{searchedMedicalForm.MaBN}</Typography>
                    </Box>
                    {searchedMedicalForm.BenhNhan && (
                      <Box display="flex">
                        <Typography variant="body2" sx={{ fontWeight: 600, minWidth: "140px" }}>
                          Tên bệnh nhân:
                        </Typography>
                        <Typography variant="body2">{searchedMedicalForm.BenhNhan.HoTen}</Typography>
                      </Box>
                    )}
                    <Box display="flex">
                      <Typography variant="body2" sx={{ fontWeight: 600, minWidth: "140px" }}>
                        Đơn giá:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "#d32f2f" }}>
                        {Number(searchedMedicalForm.DonGia).toLocaleString('vi-VN')} VNĐ
                      </Typography>
                    </Box>
                    {searchedMedicalForm.DichVu && (
                      <Box display="flex">
                        <Typography variant="body2" sx={{ fontWeight: 600, minWidth: "140px" }}>
                          Dịch vụ:
                        </Typography>
                        <Typography variant="body2">{searchedMedicalForm.DichVu.TenDichVu}</Typography>
                      </Box>
                    )}
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Prescription Search Section */}
      <Card sx={{ borderRadius: 3, mb: 4, border: "2px solid #e8f5e8" }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: "#094067", fontWeight: 600, mb: 2 }}>
            Tra cứu toa thuốc để tạo hóa đơn
          </Typography>
          
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Mã toa thuốc"
                placeholder="Nhập mã toa thuốc (VD: TT001)"
                value={prescriptionId}
                onChange={(e) => setPrescriptionId(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchPrescription();
                  }
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleSearchPrescription}
                disabled={loadingPrescription}
                sx={{
                  bgcolor: "#2e7d32",
                  "&:hover": { bgcolor: "#1b5e20" },
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  py: 1.5
                }}
              >
                {loadingPrescription ? "Đang tìm..." : "Tra cứu toa thuốc"}
              </Button>
            </Grid>
            {searchedPrescription && searchedPrescription.TrangThai === 'Pending' && (
              <Grid item xs={12} md={5}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Receipt />}
                  onClick={handleCreateInvoiceFromPrescription}
                  sx={{
                    bgcolor: "#388e3c",
                    "&:hover": { bgcolor: "#2e7d32" },
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    py: 1.5
                  }}
                >
                  Tạo hóa đơn từ toa thuốc này
                </Button>
              </Grid>
            )}
          </Grid>

          {/* Prescription Details */}
          {searchedPrescription && (
            <Box mt={3} p={3} sx={{ 
              bgcolor: "#f1f8e9", 
              borderRadius: 2, 
              border: "1px solid #c8e6c9" 
            }}>
              <Typography variant="h6" sx={{ color: "#094067", fontWeight: 600, mb: 2 }}>
                Thông tin toa thuốc
              </Typography>
              
              {/* Cảnh báo nếu toa thuốc không thể tạo hóa đơn */}
              {searchedPrescription.TrangThai !== 'Pending' && (
                <Box mb={2} p={2} sx={{ 
                  bgcolor: "#fff3cd", 
                  borderRadius: 1, 
                  border: "1px solid #ffeaa7" 
                }}>
                  <Typography variant="body2" sx={{ color: "#856404", fontWeight: 600 }}>
                    ⚠️ Toa thuốc này không thể tạo hóa đơn vì đã có trạng thái "
                    {searchedPrescription.TrangThai === 'Payed' ? 'Đã thanh toán' : 'Hoàn thành'}".
                    Chỉ toa thuốc có trạng thái "Chờ thanh toán" mới có thể tạo hóa đơn.
                  </Typography>
                </Box>
              )}
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <Box display="flex">
                      <Typography variant="body2" sx={{ fontWeight: 600, minWidth: "140px" }}>
                        Mã toa thuốc:
                      </Typography>
                      <Typography variant="body2">{searchedPrescription.MaToaThuoc}</Typography>
                    </Box>
                    <Box display="flex">
                      <Typography variant="body2" sx={{ fontWeight: 600, minWidth: "140px" }}>
                        Ngày kê:
                      </Typography>
                      <Typography variant="body2">
                        {new Date(searchedPrescription.NgayKe).toLocaleDateString('vi-VN')}
                      </Typography>
                    </Box>
                    <Box display="flex">
                      <Typography variant="body2" sx={{ fontWeight: 600, minWidth: "140px" }}>
                        Trạng thái:
                      </Typography>
                      <Chip 
                        size="small"
                        label={
                          searchedPrescription.TrangThai === 'Pending' ? 'Đang chờ' :
                          searchedPrescription.TrangThai === 'Payed' ? 'Đã thanh toán' : 'Hoàn thành'
                        }
                        color={
                          searchedPrescription.TrangThai === 'Pending' ? 'warning' :
                          searchedPrescription.TrangThai === 'Payed' ? 'success' : 'primary'
                        }
                      />
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <Box display="flex">
                      <Typography variant="body2" sx={{ fontWeight: 600, minWidth: "140px" }}>
                        Mã bệnh nhân:
                      </Typography>
                      <Typography variant="body2">{searchedPrescription.MaBN}</Typography>
                    </Box>
                    {searchedPrescription.BenhNhan && (
                      <Box display="flex">
                        <Typography variant="body2" sx={{ fontWeight: 600, minWidth: "140px" }}>
                          Tên bệnh nhân:
                        </Typography>
                        <Typography variant="body2">{searchedPrescription.BenhNhan.HoTen}</Typography>
                      </Box>
                    )}
                    <Box display="flex">
                      <Typography variant="body2" sx={{ fontWeight: 600, minWidth: "140px" }}>
                        Tổng tiền:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "#d32f2f" }}>
                        {(searchedPrescription.ChiTietToaThuoc?.reduce((total, detail) => 
                          total + (Number(detail.DonGia) * detail.SoLuong), 0) || 0
                        ).toLocaleString('vi-VN')} VNĐ
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>

              {/* Prescription Medicine Details */}
              {searchedPrescription.ChiTietToaThuoc && searchedPrescription.ChiTietToaThuoc.length > 0 && (
                <Box mt={3}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: "#094067" }}>
                    Chi tiết thuốc trong toa:
                  </Typography>
                  <TableContainer sx={{ bgcolor: "white", borderRadius: 1 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                          <TableCell sx={{ fontWeight: 600 }}>Tên thuốc</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Số lượng</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Liều lượng</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Đơn giá</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Thành tiền</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {searchedPrescription.ChiTietToaThuoc.map((detail, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              {detail.Thuoc?.TenThuoc || `Thuốc ${detail.MaThuoc}`}
                            </TableCell>
                            <TableCell>{detail.SoLuong}</TableCell>
                            <TableCell>{detail.LieuLuong}</TableCell>
                            <TableCell>
                              {Number(detail.DonGia).toLocaleString('vi-VN')} VNĐ
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>
                              {(Number(detail.DonGia) * detail.SoLuong).toLocaleString('vi-VN')} VNĐ
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={3}>
          <Card sx={{ borderRadius: 3, borderLeft: "4px solid #3da9fc" }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Receipt sx={{ fontSize: 40, color: "#3da9fc" }} />
                <Box>
                  <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                    {invoices?.length || 0}
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Tổng hóa đơn
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
                <Payment sx={{ fontSize: 40, color: "#ffc107" }} />
                <Box>
                  <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                    {invoices?.filter(inv => inv.TrangThai === "Pending").length || 0}
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Chờ thanh toán
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
                <Money sx={{ fontSize: 40, color: "#28a745" }} />
                <Box>
                  <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                    {invoices?.filter(inv => inv.TrangThai === "Done").length || 0}
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Đã thanh toán
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
                <AttachMoney sx={{ fontSize: 40, color: "#17a2b8" }} />
                <Box>
                  <Typography variant="h4" sx={{ color: "#094067", fontWeight: 700 }}>
                    {((invoices?.filter(inv => inv.TrangThai === "Done").reduce((sum, inv) => sum + Number(inv.TongTien), 0) || 0) / 1000000).toFixed(1)}M
                  </Typography>
                  <Typography variant="body2" color="#5f6c7b">
                    Tổng doanh thu
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Actions */}
      <Card sx={{ borderRadius: 3, boxShadow: "0 8px 32px rgba(9, 64, 103, 0.15)", mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" sx={{ color: "#094067", fontWeight: 600 }}>
              Quản lý hóa đơn
            </Typography>
          </Box>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Tìm kiếm theo mã hóa đơn, mã bệnh nhân hoặc tên bệnh nhân..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={statusFilter}
                  label="Trạng thái"
                  onChange={(e) => setStatusFilter(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="Pending">Chờ thanh toán</MenuItem>
                  <MenuItem value="Done">Đã thanh toán</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card sx={{ borderRadius: 3, boxShadow: "0 8px 32px rgba(9, 64, 103, 0.15)" }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: "#094067", fontWeight: 600, mb: 3 }}>
            Danh sách hóa đơn ({filteredInvoices?.length || 0})
          </Typography>
          
          {loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <Typography>Đang tải dữ liệu...</Typography>
            </Box>
          ) : (
            <>
              <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                  <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Mã hóa đơn</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Bệnh nhân</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Ngày tạo</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Loại hóa đơn</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Tổng tiền</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Thanh toán</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Trạng thái</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#094067" }}>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(filteredInvoices || []).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((invoice) => (
                  <TableRow key={invoice.MaHD} hover>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ color: "#094067", fontWeight: 600 }}>
                        {invoice.MaHD}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="#5f6c7b">
                        {patientInfo[invoice.MaBN]?.HoTen || 'Đang tải...'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Mã BN: {invoice.MaBN}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="#5f6c7b">
                        {new Date(invoice.NgayTao).toLocaleDateString('vi-VN')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getLoaiHoaDonLabel(invoice.LoaiHoaDon)}
                        size="small"
                        sx={{
                          bgcolor: invoice.LoaiHoaDon === "KhamBenh" ? "#e3f2fd" : 
                                  invoice.LoaiHoaDon === "ToaThuoc" ? "#e8f5e8" : 
                                  invoice.LoaiHoaDon === "DichVu" ? "#fff3e0" : "#f3e5f5",
                          color: invoice.LoaiHoaDon === "KhamBenh" ? "#1976d2" : 
                                 invoice.LoaiHoaDon === "ToaThuoc" ? "#388e3c" : 
                                 invoice.LoaiHoaDon === "DichVu" ? "#f57c00" : "#7b1fa2"
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: "#094067", fontWeight: 600 }}>
                        {Number(invoice.TongTien).toLocaleString('vi-VN')} VNĐ
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        {getPaymentMethodIcon(invoice.PhuongThucThanhToan)}
                        <Typography variant="body2" color="#5f6c7b">
                          {getPaymentMethodLabel(invoice.PhuongThucThanhToan)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{getStatusChip(invoice.TrangThai)}</TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Button
                          size="small"
                          startIcon={<Visibility />}
                          onClick={() => {
                            setSelectedInvoice(invoice);
                            setOpenViewDialog(true);
                          }}
                          sx={{ color: "#3da9fc" }}
                        >
                          Xem
                        </Button>
                        <Button
                          size="small"
                          startIcon={<Print />}
                          onClick={() => handlePrintInvoice(invoice)}
                          sx={{ color: "#4caf50" }}
                        >
                          In
                        </Button>
                        <Button
                          size="small"
                          startIcon={<Edit />}
                          onClick={() => handleOpenDialog(invoice)}
                          disabled={invoice.TrangThai === 'Done'}
                          sx={{ 
                            color: invoice.TrangThai === 'Done' ? "#bdbdbd" : "#f57c00",
                            "&:disabled": {
                              color: "#bdbdbd"
                            }
                          }}
                          title={invoice.TrangThai === 'Done' ? "Không thể sửa hóa đơn đã thanh toán" : ""}
                        >
                          Sửa
                        </Button>
                        <Button
                          size="small"
                          startIcon={<Delete />}
                          onClick={() => handleDeleteInvoice(invoice)}
                          disabled={invoice.TrangThai === 'Done'}
                          sx={{ 
                            color: invoice.TrangThai === 'Done' ? "#bdbdbd" : "#ef4565",
                            "&:disabled": {
                              color: "#bdbdbd"
                            }
                          }}
                          title={invoice.TrangThai === 'Done' ? "Không thể xóa hóa đơn đã thanh toán" : ""}
                        >
                          Xóa
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredInvoices?.length || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Số dòng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) => 
              `${from}–${to} của ${count !== -1 ? count : `hơn ${to}`}`
            }
          />
            </>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Invoice Dialog */}
      <Dialog 
        open={openNewDialog || openEditDialog} 
        onClose={() => {
          setOpenNewDialog(false);
          setOpenEditDialog(false);
          setEditingInvoice(null);
          resetForm();
        }} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle sx={{ color: "#094067", fontWeight: 600 }}>
          {editingInvoice ? "Sửa hóa đơn" : "Thêm hóa đơn mới"}
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <FormControl fullWidth required>
              <InputLabel>Chọn bệnh nhân</InputLabel>
              <Select
                value={formData.MaBN}
                label="Chọn bệnh nhân"
                onChange={(e) => setFormData({ ...formData, MaBN: e.target.value })}
                disabled={!!editingInvoice} // Không cho phép thay đổi bệnh nhân khi sửa hóa đơn
              >
                {patients.map((patient) => (
                  <MenuItem key={patient.MaBN} value={patient.MaBN}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {patient.HoTen}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Mã BN: {patient.MaBN} - SĐT: {patient.SoDienThoai}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Ngày tạo"
              type="date"
              value={formData.NgayTao}
              onChange={(e) => setFormData({ ...formData, NgayTao: e.target.value })}
              required
              InputLabelProps={{ shrink: true }}
            />

            <FormControl fullWidth required>
              <InputLabel>Loại hóa đơn</InputLabel>
              <Select
                value={formData.LoaiHoaDon}
                label="Loại hóa đơn"
                onChange={(e) => setFormData({ ...formData, LoaiHoaDon: e.target.value as any })}
                disabled={!!editingInvoice} // Không cho phép thay đổi loại hóa đơn khi sửa
              >
                <MenuItem value="KhamBenh">Khám bệnh</MenuItem>
                <MenuItem value="ToaThuoc">Toa thuốc</MenuItem>
                <MenuItem value="DichVu">Dịch vụ</MenuItem>
                <MenuItem value="NhapVien">Nhập viện</MenuItem>
                <MenuItem value="XuatVien">Xuất viện</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Tổng tiền"
              type="number"
              value={formData.TongTien}
              onChange={(e) => setFormData({ ...formData, TongTien: e.target.value })}
              required
              placeholder="Nhập tổng tiền"
              disabled={!!editingInvoice} // Không cho phép thay đổi tổng tiền khi sửa hóa đơn
              InputProps={{
                endAdornment: <Typography variant="body2" color="text.secondary">VNĐ</Typography>
              }}
            />

            <FormControl fullWidth required>
              <InputLabel>Phương thức thanh toán</InputLabel>
              <Select
                value={formData.PhuongThucThanhToan}
                label="Phương thức thanh toán"
                onChange={(e) => setFormData({ ...formData, PhuongThucThanhToan: e.target.value as any })}
              >
                <MenuItem value="TienMat">
                  <Box display="flex" alignItems="center" gap={1}>
                    <Money sx={{ fontSize: 20 }} />
                    Tiền mặt
                  </Box>
                </MenuItem>
                <MenuItem value="MoMo">
                  <Box display="flex" alignItems="center" gap={1}>
                    <Payment sx={{ fontSize: 20 }} />
                    MoMo
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth required>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={formData.TrangThai}
                label="Trạng thái"
                onChange={(e) => setFormData({ ...formData, TrangThai: e.target.value as any })}
                disabled={!editingInvoice} // Chỉ cho phép thay đổi khi sửa hóa đơn
              >
                <MenuItem value="Pending">Chờ thanh toán</MenuItem>
                {editingInvoice && <MenuItem value="Done">Đã thanh toán</MenuItem>}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => {
              setOpenNewDialog(false);
              setOpenEditDialog(false);
              setEditingInvoice(null);
              resetForm();
            }} 
            color="inherit"
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={editingInvoice ? handleUpdateInvoice : handleCreateInvoice}
            sx={{
              bgcolor: "#3da9fc",
              "&:hover": { bgcolor: "#2d7dd2" }
            }}
          >
            {editingInvoice ? "Cập nhật" : "Thêm mới"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Invoice Dialog */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: "#094067", fontWeight: 600 }}>
          Chi tiết hóa đơn #{selectedInvoice?.MaHD}
        </DialogTitle>
        <DialogContent dividers>
          {selectedInvoice && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="#5f6c7b">Mã hóa đơn:</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
                  {selectedInvoice.MaHD}
                </Typography>
                
                <Typography variant="subtitle2" color="#5f6c7b">Bệnh nhân:</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                  {patientInfo[selectedInvoice.MaBN]?.HoTen || 'Đang tải...'}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                  Mã BN: {selectedInvoice.MaBN}
                </Typography>
                
                <Typography variant="subtitle2" color="#5f6c7b">Ngày tạo:</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
                  {new Date(selectedInvoice.NgayTao).toLocaleDateString('vi-VN')}
                </Typography>
                
                <Typography variant="subtitle2" color="#5f6c7b">Loại hóa đơn:</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
                  {getLoaiHoaDonLabel(selectedInvoice.LoaiHoaDon)}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="#5f6c7b">Tổng tiền:</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 2, color: "#094067" }}>
                  {Number(selectedInvoice.TongTien).toLocaleString('vi-VN')} VNĐ
                </Typography>
                
                <Typography variant="subtitle2" color="#5f6c7b">Phương thức thanh toán:</Typography>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  {getPaymentMethodIcon(selectedInvoice.PhuongThucThanhToan)}
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {getPaymentMethodLabel(selectedInvoice.PhuongThucThanhToan)}
                  </Typography>
                </Box>
                
                <Typography variant="subtitle2" color="#5f6c7b">Trạng thái:</Typography>
                <Box sx={{ mb: 2 }}>
                  {getStatusChip(selectedInvoice.TrangThai)}
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenViewDialog(false)} color="inherit">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ color: "#094067", fontWeight: 600 }}>
          Xác nhận xóa
        </DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa hóa đơn <strong>{deleteConfirm?.MaHD}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDeleteConfirm(null)} color="inherit">
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={confirmDelete}
            sx={{
              bgcolor: "#ef4565",
              "&:hover": { bgcolor: "#dc3545" }
            }}
          >
            Xóa
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
    </Container>
  );
};

export default CashierInvoices;
