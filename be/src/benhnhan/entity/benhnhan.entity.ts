export class BenhNhan {
  MaBN: string;
  HoTen: string;
  CCCD: string;
  SDT: string;
  DiaChi: string;
  RefreshToken?: string;
  MaPhongBenhId?: string;
  Matkhau?: string;

  constructor(
    MaBN: string,
    HoTen: string,
    CCCD: string,
    SDT: string,
    DiaChi: string,
    MaPhongBenhId?: string
  ) {
    this.MaBN = MaBN;
    this.HoTen = HoTen;
    this.CCCD = CCCD;
    this.SDT = SDT;
    this.DiaChi = DiaChi;
    this.MaPhongBenhId = MaPhongBenhId; 
  }

  static withPassword(
    MaBN: string,
    HoTen: string,
    CCCD: string,
    SDT: string,
    DiaChi: string,
    Matkhau: string,
    MaPhongBenhId?: string
  ): BenhNhan {
    const entity = new BenhNhan(MaBN, HoTen, CCCD, SDT, DiaChi, MaPhongBenhId);
    entity.Matkhau = Matkhau;
    return entity;
  }

  public clearPassword(): void {
    this.Matkhau = undefined;
  }
}
