import { BadRequestException, Injectable } from '@nestjs/common';
import { HosobenhanRepository } from './hosobenhan.repository';
import { BenhnhanRepository } from 'src/benhnhan/benhnhan.repository';
import { HoSoBenhAnDto } from './dto/HoSoBenhAn.dto';
import { ExcelService } from './excel.service';
import { PhieuRepository } from 'src/phieu/phieu.repository';

@Injectable()
export class HosobenhanService {
    constructor(private readonly hosobenhanRepository: HosobenhanRepository,
                private readonly benhnhanRepository: BenhnhanRepository,
                private readonly excelService: ExcelService,
            private readonly phieuRepository: PhieuRepository
    ) {}

    async createHosobenhan(MaNV: string, body: HoSoBenhAnDto) {

        const benhNhan = await this.benhnhanRepository.findByMaBN(body.MaBN);
        if (!benhNhan) {
            throw new BadRequestException('Bệnh nhân không tồn tại');
        }
        const result = await this.hosobenhanRepository.create({ ...body, MaNV });

        if(result) {
            const date = new Date();
            date.setHours(0, 0, 0, 0);
            await this.phieuRepository.updatePhieuKham(body.MaBN,  date );
            return result;
        }   
    }

    async getHosobenhanByMaBN(MaBN: string) {
        const benhNhan = await this.benhnhanRepository.findByMaBN(MaBN);
        if (!benhNhan) {
            throw new BadRequestException('Bệnh nhân không tồn tại');
        }
        return await this.hosobenhanRepository.findByMaBN(MaBN);
    }

    async getHosobenhanByMaHSBA(MaHSBA: string) {
        const hoSoBenhAn = await this.hosobenhanRepository.findByMaHSBA(MaHSBA);
        if (!hoSoBenhAn) {
            throw new BadRequestException('Hồ sơ bệnh án không tồn tại');
        }
        return hoSoBenhAn;
    }

    async exportHoSoBenhAnExcel(MaBN: string): Promise<Buffer> {
        const benhNhan = await this.benhnhanRepository.findByMaBN(MaBN);
        if (!benhNhan) {
            throw new BadRequestException('Bệnh nhân không tồn tại');
        }

        const hoSoBenhAn = await this.hosobenhanRepository.findByMaBN(MaBN);
        if (!hoSoBenhAn || hoSoBenhAn.length === 0) {
            throw new BadRequestException('Không tìm thấy hồ sơ bệnh án cho bệnh nhân này');
        }

        return await this.excelService.generateHoSoBenhAnExcel(hoSoBenhAn, benhNhan);
    }


    async updateHosobenhan(MaHSBA: string, updateData: HoSoBenhAnDto, MaNV: string) {
        const hoSoBenhAn = await this.hosobenhanRepository.findByMaHSBA(MaHSBA);
        if (!hoSoBenhAn) {
            throw new BadRequestException('Hồ sơ bệnh án không tồn tại');
        }

        if (updateData.MaBN && updateData.MaBN !== hoSoBenhAn.MaBN) {
            const benhNhan = await this.benhnhanRepository.findByMaBN(updateData.MaBN);
            if (!benhNhan) {
                throw new BadRequestException('Bệnh nhân không tồn tại');
            }
        }
        const result = await this.hosobenhanRepository.update(MaHSBA, { ...updateData, MaNV });
        if (!result) {
            throw new BadRequestException('Cập nhật hồ sơ bệnh án không thành công');
        }
        return result;
    }

    async getAllHSBN() {
        return await this.hosobenhanRepository.findAll();
    }

    async getRecentDiagnosesByDoctor(MaNV: string) {
        return await this.hosobenhanRepository.findRecentByDoctor(MaNV, 10); // Lấy 10 hồ sơ gần nhất
    }
}
