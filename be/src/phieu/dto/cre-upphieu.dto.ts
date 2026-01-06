import { TrangThaiPhieu } from "@prisma/client";
import { LoaiPhieu } from "../entity/phieu.entity";
import { IsDate, IsEnum, IsNumberString, IsOptional, IsString, Validate, ValidateIf } from "class-validator";
import { Type } from "class-transformer";
import { IsToday } from "src/decorators/is-today.decorator";

export class CreateUpdatePhieuDto {

    @IsDate()
    @Type(() => Date)
    @IsToday()
    NgayYeuCau: Date;

    @IsNumberString()
    DonGia: number;

    @IsEnum(LoaiPhieu)  
    Loai: LoaiPhieu;

    @IsString()
    MaBN: string;

    @IsString()
    @ValidateIf(o => o.Loai === LoaiPhieu.DichVu)
    MaDichVu: string;

    @IsEnum(TrangThaiPhieu)
    TrangThai: TrangThaiPhieu;
}
