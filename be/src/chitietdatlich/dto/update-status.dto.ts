import { IsEnum } from "class-validator";
import { TrangThaiLich } from "../entity/chitietdatlich.entity";

export class UpdateStatusDTO {
    @IsEnum(TrangThaiLich)
    TrangThai: TrangThaiLich;
}
