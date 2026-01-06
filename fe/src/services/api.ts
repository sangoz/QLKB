import axiosInstance from "../utils/axiosCustomize";

// Auth Services
export const authAPI = {
  // Patient Auth
  patientLogin: (SDT: string, password: string) => {
    return axiosInstance.post("/api/v1/benhnhan/login", { SDT, password });
  },

  patientRegister: (HoTen:string, DiaChi: string, SDT: string, CCCD: string, Matkhau:string) => {
    return axiosInstance.post("/api/v1/benhnhan/register", {
      HoTen,
      DiaChi,
      SDT,
      CCCD,
      Matkhau
    });
  },
  
  patientLogout: () => {
    return axiosInstance.post("/api/v1/benhnhan/logout");
  },
  
  patientRefreshToken: () => {
    return axiosInstance.get("/api/v1/benhnhan/refresh");
  },
  patientAccount: () => {
    return axiosInstance.get("/api/v1/benhnhan/account");
  },
  patientChangePassword: (SDT: string, oldPassword: string, newPassword: string) => {
    return axiosInstance.post("/api/v1/benhnhan/change-password", {
      SDT,
      oldPassword,
      newPassword
    });
  }, 
  patientUpdateAccount: (MaBN: string, HoTen: string, DiaChi: string, SDT: string, CCCD: string, Matkhau: string, MaPhongBenhId?: string) => {
    return axiosInstance.put(`/api/v1/benhnhan`, {
      HoTen,
      DiaChi,
      SDT,
      CCCD,
      Matkhau,
      MaPhongBenhId
    });
  },
  

  // Employee Auth
  employeeLogin: (SDT: string, password: string) => {
    return axiosInstance.post("/api/v1/nhanvien/login", { SDT, password });
  },
  
  employeeLogout: () => {
    return axiosInstance.post("/api/v1/nhanvien/logout");
  },
  
  employeeRefreshToken: () => {
    return axiosInstance.get("/api/v1/nhanvien/refresh");
  },

  employeeAccount: () => {
    return axiosInstance.get("/api/v1/nhanvien/account");
  },

  employeeChangePassword: (SDT: string, oldPassword: string, newPassword: string) => {
    return axiosInstance.post("/api/v1/nhanvien/change-password", {
      SDT,
      oldPassword,
      newPassword
    });
  },
};

// Patient Services
export const patientAPI = {
  getAccount: () => {
    return axiosInstance.get("/api/v1/benhnhan/account");
  },
  
  updateAccount: (data: any) => {
    return axiosInstance.put("/api/v1/benhnhan", data);
  },
  
  changePassword: (SDT: string, oldPassword: string, newPassword: string) => {
    return axiosInstance.post("/api/v1/benhnhan/change-password", {
      SDT,
      oldPassword,
      newPassword
    });
  },
  
  getAllPatients: () => {
    return axiosInstance.get("/api/v1/benhnhan");
  },
  
  getPatientById: (id: string) => {
    return axiosInstance.get(`/api/v1/benhnhan/${id}`);
  },
  
  updatePatientInfo: (id: string, data: any) => {
    return axiosInstance.put(`/api/v1/benhnhan/${id}`, data);
  },
  
  getPatientsByRoom: (MaPhong: string) => {
    return axiosInstance.get(`/api/v1/benhnhan/phong/${MaPhong}`);
  },
  
  getAppointments: (MaBN: string) => {
    return axiosInstance.get(`/api/v1/chitietdatlich/patient/${MaBN}`);
  },
  
  getInvoices: (MaBN: string) => {
    return axiosInstance.get(`/api/v1/hoadon/patient/${MaBN}`);
  },
  
  getMedicalRecords: (MaBN: string) => {
    return axiosInstance.get(`/api/v1/hosobenhan/patient/${MaBN}`);
  },

  // Get patient by CCCD
  getPatientByCCCD: (cccd: string) => {
    return axiosInstance.get(`/api/v1/benhnhan/cccd/${cccd}`);
  },

  // Discharge patient
  discharge: (data: {
    PatientID: string;
    DischargeDate: string;
  }) => {
    return axiosInstance.post("/api/v1/benhnhan/discharge", data);
  }
};

