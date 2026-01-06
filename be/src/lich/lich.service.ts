import { BadRequestException, Injectable, Inject, forwardRef } from '@nestjs/common';
import { CreateLichDto } from './dto/Create-update.dto';
import { BuoiKham } from './entity/lich.entity';
import { LichRepository } from './lich.repository';
import { NhanvienRepository } from 'src/nhanvien/nhanvien.repository';
import { HoadonRepository } from 'src/hoadon/hoadon.repository';
import { BenhnhanRepository } from 'src/benhnhan/benhnhan.repository';
import { ChitietdatlichRepository } from 'src/chitietdatlich/chitietdatlich.repository';

@Injectable()
export class LichService {
    constructor(private readonly lichRepository: LichRepository,
        private readonly nhanVienRepository: NhanvienRepository,
        private readonly hoadonRepository: HoadonRepository,
        private readonly benhnhanRepository: BenhnhanRepository,
        @Inject(forwardRef(() => ChitietdatlichRepository))
        private readonly chitietdatlichRepository: ChitietdatlichRepository
    ) {}

    createLich = async (createLichDto: CreateLichDto) => {
        const { SoBNHienTai, SoBNToiDa, Ngay, Buoi, MaNV } = createLichDto;
        const IsBacSi = await this.nhanVienRepository.findByMaNV(MaNV);
        if (!IsBacSi) {
            throw new BadRequestException('Mã nhân viên không hợp lệ');
        }
        if (IsBacSi.LoaiNV !== 'BacSi') {
            throw new BadRequestException('Chỉ bác sĩ mới có thể được gán lịch khám');
        }
        if (SoBNHienTai > SoBNToiDa) {
            throw new BadRequestException('Số bệnh nhân hiện tại không được lớn hơn số bệnh nhân tối đa');
        }
        if (Ngay < new Date()) {
            throw new BadRequestException('Ngày không được nhỏ hơn ngày hiện tại');
        }
        // if (Buoi === BuoiKham.SANG && Ngay.getHours() >= 12) {
        //     throw new BadRequestException('Buổi khám sáng không được chọn sau 12 giờ trưa');
        // } else if (Buoi === BuoiKham.CHIEU && Ngay.getHours() < 12) {
        //     throw new BadRequestException('Buổi khám chiều phải được chọn sau 12 giờ trưa');
        // }
        return await this.lichRepository.createLich(createLichDto);
    }

    updateLich = async (MaLich: string, updateLichDto: CreateLichDto) => {
        const { SoBNHienTai, SoBNToiDa, Ngay, Buoi, Gia } = updateLichDto;
        const lich = await this.lichRepository.findLichById(MaLich);
        if (!lich) {
            throw new BadRequestException('Lịch khám không tồn tại');
        }
        if (SoBNHienTai > SoBNToiDa) {
            throw new BadRequestException('Số bệnh nhân hiện tại không được lớn hơn số bệnh nhân tối đa');
        }
        if (Ngay < new Date()) {
            throw new BadRequestException('Ngày không được nhỏ hơn ngày hiện tại');
        }
        // if (Buoi === BuoiKham.SANG && Ngay.getHours() >= 12) {
        //     throw new BadRequestException('Buổi khám sáng không được chọn sau 12 giờ trưa');
        // } else if (Buoi === BuoiKham.CHIEU && Ngay.getHours() < 12) {
        //     throw new BadRequestException('Buổi khám chiều phải được chọn sau 12 giờ trưa');
        // }
        if (lich.MaNV !== updateLichDto.MaNV) {
            const IsBacSi = await this.nhanVienRepository.findByMaNV(updateLichDto.MaNV);
            if (!IsBacSi) {
                throw new BadRequestException('Mã nhân viên không hợp lệ');
            }
            if (IsBacSi.LoaiNV !== 'BacSi') {
                throw new BadRequestException('Chỉ bác sĩ mới có thể được gán lịch khám');
            }
            const TimeExisting = await this.lichRepository.findLichByTime(updateLichDto.MaNV, updateLichDto.Ngay, updateLichDto.Buoi as any);
            if (TimeExisting) {
                throw new BadRequestException('Thời gian đã có lịch khám');
            }
        }
        return await this.lichRepository.updateLich(MaLich, updateLichDto);
    }

    xoaLich = async (MaLich: string) => {
        const lich = await this.lichRepository.findLichById(MaLich);
        if (!lich) {
            throw new BadRequestException('Lịch khám không tồn tại');
        }
        if (lich.SoBNHienTai > 0) {
            throw new BadRequestException('Không thể xóa lịch khám đã có bệnh nhân đăng ký');
        }
        
        await this.lichRepository.deleteLich(MaLich);
        return "Xóa lịch khám thành công";
    }

