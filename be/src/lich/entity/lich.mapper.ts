import { LichEntity } from "./lich.entity";

export class LichMapper {
  static toEntity(lich: any): LichEntity {
    return {
        MaLich: lich.MaLich,
        SoBNHienTai: lich.SoBNHienTai,
        SoBNToiDa: lich.SoBNToiDa,
        Ngay: lich.Ngay,
        Buoi: lich.Buoi,
        Gia: lich.Gia,
        MaNV: lich.MaNV
    };
  }

  static toEntityList(lichList: any[]): LichEntity[] {
    return lichList.map(lich => this.toEntity(lich));
  }
}