// Employee Services
export const employeeAPI = {
  getAccount: () => {
    return axiosInstance.get("/api/v1/nhanvien/account");
  },
  
  getList: (LoaiNV?: string) => {
    const params = LoaiNV ? `?LoaiNV=${LoaiNV}` : "";
    return axiosInstance.get(`/api/v1/nhanvien/list${params}`);
  },
  
  addEmployee: (data: any) => {
    return axiosInstance.post("/api/v1/nhanvien/add", data);
  },
  
  updateEmployee: (id: string, data: any) => {
    return axiosInstance.put(`/api/v1/nhanvien/edit/${id}`, data);
  },
  
  deleteEmployee: (id: string) => {
    return axiosInstance.delete(`/api/v1/nhanvien/delete/${id}`);
  },
  
  updateOwnAccount: (data: any) => {
    return axiosInstance.put("/api/v1/nhanvien/edit-account", data);
  },
  
  changePassword: (SDT: string, oldPassword: string, newPassword: string) => {
    return axiosInstance.post("/api/v1/nhanvien/change-password", {
      SDT,
      oldPassword,
      newPassword
    });
  },
  
  // Dedicated doctor endpoint
  getDoctors: () => {
    return axiosInstance.get("/api/v1/nhanvien/bacsi");
  },
  
  getByType: (type: string) => {
    return axiosInstance.get(`/api/v1/nhanvien/byloai/${type}`);
  }
};

// Department Services
export const departmentAPI = {
  getAll: () => {
    return axiosInstance.get("/api/v1/khoa");
  },
  
  getById: (id: string) => {
    return axiosInstance.get(`/api/v1/khoa/${id}`);
  },
  
  create: (data: { TenKhoa: string; MoTa: string }) => {
    return axiosInstance.post("/api/v1/khoa", data);
  },
  
  update: (id: string, data: { TenKhoa: string; MoTa: string }) => {
    return axiosInstance.put(`/api/v1/khoa/${id}`, data);
  },
  
  delete: (id: string) => {
    return axiosInstance.delete(`/api/v1/khoa/${id}`);
  }
};

// Schedule Services
export const scheduleAPI = {

  getByDoctor: (MaNV: string) => {
    return axiosInstance.get(`/api/v1/lich/bacsi/${MaNV}`);
  },

  // Dashboard APIs
  getDoctorTodayStats: (MaNV: string) => {
    return axiosInstance.get(`/api/v1/lich/bacsi/${MaNV}/stats/today`);
  },

  getDoctorTodayAppointments: (MaNV: string) => {
    return axiosInstance.get(`/api/v1/lich/bacsi/${MaNV}/appointments/today`);
  },

  
  getById: (id: string) => {
    return axiosInstance.get(`/api/v1/lich/${id}`);
  },
  
  create: (data: {
    SoBNToiDa: number;
    Ngay: string;
    Buoi: "Sang" | "Chieu";
    Gia: number;
    MaNV: string;
  }) => {
    return axiosInstance.post("/api/v1/lich", data);
  },
  
  update: (id: string, data: any) => {
    return axiosInstance.put(`/api/v1/lich/${id}`, data);
  },
  
  delete: (id: string) => {
    return axiosInstance.delete(`/api/v1/lich/${id}`);
  }
};

