import { IsEnum, IsNumberString, IsString } from "class-validator";
import { TrangThaiLich } from "../entity/chitietdatlich.entity";

export class ChitietdatlichDTO {
    @IsString()
    MaLich: string;

    @IsString()
    MaBN: string;

    @IsString()
    NgayDat: Date;

    @IsNumberString()
    DonGia: number;

    @IsEnum(TrangThaiLich)
    TrangThai: TrangThaiLich;

}