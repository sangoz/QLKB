import { LichEntity } from "src/lich/entity/lich.entity"

export enum TrangThaiLich {
    Pending = 'Pending',
    Accept = 'Accept',
    Cancel = 'Cancel',
    Done = 'Done'
}

export class chitietdatlichEntity {
    MaLich: string
    MaBN: string
    NgayDat: Date
    DonGia: number
    TrangThai: TrangThaiLich
    Lich?: LichEntity;

    constructor(
        MaLich: string,
        MaBN: string,
        NgayDat: Date,
        DonGia: number,
        TrangThai: TrangThaiLich,
        Lich?: LichEntity
    ) {
        this.MaLich = MaLich;
        this.MaBN = MaBN;
        this.NgayDat = NgayDat;
        this.DonGia = DonGia;
        this.TrangThai = TrangThai;
        this.Lich = Lich;
    }
}