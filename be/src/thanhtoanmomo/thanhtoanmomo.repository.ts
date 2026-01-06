import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateThanhToanMoMoDto, UpdateThanhToanMoMoDto } from './dto/thanhtoanmomo.dto';
import { ThanhToanMoMoMapper } from './entity/thanhtoanmomo.mapper';
import { TrangThaiThanhToanMoMo } from './entity/thanhtoanmomo.entity';

@Injectable()
export class ThanhtoanmomoRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(createThanhToanMoMoDto: CreateThanhToanMoMoDto) {
        const newThanhToan = await this.prisma.thanhToanMoMo.create({
            data: createThanhToanMoMoDto,
        });
        return ThanhToanMoMoMapper.toEntity(newThanhToan);
    }

    async findAll() {
        const thanhToanList = await this.prisma.thanhToanMoMo.findMany({
            include: {
                HoaDon: true
            },
            orderBy: {
                NgayTao: 'desc'
            }
        });
        return ThanhToanMoMoMapper.toEntityList(thanhToanList);
    }

    async findById(MaGiaoDich: string) {
        const thanhToan = await this.prisma.thanhToanMoMo.findUnique({
            where: { MaGiaoDich },
            include: {
                HoaDon: true
            }
        });
        return thanhToan ? ThanhToanMoMoMapper.toEntity(thanhToan) : null;
    }

    async findByOrderId(OrderId: string) {
        const thanhToan = await this.prisma.thanhToanMoMo.findUnique({
            where: { OrderId },
            include: {
                HoaDon: true
            }
        });
        return thanhToan ? ThanhToanMoMoMapper.toEntity(thanhToan) : null;
    }

    async findByRequestId(RequestId: string) {
        const thanhToan = await this.prisma.thanhToanMoMo.findUnique({
            where: { RequestId },
            include: {
                HoaDon: true
            }
        });
        return thanhToan ? ThanhToanMoMoMapper.toEntity(thanhToan) : null;
    }

    async findByHoaDon(MaHD: string) {
        const thanhToanList = await this.prisma.thanhToanMoMo.findMany({
            where: { MaHD },
            include: {
                HoaDon: true
            },
            orderBy: {
                NgayTao: 'desc'
            }
        });
        return ThanhToanMoMoMapper.toEntityList(thanhToanList);
    }

    async findByTrangThai(TrangThai: TrangThaiThanhToanMoMo) {
        const thanhToanList = await this.prisma.thanhToanMoMo.findMany({
            where: { TrangThai },
            include: {
                HoaDon: true
            },
            orderBy: {
                NgayTao: 'desc'
            }
        });
        return ThanhToanMoMoMapper.toEntityList(thanhToanList);
    }

    async update(MaGiaoDich: string, updateThanhToanMoMoDto: UpdateThanhToanMoMoDto) {
        const updatedThanhToan = await this.prisma.thanhToanMoMo.update({
            where: { MaGiaoDich },
            data: {
                ...updateThanhToanMoMoDto,
                NgayCapNhat: new Date()
            },
            include: {
                HoaDon: true
            }
        });
        return ThanhToanMoMoMapper.toEntity(updatedThanhToan);
    }

    async updateByOrderId(OrderId: string, updateThanhToanMoMoDto: UpdateThanhToanMoMoDto) {
        const updatedThanhToan = await this.prisma.thanhToanMoMo.update({
            where: { OrderId },
            data: {
                ...updateThanhToanMoMoDto,
                NgayCapNhat: new Date()
            },
            include: {
                HoaDon: true
            }
        });
        return ThanhToanMoMoMapper.toEntity(updatedThanhToan);
    }

    async delete(MaGiaoDich: string) {
        await this.prisma.thanhToanMoMo.delete({
            where: { MaGiaoDich },
        });
        return "Giao dịch MoMo đã được xóa thành công";
    }
}
