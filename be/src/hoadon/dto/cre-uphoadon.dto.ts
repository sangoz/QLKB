import { IsToday } from "src/decorators/is-today.decorator";
import { LoaiHoadon, PhuongThucThanhToan, TrangThaiHoadon } from "../entity/hoadon.entity";
import { IsDate, IsEnum, IsNumber, IsNumberString, IsString } from "class-validator";
import { Type } from "class-transformer";

export class CreateUpdateHoadonDto {

    @IsToday()
    @Type(() => Date)
    @IsDate()
    NgayTao: Date;

    @IsNumberString()
    TongTien: number;

    @IsEnum(TrangThaiHoadon)
    TrangThai: TrangThaiHoadon;

    @IsEnum(PhuongThucThanhToan)
    PhuongThucThanhToan: PhuongThucThanhToan;

    @IsEnum(LoaiHoadon)
    LoaiHoaDon: LoaiHoadon;
    
    @IsString()
    MaBN: string;
}
