import { Type } from "class-transformer";
import { IsDate, IsString } from "class-validator";

export class HoSoBenhAnDto {
    @IsString()
    TrieuChung: string;

    @IsString()
    ChanDoan: string;

    @IsDate()
    @Type(() => Date)
    NgayKham?: Date;
    
    @IsString()
    MaBN: string;
}