// Appointment Services
export const appointmentAPI = {

  getAllDoctors: () => {
    return axiosInstance.get('/api/v1/nhanvien/bacsi');
  },

  getSchedulesByDoctor: (doctorId: string) => {
    return axiosInstance.get(`/api/v1/lich/bacsi/${doctorId}`);
  },
  // Tra cứu khoa theo tên
  searchKhoaByName: (tenKhoa: string) => {
    return axiosInstance.get(`/api/v1/khoa/search?TenKhoa=${encodeURIComponent(tenKhoa)}`);
  },
  
  book: (data: {
    MaLich: string;
    MaBN: string;
    NgayDat: string;
    DonGia: number;
    TrangThai: string;
  }) => {
    return axiosInstance.post("/api/v1/chitietdatlich", data);
  },
  
  
  cancel: (MaLich: string, MaBN: string) => {
    return axiosInstance.delete(`/api/v1/chitietdatlich/${MaLich}/${MaBN}`);
  },

  getByPatient: (MaBN: string) => {
    return axiosInstance.get(`/api/v1/chitietdatlich/benhnhan/${MaBN}`);

  },

  getDoctor: (doctorId: string) => {
    return axiosInstance.get(`/api/v1/nhanvien/${doctorId}`);

  },

  getTotalServicesByPatient: (MaBN: string) => {
    return axiosInstance.get(`/api/v1/phieu/benhnhan/${MaBN}`);
  },

  getKhoaByMaNV : (MaNV: string) => {
    return axiosInstance.get(`/api/v1/nhanvien/${MaNV}/khoa`);
  },

  getNhanVienByMaNV: (MaNV: string) => {
    return axiosInstance.get(`/api/v1/nhanvien/${MaNV}`);
  },

  updateStatus: (MaBN: string, MaLich: string, TrangThai: string) => {
    return axiosInstance.put(`/api/v1/chitietdatlich/${MaBN}/${MaLich}`, {
      TrangThai
    });
  },

  // Cập nhật trạng thái appointment (alternative method for direct API call)
  updateAppointmentStatus: async (MaLich: string, MaBN: string, NgayDat: string, DonGia: string, TrangThai: string) => {
   return axiosInstance.put(`/api/v1/chitietdatlich/${MaBN}/${MaLich}`, {
      MaBN,
      MaLich,
      NgayDat,
      DonGia,
      TrangThai,
      
    });
  }
};


// Medicine Services
export const medicineAPI = {
  getAll: () => {
    return axiosInstance.get("/api/v1/thuoc");
  },
  
  create: (data: any) => {
    return axiosInstance.post("/api/v1/thuoc", data);
  },
  
  update: (id: string, data: any) => {
    return axiosInstance.put(`/api/v1/thuoc/${id}`, data);
  },
  
  delete: (id: string) => {
    return axiosInstance.delete(`/api/v1/thuoc/${id}`);
  }
};

// Room Services
export const roomAPI = {
  getAll: () => {
    return axiosInstance.get("/api/v1/phongbenh");
  },
  //lấy các bệnh nhân trong phòng bệnh
  getPatientsByRoom: (MaPhong: string) => {
    return axiosInstance.get(`/api/v1/benhnhan/${MaPhong}`);
  },

  create: (data: {
    TenPhong: string;
    SoBNHienTai: number;
    SoBNToiDa: number;
    LoaiPhong: "PhongDon" | "PhongDoi" | "PhongBon";
    MaNV: string;
  }) => {
    return axiosInstance.post("/api/v1/phongbenh", data);
  },
  
  update: (id: string, data: any) => {
    return axiosInstance.put(`/api/v1/phongbenh/${id}`, data);
  },
  
  delete: (id: string) => {
    return axiosInstance.delete(`/api/v1/phongbenh/${id}`);
  }

};

// Service Services
export const serviceAPI = {
  getAll: () => {
    return axiosInstance.get("/api/v1/dichvu");
  },
  
  create: (data: {
    TenDichVu: string;
    GiaDichVu: string;
  }) => {
    return axiosInstance.post("/api/v1/dichvu", data);
  },
  
  update: (id: string, data: any) => {
    return axiosInstance.put(`/api/v1/dichvu/${id}`, data);
  },
  
  delete: (id: string) => {
    return axiosInstance.delete(`/api/v1/dichvu/${id}`);
  }
};

