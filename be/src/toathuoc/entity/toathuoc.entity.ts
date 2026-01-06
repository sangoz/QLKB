export enum TrangThaiToaThuoc {
    Pending = 'Pending',
    Payed = 'Payed',
    Done = 'Done',
}

export class ToaThuoc {
    MaToaThuoc: string;
    MaBN: string;
    MaNV: string;
    NgayKe: Date;
    TrangThai: TrangThaiToaThuoc;

    constructor(
        MaToaThuoc: string,
        MaBN: string,
        MaNV: string,
        NgayKe: Date,
        TrangThai: TrangThaiToaThuoc
    ) {
        this.MaToaThuoc = MaToaThuoc;
        this.MaBN = MaBN;
        this.MaNV = MaNV;
        this.NgayKe = NgayKe;
        this.TrangThai = TrangThai;
    }
}
