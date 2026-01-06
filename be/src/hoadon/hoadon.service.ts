import { BadRequestException, Injectable } from '@nestjs/common';
import { HoadonRepository } from './hoadon.repository';
import { CreateUpdateHoadonDto } from './dto/cre-uphoadon.dto';
import { BenhnhanRepository } from 'src/benhnhan/benhnhan.repository';

import { LoaiHoadon, TrangThaiHoadon, PhuongThucThanhToan } from './entity/hoadon.entity';

import { PdfService } from './pdf.service';

@Injectable()
export class HoadonService {
    constructor(private hoaDonRepository: HoadonRepository,
        private benhNhanRepository: BenhnhanRepository,
        private pdfService: PdfService
    ) {}


    async getAllHoadon() {
        return await this.hoaDonRepository.getAllHoaDon();
    }
    async getHoadonByBenhNhan(MaBN: string, LoaiHoadon?: string) {
        const benhNhan = await this.benhNhanRepository.findByMaBN(MaBN);
        if (!benhNhan) {
            throw new BadRequestException("Bệnh nhân không tồn tại");
        }

        if (LoaiHoadon) {
            return await this.hoaDonRepository.findByMaBN(MaBN, LoaiHoadon as LoaiHoadon);
        }

        return await this.hoaDonRepository.findByMaBN(MaBN);

    }

    async createHoadon(MaNV: string, createUpdateHoadonDto: CreateUpdateHoadonDto) {
        const ExitBenhNhan = await this.benhNhanRepository.findByMaBN(createUpdateHoadonDto.MaBN);
        if (!ExitBenhNhan) {
            throw new BadRequestException('Bệnh nhân không tồn tại');
        }
        return await this.hoaDonRepository.create({ ...createUpdateHoadonDto, MaNV });
    }

    async createHoadonWithoutNV(createUpdateHoadonDto: CreateUpdateHoadonDto) {
        const ExitBenhNhan = await this.benhNhanRepository.findByMaBN(createUpdateHoadonDto.MaBN);
        if (!ExitBenhNhan) {
            throw new BadRequestException('Bệnh nhân không tồn tại');
        }
        return await this.hoaDonRepository.create({ ...createUpdateHoadonDto, MaNV: null });
    }

    async updateHoadon(MaNV: string, id: string, createUpdateHoadonDto: CreateUpdateHoadonDto) {
        const updatedHoadon = await this.hoaDonRepository.update(id, { ...createUpdateHoadonDto, MaNV });
        if (!updatedHoadon) {
            throw new BadRequestException('Hóa đơn không tồn tại hoặc cập nhật không thành công');
        }
        return updatedHoadon;
    }

    async deleteHoadon(id: string) {
        const result = await this.hoaDonRepository.delete(id);
        if (!result) {
            throw new BadRequestException('Hóa đơn không tồn tại hoặc xóa không thành công');
        }
        return result;
    }

    async changeStatusHoadon(id: string, TrangThai: string) {
        if (!Object.values(TrangThaiHoadon).includes(TrangThai as TrangThaiHoadon)) {
            throw new BadRequestException('Trạng thái hóa đơn không hợp lệ');
        }
        const hoaDon = await this.hoaDonRepository.findByMaHD(id);
        if (!hoaDon) {
            throw new BadRequestException('Hóa đơn không tồn tại');
        }

        if (hoaDon.TrangThai === TrangThai) {
            throw new BadRequestException('Trạng thái hóa đơn đã là ' + TrangThai);
        }

        const updatedHoadon = await this.hoaDonRepository.updateStatus(id, TrangThai as TrangThaiHoadon);
        if (!updatedHoadon) {
            throw new BadRequestException('Hóa đơn không tồn tại hoặc cập nhật không thành công');
        }
        return updatedHoadon;
    }

    async changePaymentMethod(id: string, PhuongThuc: string) {
        const hoaDon = await this.hoaDonRepository.findByMaHD(id);
        if (!hoaDon) {
            throw new BadRequestException('Hóa đơn không tồn tại');
        }

        const updatedHoadon = await this.hoaDonRepository.updateMethod(id, PhuongThuc as PhuongThucThanhToan);
        if (!updatedHoadon) {
            throw new BadRequestException('Cập nhật phương thức thanh toán không thành công');
        }
        return updatedHoadon;
    }       


    async downloadHoadonPdf(id: string): Promise<Buffer> {
        const hoaDon = await this.hoaDonRepository.findByMaHD(id);
        if (!hoaDon) {
            throw new BadRequestException('Hóa đơn không tồn tại');
        }

        // Lấy thông tin bệnh nhân
        const benhNhan = await this.benhNhanRepository.findByMaBN(hoaDon.MaBN);
        
        // Tạo PDF
        return await this.pdfService.generateHoadonPdf(hoaDon, benhNhan);
    }




}