// Medical Record Services
export const medicalRecordAPI = {
  getByPatient: (MaBN: string) => {
    return axiosInstance.get(`/api/v1/hosobenhan/benhnhan/${MaBN}`);
  },
  exportExcel: (MaBN: string) => {
    return axiosInstance.get(`/api/v1/hosobenhan/benhnhan/${MaBN}/export-excel`, {
      responseType: 'blob'
    });
  },
  create: (data: {
    TrieuChung: string;
    ChanDoan: string;
    NgayKham: string;
    MaBN: string;
  }) => {
    return axiosInstance.post("/api/v1/hosobenhan", data);
  },
  update: (id: string, data: any) => {
    return axiosInstance.put(`/api/v1/hosobenhan/${id}`, data);
  },
  //lấy danh sách hồ sơ bệnh án
  getAll: () => {
    return axiosInstance.get("/api/v1/hosobenhan");
  },
  //lấy thông tin nhân viên theo mã nhân viên
  getInfoNV: (MaNV: string) => {
    return axiosInstance.get(`/api/v1/nhanvien/${MaNV}`);
  },

  //lấy tên khoa theo mã nhân viên
  getDepartmentNameByMaNV: (MaNV: string) => {
    return axiosInstance.get(`/api/v1/nhanvien/${MaNV}/khoa`);
  },

  // Dashboard APIs
  getRecentDiagnosesByDoctor: (MaNV: string) => {
    return axiosInstance.get(`/api/v1/hosobenhan/bacsi/${MaNV}/recent`);
  }
};

// Invoice Services
export const invoiceAPI = {
  getByPatient: (MaBN: string) => {
    return axiosInstance.get(`/api/v1/hoadon/benhnhan/${MaBN}`);
  },
  
  getAll: () => {
    return axiosInstance.get("/api/v1/hoadon");
  },

  createAutoInvoice: (invoiceData: any) => {
    return axiosInstance.post("/api/v1/hoadon/auto-create", invoiceData);
  },
  
  updateMethod: (MaHD: string, PhuongThucThanhToan: string) => {
    return axiosInstance.put(`/api/v1/hoadon/${MaHD}/phuongthucthanhtoan`, {
      PhuongThucThanhToan
    });
  },

  downloadPDF: (MaHD: string) => {
    return axiosInstance.get(`/api/v1/hoadon/${MaHD}/download-pdf`, {
      responseType: 'blob'
    });
  },
  updateInvoice: (MaHD: string) =>{
    return axiosInstance.put(`/api/v1/hoadon/${MaHD}/trangthai`,
      MaHD
    );
  }
};

// Doctor Services
export const doctorAPI = {
  getDoctors: () => {
    return axiosInstance.get("/api/v1/nhanvien/list?LoaiNV=BacSi");
  },
};

// Medical Forms (Phieu) Services
export const medicalFormAPI = {
  getAll: () => {
    return axiosInstance.get("/api/v1/phieu");
  },
  
  getById: (id: string) => {
    return axiosInstance.get(`/api/v1/phieu/${id}`);
  },
  
  create: (data: {
    NgayYeuCau: string;
    DonGia: string;
    Loai: "NhapVien" | "XuatVien" | "DichVu" | "KhamBenh";
    MaBN: string;
    MaDichVu?: string;
    TrangThai: "Pending" | "Payed" | "Done";
  }) => {
    return axiosInstance.post("/api/v1/phieu", data);
  },
  
  update: (id: string, data: {
    NgayYeuCau: string;
    DonGia: string;
    Loai: "NhapVien" | "XuatVien" | "DichVu" | "KhamBenh";
    MaBN: string;
    MaNV: string;
    MaDichVu?: string;
    TrangThai: "Pending" | "Payed" | "Done";
  }) => {
    return axiosInstance.put(`/api/v1/phieu/${id}`, data);
  },
  
  delete: (id: string) => {
    return axiosInstance.delete(`/api/v1/phieu/${id}`);
  },

  // lấy phiếu theo loai
  getPhieuByLoai: (Loai: string) => {
    return axiosInstance.get(`/api/v1/phieu/loai/${Loai}`);
  },

  getPatientByCCCD: (cccd: string) => {
    return axiosInstance.get(`/api/v1/benhnhan/cccd/${cccd}`);
  }
};

