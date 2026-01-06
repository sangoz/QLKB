import { BadRequestException, Injectable, Inject, forwardRef } from '@nestjs/common';
import { ChitietdatlichRepository } from './chitietdatlich.repository';
import { BenhnhanRepository } from 'src/benhnhan/benhnhan.repository';
import { ChitietdatlichDTO } from './dto/cre-upchitietdatlich.dto';
import { LichRepository } from 'src/lich/lich.repository';

@Injectable()
export class ChitietdatlichService {
    constructor(
        private readonly chitietdatlichRepository: ChitietdatlichRepository,
        private readonly benhnhanRepository: BenhnhanRepository,
        @Inject(forwardRef(() => LichRepository))
        private readonly lichRepository: LichRepository,
    ) {}

    async getAllChitietdatlich() {
        const chitietdatlichList = await this.chitietdatlichRepository.findAll();
        return chitietdatlichList;
    }

    async getChitietdatlichByBenhNhan(MaBN: string) {
        const benhNhan = await this.benhnhanRepository.findByMaBN(MaBN);
        if (!benhNhan) {
            throw new BadRequestException("Bệnh nhân không tồn tại");
        }
        const chitietdatlichList = await this.chitietdatlichRepository.findByMaBN(MaBN);
        return chitietdatlichList;
    }

    async createChitietdatlich(createDTO: ChitietdatlichDTO) {
        const benhNhan = await this.benhnhanRepository.findByMaBN(createDTO.MaBN);
        if (!benhNhan) {
            throw new BadRequestException("Bệnh nhân không tồn tại");
        }

        const lich = await this.lichRepository.findLichById(createDTO.MaLich);
        if (!lich) {
            throw new BadRequestException("Lịch không tồn tại");
        }
        
        // Kiểm tra xem bệnh nhân đã đặt lịch này chưa
        const existingAppointment = await this.chitietdatlichRepository.findByMaLichAndMaBN(createDTO.MaLich, createDTO.MaBN);
        if (existingAppointment) {
            throw new BadRequestException("Bạn đã đặt lịch khám này rồi. Không thể đặt lại.");
        }
        
        // Kiểm tra xem lịch có còn chỗ trống không
        if (lich.SoBNHienTai >= lich.SoBNToiDa) {
            throw new BadRequestException("Lịch khám đã đầy, không thể đặt thêm");
        }

        // Tạo chi tiết đặt lịch
        const result = await this.chitietdatlichRepository.create(createDTO);
        
        // Tăng số bệnh nhân hiện tại trong lịch
        await this.lichRepository.incrementSoBNHienTai(createDTO.MaLich);
        
        return result;
    }


    async deleteChitietdatlich(MaBN: string, MaLich: string) {
        // Kiểm tra chi tiết đặt lịch có tồn tại không
        const existingChitiet = await this.chitietdatlichRepository.findByMaLichAndMaBN(MaLich, MaBN);
        
        if (!existingChitiet) {
            throw new BadRequestException("Chi tiết đặt lịch không tồn tại");
        }

        const result = await this.chitietdatlichRepository.delete(MaLich, MaBN);
        if (!result) {
            throw new BadRequestException("Xóa chi tiết đặt lịch không thành công");
        }

        // Giảm số bệnh nhân hiện tại trong lịch
        await this.lichRepository.decrementSoBNHienTai(MaLich);
        
        return "Xóa chi tiết đặt lịch thành công";
    }

    async updateChitietdatlich(MaBN: string, MaLich: string, updateDTO: ChitietdatlichDTO) {
        const benhNhan = await this.benhnhanRepository.findByMaBN(MaBN);
        if (!benhNhan) {
            throw new BadRequestException("Bệnh nhân không tồn tại");
        }
        
        // Kiểm tra lịch cũ tồn tại
        const lichCu = await this.lichRepository.findLichById(MaLich);
        if (!lichCu) {
            throw new BadRequestException("Lịch cũ không tồn tại");
        }

        // Kiểm tra lịch mới tồn tại (nếu thay đổi lịch)
        const lichMoi = await this.lichRepository.findLichById(updateDTO.MaLich);
        if (!lichMoi) {
            throw new BadRequestException("Lịch mới không tồn tại");
        }

        // Nếu thay đổi lịch khám
        if (MaLich !== updateDTO.MaLich) {
            // Kiểm tra lịch mới có còn chỗ không
            if (lichMoi.SoBNHienTai >= lichMoi.SoBNToiDa) {
                throw new BadRequestException("Lịch mới đã đầy, không thể chuyển");
            }

            // Giảm số bệnh nhân ở lịch cũ
            await this.lichRepository.decrementSoBNHienTai(MaLich);
            
            // Tăng số bệnh nhân ở lịch mới
            await this.lichRepository.incrementSoBNHienTai(updateDTO.MaLich);
        }

        return await this.chitietdatlichRepository.update(MaBN, MaLich, updateDTO);
    }

    async updateAppointmentStatus(MaLich: string, MaBN: string, TrangThai: string) {
        // Kiểm tra chi tiết đặt lịch có tồn tại không
        const existingChitiet = await this.chitietdatlichRepository.findByMaLichAndMaBN(MaLich, MaBN);
        
        if (!existingChitiet) {
            throw new BadRequestException("Chi tiết đặt lịch không tồn tại");
        }

        // Cập nhật trạng thái
        const updateData = {
            MaLich: existingChitiet.MaLich,
            MaBN: existingChitiet.MaBN,
            NgayDat: existingChitiet.NgayDat,
            DonGia: existingChitiet.DonGia,
            TrangThai: TrangThai as any
        };

        return await this.chitietdatlichRepository.update(MaBN, MaLich, updateData);
    }

}
