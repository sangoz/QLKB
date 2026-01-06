import { Type } from "class-transformer";
import { IsDate, IsEnum, IsString } from "class-validator";
import { TrangThaiToaThuoc } from "../entity/toathuoc.entity";
import { IsToday } from "src/decorators/is-today.decorator";

export class CreateUpdateToaThuocDto {
    @IsString()
    MaBN: string;
   
    @Type(() => Date)
    @IsDate()
    @IsToday()
    NgayKe: Date;

    @IsEnum(TrangThaiToaThuoc)
    TrangThai: TrangThaiToaThuoc;
}