// Prescription Services
export const prescriptionAPI = {
  getAll: () => {
    return axiosInstance.get("/api/v1/toathuoc");
  },
  
  getById: (id: string) => {
    return axiosInstance.get(`/api/v1/toathuoc/${id}`);
  },
  
  create: (data: {
    MaBN: string;
    NgayKe: string;
    TrangThai: "Pending" | "Payed" | "Done";
  }) => {
    return axiosInstance.post("/api/v1/toathuoc", data);
  },
  
  update: (id: string, data: {
    MaBN: string;
    NgayKe: string;
    TrangThai: "Pending" | "Payed" | "Done";
  }) => {
    return axiosInstance.put(`/api/v1/toathuoc/${id}`, data);
  },
  
  delete: (id: string) => {
    return axiosInstance.delete(`/api/v1/toathuoc/${id}`);
  }
};

// Prescription Detail Services
export const prescriptionDetailAPI = {
  getByPrescriptionId: (prescriptionId: string) => {
    return axiosInstance.get(`/api/v1/chitiettoathuoc/prescription/${prescriptionId}`);
  },
  
  create: (data: {
    MaToaThuoc: string;
    MaThuoc: string;
    SoLuong: number;
    LieuDung: string;
    CachDung: string;
  }) => {
    return axiosInstance.post("/api/v1/chitiettoathuoc", data);
  },
  
  update: (id: string, data: {
    SoLuong: number;
    LieuDung: string;
    CachDung: string;
  }) => {
    return axiosInstance.put(`/api/v1/chitiettoathuoc/${id}`, data);
  },
  
  delete: (id: string) => {
    return axiosInstance.delete(`/api/v1/chitiettoathuoc/${id}`);
  }
};

// MoMo Payment Services
export const momoAPI = {
  createPaymentLink: (data: {
    amount: number;
    orderInfo: string;
    extraData?: string;
    maHD?: string;
  }) => {
    return axiosInstance.post("/api/v1/thanhtoanmomo/create-payment", data);
  },
  
  checkTransactionStatus: (orderId: string) => {
    return axiosInstance.get(`/api/v1/thanhtoanmomo/check-status/${orderId}`);
  },
  
  getTransactionsByHoaDon: (maHD: string) => {
    return axiosInstance.get(`/api/v1/thanhtoanmomo/hoadon/${maHD}`);
  },
  
  linkTransactionToHoaDon: (orderId: string, maHD: string) => {
    return axiosInstance.put(`/api/v1/thanhtoanmomo/link/${orderId}`, { maHD });
  }

  
};

// Phieu Services
export const phieuAPI = {
  // Lấy danh sách phiếu theo bệnh nhân
  getPhieuByPatient: (patientId: string) => {
    return axiosInstance.get(`/api/v1/phieu/benhnhan/${patientId}`);
  },

  // Lấy chi tiết phiếu theo ID
  getPhieuById: (phieuId: string) => {
    return axiosInstance.get(`/api/v1/phieu/details/${phieuId}`);
  },

  // Cập nhật phiếu
  updatePhieu: (phieuId: string, data: any) => {
    return axiosInstance.put(`/api/v1/phieu/${phieuId}`, data);
  },

  // Tạo phiếu mới
  createPhieu: (data: any) => {
    return axiosInstance.post(`/api/v1/phieu`, data);
  },

  // Lấy danh sách tất cả phiếu
  getAllPhieu: () => {
    return axiosInstance.get(`/api/v1/phieu`);
  }
};