    getLichByBacSi = async (MaNV: string) => {
        const isBacSi = await this.nhanVienRepository.findByMaNV(MaNV);
        if (!isBacSi) {
            throw new BadRequestException('Mã nhân viên không hợp lệ');
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set thành 0h cho buổi sáng
        
        const lichList = await this.lichRepository.findLichByBacSiToday(MaNV, today);
        return lichList;
    }

    getAllLich = async () => {
        const lichList = await this.lichRepository.findAllLich();
        return lichList;
    }

    // Method to get schedule by ID
    getLichById = async (MaLich: string) => {
        const lich = await this.lichRepository.findLichById(MaLich);
        if (!lich) {
            throw new BadRequestException('Lịch khám không tồn tại');
        }
        return lich;
    }

    // Method to check invoice and appointment
    checkInvoiceAndAppointment = async (MaHD: string) => {
        // 1. Get invoice by ID
        const hoadon = await this.hoadonRepository.findByMaHD(MaHD);
        if (!hoadon) {
            throw new BadRequestException('Hóa đơn không tồn tại');
        }

        // 2. Get patient ID from invoice
        const MaBN = hoadon.MaBN;
        
        // 3. Get patient info
        const benhnhan = await this.benhnhanRepository.findByMaBN(MaBN);
        if (!benhnhan) {
            throw new BadRequestException('Bệnh nhân không tồn tại');
        }

        // 4. Check if patient has made any appointments 
        const appointments = await this.chitietdatlichRepository.findByMaBN(MaBN);
        
        // 5. Get current date in UTC+0 timezone
        const today = new Date();
        const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
        
        // 6. Check for appointments today
        let todayAppointments = [];
        let hasTodayAppointment = false;
        
        if (appointments && appointments.length > 0) {
            // Get schedule details for each appointment to check dates
            for (const appointment of appointments) {
                try {
                    const lich = await this.lichRepository.findLichById(appointment.MaLich);
                    if (lich) {
                        const lichDate = new Date(lich.Ngay);
                        const lichDateUTC = new Date(Date.UTC(lichDate.getUTCFullYear(), lichDate.getUTCMonth(), lichDate.getUTCDate()));
                        
                        // Check if appointment is today (compare UTC dates)
                        if (lichDateUTC.getTime() === todayUTC.getTime()) {
                            todayAppointments.push({
                                ...appointment,
                                lich: lich
                            });
                            hasTodayAppointment = true;
                        }
                    }
                } catch (error) {
                    console.error(`Error fetching schedule ${appointment.MaLich}:`, error);
                }
            }
        }
        
        const result = {
            hoadon,
            benhnhan,
            appointments,
            hasAppointments: appointments && appointments.length > 0,
            totalAppointments: appointments ? appointments.length : 0,
            todayAppointments,
            hasTodayAppointment,
            totalTodayAppointments: todayAppointments.length,
            currentDate: todayUTC.toISOString().split('T')[0] // YYYY-MM-DD format in UTC
        };

        return result;
    }

    getLichStats = async () => {
        return await this.lichRepository.getLichStats();
    }

    getDoctorTodayStats = async (MaNV: string) => {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

        // Lấy lịch khám hôm nay của bác sĩ
        const todaySchedules = await this.lichRepository.findLichByBacSiAndDateRange(MaNV, startOfDay, endOfDay);
        
        // Tính tổng số bệnh nhân đã đặt lịch hôm nay
        const scheduledPatients = todaySchedules.reduce((sum, schedule) => sum + schedule.SoBNHienTai, 0);
        
        // Lấy chi tiết đặt lịch để tính số bệnh nhân đã khám và chờ khám
        let completedExams = 0;
        let pendingExams = 0;
        
        for (const schedule of todaySchedules) {
            const appointments = await this.chitietdatlichRepository.findByMaLich(schedule.MaLich);
            completedExams += appointments.filter(apt => apt.TrangThai === 'Done').length;
            pendingExams += appointments.filter(apt => apt.TrangThai === 'Accept' || apt.TrangThai === 'Pending').length;
        }

        // Tính tổng doanh thu hôm nay
        const totalRevenue = todaySchedules.reduce((sum, schedule) => 
            sum + (parseFloat(schedule.Gia.toString()) * schedule.SoBNHienTai), 0
        );

        return {
            scheduledPatients,
            completedExams,
            pendingExams,
            totalWorkHours: 8, // Có thể tính toán dựa trên buổi sáng/chiều
            totalRevenue,
            todaySchedulesCount: todaySchedules.length
        };
    }

    getDoctorTodayAppointments = async (MaNV: string) => {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

        // Lấy lịch khám hôm nay của bác sĩ
        const todaySchedules = await this.lichRepository.findLichByBacSiAndDateRange(MaNV, startOfDay, endOfDay);
        
        const appointments = [];
        
        for (const schedule of todaySchedules) {
            const chitietList = await this.chitietdatlichRepository.findByMaLich(schedule.MaLich);
            
            for (const chitiet of chitietList) {
                const benhNhan = await this.benhnhanRepository.findByMaBN(chitiet.MaBN);
                const nhanVien = await this.nhanVienRepository.findByMaNV(MaNV);
                
                appointments.push({
                    MaLich: schedule.MaLich,
                    MaBN: chitiet.MaBN,
                    NgayDat: chitiet.NgayDat,
                    TrangThai: chitiet.TrangThai,
                    DonGia: chitiet.DonGia,
                    BenhNhan: {
                        HoTen: benhNhan?.HoTen || 'N/A',
                        SDT: benhNhan?.SDT || 'N/A'
                    },
                    Lich: {
                        Ngay: schedule.Ngay,
                        Buoi: schedule.Buoi,
                        ThoiGianBatDau: schedule.Buoi === 'Sang' ? '08:00' : '13:00',
                        ThoiGianKetThuc: schedule.Buoi === 'Sang' ? '12:00' : '17:00',
                        Gia: schedule.Gia,
                        Khoa: nhanVien?.MaKhoaId ? { TenKhoa: nhanVien.MaKhoaId } : null
                    }
                });
            }
        }

        return appointments.sort((a, b) => 
            new Date(a.Lich.ThoiGianBatDau).getTime() - new Date(b.Lich.ThoiGianBatDau).getTime()
        );
    }

}
