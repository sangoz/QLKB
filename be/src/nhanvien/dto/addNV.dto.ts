import { Transform, Type } from "class-transformer";
import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString, ValidateIf } from "class-validator";
import { LoaiNhanVien, TrinhDo } from "../entity/nhanvien.entity";
import { IsBeforeToday } from "src/decorators/is-beforetoday.decorator";

export class NhanVienDto {
  @IsString()
  @IsNotEmpty()
  HoTen: string;

 @Transform(({ value }) => {
    const date = new Date(value);
    return new Date(Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    ));
  })
  @Type(() => Date)
  @IsDate()
  @IsBeforeToday({ message: 'Ngày sinh phải nhỏ hơn ngày hiện tại' })
  NgaySinh: Date;

  @IsPhoneNumber('VN')
  SDT: string;

  @IsString()
  DiaChi: string;

  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseFloat(value);
    }
    return value;
  })
  @IsNumber({ allowInfinity: false, allowNaN: false }, { message: 'Lương phải là một số hợp lệ' })
  Luong: number;

  @IsString()
  @IsOptional()
  Matkhau?: string;

  @IsEnum(LoaiNhanVien)
  LoaiNV: LoaiNhanVien;

  @ValidateIf((o) => o.LoaiNV === LoaiNhanVien.BacSi)
  @IsEnum(TrinhDo, { message: 'TrinhDo phải là một trong các giá trị: ChuyenKhoaI, ChuyenKhoaII, ThacSi, TienSi, PhoGiaoSu, GiaoSu nếu LoaiNV là BacSi' })
  TrinhDo?: TrinhDo;

  @ValidateIf((o) => o.LoaiNV === LoaiNhanVien.BacSi)
   @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return value;
  })
  @IsBoolean({ message: 'LaTruongKhoa phải là "true" hoặc "false" nếu LoaiNV là BacSi' })
  LaTruongKhoa?: boolean;

  @ValidateIf((o) => o.LoaiNV === LoaiNhanVien.BacSi)
  @IsString({ message: 'MaKhoaId là bắt buộc nếu LoaiNV là BacSi' })
  MaKhoaId?: string;
}