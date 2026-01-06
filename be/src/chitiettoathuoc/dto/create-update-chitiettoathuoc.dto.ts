import { Type } from "class-transformer";
import { IsNumber, IsString, IsPositive, Min } from "class-validator";

export class CreateUpdateChiTietToaThuocDto {
    @IsString()
    MaThuoc: string;

    @IsString()
    MaToaThuoc: string;

    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @Min(1)
    SoLuong: number;

    @IsString()
    LieuLuong: string;

    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    DonGia: number;
}
