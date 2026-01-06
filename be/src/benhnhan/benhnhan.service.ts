import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { BenhNhan } from './entity/benhnhan.entity';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import ms from 'ms';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreaUpDto } from './dto/cre-up.dto';
import { BenhnhanRepository } from './benhnhan.repository';
import { PhongbenhRepository } from 'src/phongbenh/phongbenh.repository';
@Injectable()
export class BenhnhanService {
    constructor(
        private readonly benhnhanRepository: BenhnhanRepository,
        private configService: ConfigService,
        private jwtService: JwtService,
        private readonly phongBenhRepository: PhongbenhRepository
    ) {}

    async validateBenhNhan(SDT: string, password: string): Promise<BenhNhan | null> {
        const benhnhan = await this.benhnhanRepository.findBySDT(SDT);
        if (benhnhan) {
            const isValid = await bcrypt.compare(password, benhnhan.Matkhau);
            if (isValid === true) {
                benhnhan.clearPassword();
                return benhnhan;
            }
        }
        return null;
    }


    // cập nhật token của bệnh nhân
    updateBenhNhanToken = async (refresh_token: string, MaBN: string) => {
        const result = await this.benhnhanRepository.updateToken(MaBN, refresh_token);
        result.clearPassword();
        return result;
    }
    

    // đăng nhập bệnh nhân
    login = async (benhNhan: BenhNhan, res: Response) => {
        const { MaBN, DiaChi, HoTen, SDT, CCCD, MaPhongBenhId } = benhNhan;
        const payload = {
            sub: "token login",
            iss: "from sever",
            MaBN,
            DiaChi,
            HoTen,
            SDT,
            CCCD,
            MaPhongBenhId
        }

        const refresh_token = this.createRefreshToken(payload);

        await this.benhnhanRepository.updateToken(MaBN, refresh_token);

        res.cookie("refresh_token", refresh_token, {
            httpOnly: true,
            maxAge: ms(this.configService.get<string>("JWT_REFRESH_EXPIRED"))
        })

        return {
            user: {
                MaBN,
                DiaChi,
                HoTen,
                SDT,
                CCCD,
                MaPhongBenhId
            },
            access_token: this.jwtService.sign(payload),
        }
    }
    
