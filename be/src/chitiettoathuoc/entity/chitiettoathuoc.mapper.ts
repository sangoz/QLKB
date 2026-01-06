import { ChiTietToaThuoc } from './chitiettoathuoc.entity';

export class ChiTietToaThuocMapper {
    static toEntity(data: any): ChiTietToaThuoc {
        return new ChiTietToaThuoc(
            data.MaThuoc,
            data.MaToaThuoc,
            data.SoLuong,
            data.LieuLuong,
            Number(data.DonGia)
        );
    }
}
