import { Injectable } from '@nestjs/common';
import { ToathuocRepository } from './toathuoc.repository';
import { CreateUpdateToaThuocDto } from './dto/create-uptoathuoc.dto';
import { ToaThuocPdfService } from './toathuoc-pdf.service';
import { ToaThuoc, TrangThaiToaThuoc } from './entity/toathuoc.entity';

@Injectable()
export class ToathuocService {
    constructor(
        private readonly toathuocRepository: ToathuocRepository,
        private readonly toaThuocPdfService: ToaThuocPdfService
    ) {}

    async createToaThuoc(createUpdateToaThuocDto: CreateUpdateToaThuocDto) {
        return await this.toathuocRepository.create(createUpdateToaThuocDto);
    }

    async getAllToaThuoc() {
        return await this.toathuocRepository.findAll();
    }

    async updateToaThuoc(id: string, createUpdateToaThuocDto: CreateUpdateToaThuocDto) {
        return await this.toathuocRepository.update(id, createUpdateToaThuocDto);
    }
    
    async deleteToaThuoc(id: string) {
        return await this.toathuocRepository.delete(id);
    }
    
    async getToaThuocById(id: string) {
        const result = await this.toathuocRepository.findById(id);
        return result ? result : "Toa thuốc không tồn tại" ;
    }


    async getPrintToaThuoc(id: string) {
        return await this.toathuocRepository.findByIdWithDetailss(id);
    }

    async generateToaThuocPdf(id: string): Promise<Buffer> {
        const toaThuocData = await this.toathuocRepository.findByIdWithDetails(id);
        
        if (!toaThuocData) {
            throw new Error('Toa thuốc không tồn tại');
        }

        // Get additional info if available
        let nhanVienInfo = null;
        if (toaThuocData.MaBN) {
            // You might want to get doctor info from another service
            // For now, we'll use placeholder data
            nhanVienInfo = {
                HoTen: 'Bac si placeholder',
                TrinhDo: 'Chuyen khoa I'
            };
        }

        const toaThuocEntity = new ToaThuoc(
            toaThuocData.MaToaThuoc,
            toaThuocData.MaBN,
            '', // MaNV - will be filled if available
            toaThuocData.NgayKe,
            toaThuocData.TrangThai as TrangThaiToaThuoc
        );

        return await this.toaThuocPdfService.generateToaThuocPdf(
            toaThuocEntity,
            toaThuocData.BenhNhan,
            nhanVienInfo,
            toaThuocData.ChiTietToaThuoc
        );

    }
}
