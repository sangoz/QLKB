import { BadRequestException, Injectable } from '@nestjs/common';
import { PhieuRepository } from './phieu.repository';
import { BenhnhanRepository } from 'src/benhnhan/benhnhan.repository';
import { DichvuRepository } from 'src/dichvu/dichvu.repository';
import { LoaiPhieu } from './entity/phieu.entity';
import { PhieuPdfService } from './phieu-pdf.service';
import { NhanvienRepository } from 'src/nhanvien/nhanvien.repository';
import { LoaiNhanVien } from 'src/nhanvien/entity/nhanvien.entity';

@Injectable()
export class PhieuService {
    constructor(private readonly phieuRepository: PhieuRepository,
        private readonly benhNhanRepository: BenhnhanRepository,
        private readonly dichVuRepository: DichvuRepository,
        private readonly phieuPdfService: PhieuPdfService,
        private readonly nhanVienRepository: NhanvienRepository,
    ) {}

    async createPhieu(maNV: string, body: any) {
        const ExitBenhNhan = await this.benhNhanRepository.findByMaBN(body.MaBN);
        if (!ExitBenhNhan) {
            throw new BadRequestException('Bệnh nhân không tồn tại');
        }

        if (body.Loai === LoaiPhieu.DichVu) {
            const ExitDichVu = await this.dichVuRepository.findByMaDichVu(body.MaDichVu);
            if (!ExitDichVu) {
                throw new BadRequestException('Dịch vụ không tồn tại');
            }
        }

        return this.phieuRepository.createPhieu(maNV, body);
    }

    async createPhieuWithPdf(maNV: string, body: any) {
        // Tạo phiếu
        const createdPhieu = await this.createPhieu(maNV, body);
        
        // Lấy thông tin bệnh nhân
        const benhNhan = await this.benhNhanRepository.findByMaBN(body.MaBN);
        
        // Lấy thông tin dịch vụ nếu có
        let dichVu = null;
        if (body.Loai === LoaiPhieu.DichVu && body.MaDichVu) {
            dichVu = await this.dichVuRepository.findByMaDichVu(body.MaDichVu);
        }

        // Tạo PDF
        const pdfBuffer = await this.phieuPdfService.generatePhieuPdf(
            createdPhieu, 
            benhNhan, 
            { HoTen: 'Nhan vien' }, // Có thể thêm repository để lấy thông tin nhân viên
            dichVu
        );

        return {
            phieu: createdPhieu,
            pdfBuffer: pdfBuffer
        };
    }

    

    async updatePhieu(maNV: string, MaPYC: string, body: any) {
        const ExitBenhNhan = await this.benhNhanRepository.findByMaBN(body.MaBN);
        if (!ExitBenhNhan) {
            throw new BadRequestException('Bệnh nhân không tồn tại');
        }

        if (body.Loai === LoaiPhieu.DichVu) {
            const ExitDichVu = await this.dichVuRepository.findByMaDichVu(body.MaDichVu);
            if (!ExitDichVu) {
                throw new BadRequestException('Dịch vụ không tồn tại');
            }
        }

        // Get current user info to check role
        const currentUser = await this.nhanVienRepository.findByMaNV(maNV);
        if (!currentUser) {
            throw new BadRequestException('Nhân viên không tồn tại');
        }

        // Get the existing phieu to check its type
        const existingPhieu = await this.phieuRepository.findByMaPYC(MaPYC);
        if (!existingPhieu) {
            throw new BadRequestException('MaPYC không tồn tại');
        }

        // Allow update if:
        // 1. User is the original creator (maNV === body.MaNV), OR
        // 2. User has DichVu role and the phieu is a service phieu (Loai === "DichVu")
        const canUpdate = (maNV === body.MaNV) || 
                         (currentUser.LoaiNV === LoaiNhanVien.DichVu && existingPhieu.Loai === LoaiPhieu.DichVu);
        
        if (!canUpdate) {
            throw new BadRequestException('Bạn không có quyền cập nhật phiếu này');
        }

        const result = await this.phieuRepository.updatePhieu(maNV, MaPYC, body);
        if (!result) {
            throw new BadRequestException('MaPYC không tồn tại hoặc không thể cập nhật');
        }

        return result;
    }

    async deletePhieu(MaPYC: string) {
        const result = await this.phieuRepository.deletePhieu(MaPYC);
        if (!result) {
            throw new BadRequestException('MaPYC không tồn tại hoặc không thể xóa');
        }
        return result;
    }

    async getAllPhieu() {
        return this.phieuRepository.getAllPhieu();
    }

    async getPhieuByLoai(Loai: string) {
        if (!Object.values(LoaiPhieu).includes(Loai as LoaiPhieu)) {
            throw new BadRequestException('Loại phiếu không hợp lệ');
        }
        return this.phieuRepository.getPhieuByLoai(Loai as LoaiPhieu);
    }

    async getPhieuByMaBN(MaBN: string, Loai?: string) {
        const ExitBenhNhan = await this.benhNhanRepository.findByMaBN(MaBN);
        if (!ExitBenhNhan) {
            throw new BadRequestException('Bệnh nhân không tồn tại');
        }

        if (Loai && !Object.values(LoaiPhieu).includes(Loai as LoaiPhieu)) {
            throw new BadRequestException('Loại phiếu không hợp lệ');
        }

        return this.phieuRepository.getPhieuByMaBN(MaBN, Loai as LoaiPhieu);
    }

    async getPhieuById(MaPYC: string) {
        const phieu = await this.phieuRepository.findByMaPYC(MaPYC);
        if (!phieu) {
            throw new BadRequestException('Phiếu không tồn tại');
        }

        // Lấy thông tin bệnh nhân
        const benhNhan = await this.benhNhanRepository.findByMaBN(phieu.MaBN as string);
        
        // Lấy thông tin dịch vụ nếu có
        let dichVu = null;
        if (phieu.Loai === LoaiPhieu.DichVu && phieu.MaDichVu) {
            dichVu = await this.dichVuRepository.findByMaDichVu(phieu.MaDichVu as string);
        }

        return {
            ...phieu,
            BenhNhan: benhNhan,
            DichVu: dichVu
        };
    }

    async downloadPhieuPdf(MaPYC: string): Promise<Buffer> {
        const phieu = await this.phieuRepository.findByMaPYC(MaPYC);
        if (!phieu) {
            throw new BadRequestException('Phiếu không tồn tại');
        }

        // Lấy thông tin bệnh nhân
        const benhNhan = await this.benhNhanRepository.findByMaBN(phieu.MaBN as string);
        
        // Lấy thông tin dịch vụ nếu có
        let dichVu = null;
        if (phieu.Loai === LoaiPhieu.DichVu && phieu.MaDichVu) {
            dichVu = await this.dichVuRepository.findByMaDichVu(phieu.MaDichVu as string);
        }

        const nhanVien = await this.nhanVienRepository.findByMaNV(phieu.MaNV as string);

        // Tạo PDF
        return await this.phieuPdfService.generatePhieuPdf(
            phieu,
            benhNhan,
            nhanVien,
            dichVu
        );
    }
}
