import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BenhNhan } from '../entity/benhnhan.entity';

@Injectable()
export class BenhNhanJwtStrategy extends PassportStrategy(Strategy, 'jwt-benhnhan') {
    constructor(
        private configServices: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configServices.get<string>("JWT_ACCESS_TOKEN_SECRET"),
        });
    }

    async validate(payload: BenhNhan): Promise<Omit<BenhNhan, 'clearPassword'>> {
        const { CCCD, HoTen, DiaChi, SDT, MaBN, MaPhongBenhId } = payload;

        const user = new (BenhNhan as any)(MaBN, HoTen, CCCD, SDT, DiaChi, MaPhongBenhId);
        return user;
    }
}