    // Create refresh token
    createRefreshToken = (payload: any) => {
        const refresh_token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
            expiresIn: ms(this.configService.get<string>("JWT_REFRESH_EXPIRED")) / 1000
        })

        return refresh_token;
    }


    // Xử lý token mới
    processNewToken = async (refreshToken: string, res: Response) => {
        try {
            this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
            })

            const user = await this.benhnhanRepository.findByRefreshToken(refreshToken);
            if (user) {
                res.clearCookie("refresh_token");
                return await this.login(user, res);
            }
            else {
                throw new BadRequestException("Refresh token không hợp lệ. Vui lòng đăng nhập lại")
            }
        } catch (error) {
            throw new BadRequestException("Refresh token không hợp lệ. Vui lòng đăng nhập lại")
        }
    }


        // đăng xuất bệnh nhân
        logout = async (res: Response, benhNhan: BenhNhan) => {
            await this.benhnhanRepository.updateToken(benhNhan.MaBN, null);
            res.clearCookie("refresh_token");
            return "thành công";
        }

        // đổi mật khẩu bệnh nhân
        changePassword = async (SDT: string, oldPassword: string, newPassword: string) => {
            const benhNhan = await this.benhnhanRepository.findBySDT(SDT);

            if (!benhNhan) {
                throw new BadRequestException("Bệnh nhân không tồn tại");
            }

            const isValid = bcrypt.compareSync(oldPassword, benhNhan.Matkhau);
            if (!isValid) {
                throw new BadRequestException("Mật khẩu cũ không đúng");
            }
    
            const hashedNewPassword = bcrypt.hashSync(newPassword, 10);

            await this.benhnhanRepository.updatePasswordBySDT(SDT, hashedNewPassword);
    
            return "Đổi mật khẩu thành công";
        }

        // Lấy thông tin bệnh nhân theo mã bệnh nhân
        findOneByMaBN = async (value: string) => {
            const benhNhan = await this.benhnhanRepository.findByMaBN(value);

            if (!benhNhan) {
                throw new BadRequestException("Bệnh nhân không tồn tại");
            }
            benhNhan.clearPassword();
            return benhNhan;
        }

        // Cập nhật thông tin bệnh nhân
        updateAccount = async (MaBN: string, updateData: CreaUpDto) => {

            const benhNhan = await this.benhnhanRepository.findByMaBN(MaBN);
            if (!benhNhan) {
                throw new BadRequestException("Bệnh nhân không tồn tại");
            }

            const CCCDExists = await this.benhnhanRepository.findFirstByCCCDNotMaBN(updateData.CCCD, MaBN);

            if (CCCDExists) {
                throw new BadRequestException("CCCD đã tồn tại");
            }

            const SDTExists = await this.benhnhanRepository.findFirstBySDTNotMaBN(updateData.SDT, MaBN);

            if (SDTExists) {
                throw new BadRequestException("Số điện thoại đã tồn tại");
            }

            if ('MaPhongBenhId' in updateData && updateData.MaPhongBenhId !== benhNhan.MaPhongBenhId) {

                
                if(!updateData.MaPhongBenhId) {
                    updateData.MaPhongBenhId = null; 
                }
                // Nếu chuyển từ phòng cũ sang null, chỉ giảm số bệnh nhân phòng cũ
                if (benhNhan.MaPhongBenhId && !updateData.MaPhongBenhId) {
                    await this.phongBenhRepository.changeSoBenhNhan(benhNhan.MaPhongBenhId, false);
                }
                // Nếu chuyển sang phòng mới (không phải null), kiểm tra và tăng số bệnh nhân phòng mới, giảm số bệnh nhân phòng cũ
                if (updateData.MaPhongBenhId) {
                    const phongBenhMoi = await this.phongBenhRepository.findByMaPhong(updateData.MaPhongBenhId);
                    if (!phongBenhMoi) {
                        throw new BadRequestException("Mã phòng bệnh không tồn tại");
                    }
                    if (
                        phongBenhMoi.SoBNToiDa !== undefined &&
                        phongBenhMoi.SoBNToiDa !== null &&
                        phongBenhMoi.SoBNToiDa > 0 &&
                        phongBenhMoi.SoBNHienTai >= phongBenhMoi.SoBNToiDa
                    ) {
                        throw new BadRequestException("Phòng bệnh đã đủ số bệnh nhân tối đa");
                    }
                    await this.phongBenhRepository.changeSoBenhNhan(updateData.MaPhongBenhId, true);
                    if (benhNhan.MaPhongBenhId) {
                        await this.phongBenhRepository.changeSoBenhNhan(benhNhan.MaPhongBenhId, false);
                    }
                }
            }
            
            const result = await this.benhnhanRepository.updateByMaBN(MaBN, updateData);
            result.clearPassword();
   
        }

        // Đăng ký tài khoản bệnh nhân
        createAccount = async (createData: CreaUpDto) => {
            const CCCDExists = await this.benhnhanRepository.findFirstByCCCD(createData.CCCD);

            if(!createData.Matkhau){
                throw new BadRequestException("Mật khẩu không được để trống");
            }

            if (CCCDExists) {
                throw new BadRequestException("CCCD đã tồn tại");
            }

            const SDTExists = await this.benhnhanRepository.findFirstBySDT(createData.SDT);

            if (SDTExists) {
                throw new BadRequestException("Số điện thoại đã tồn tại");
            }

            if('MaPhongBenhId' in createData && !createData.MaPhongBenhId ) {
                if(createData.MaPhongBenhId.trim() === "") {
                    throw new BadRequestException("Mã phòng bệnh không được để trống");
                }
                const MaPhongBenhExists = await this.phongBenhRepository.findByMaPhong(createData.MaPhongBenhId);
                if (!MaPhongBenhExists) {
                    throw new BadRequestException("Mã phòng bệnh không tồn tại");
                }
            }

            const hashedPassword = bcrypt.hashSync(createData.Matkhau, 10);
            const newBenhNhan = await this.benhnhanRepository.createBenhNhan({
                ...createData,
                Matkhau: hashedPassword
            });
            newBenhNhan.clearPassword();
            return newBenhNhan;
        }

        findByPhong = async (MaPhong: string) => {
            const phongBenh = await this.phongBenhRepository.findByMaPhong(MaPhong);
            if (!phongBenh) {
                throw new BadRequestException("Phòng bệnh không tồn tại");
            }
            const benhNhanList = await this.benhnhanRepository.findByPhong(MaPhong);
            return benhNhanList;
        }

        findAll = async () => {
            const benhNhanList = await this.benhnhanRepository.findAll();
            benhNhanList.forEach(benhNhan => benhNhan.clearPassword());
            return benhNhanList;
        }

        findOneByCCCD = async (cccd: string) => {
            const benhNhan = await this.benhnhanRepository.findByCCCD(cccd);
            if (!benhNhan) {
                throw new BadRequestException("Bệnh nhân không tồn tại");
            }
            benhNhan.clearPassword();
            return benhNhan;
        }

}

