import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NhanVien } from '../entity/nhanvien.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-nhanvien') {
    constructor(
        private configServices: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configServices.get<string>("JWT_ACCESS_TOKEN_SECRET_NHANVIEN"),
        });
    }

    async validate(payload: NhanVien): Promise<Omit<NhanVien, 'clearPassword'>> {
        const { MaNV, HoTen, NgaySinh, SDT, DiaChi, Luong, LoaiNV, TrinhDo, LaTruongKhoa, MaKhoaId } = payload;

        const user = new (NhanVien as any)(MaNV, HoTen, NgaySinh, SDT, DiaChi, Luong, LoaiNV, TrinhDo, LaTruongKhoa, MaKhoaId);
        return user;
    }
}