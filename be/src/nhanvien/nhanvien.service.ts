import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Response } from 'express';
import ms from 'ms';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { NhanVien } from './entity/nhanvien.entity';
import { NhanVienDto } from './dto/addNV.dto';
import { NhanvienRepository } from './nhanvien.repository';
import { KhoaRepository } from 'src/khoa/khoa.repository';

@Injectable()
export class NhanVienService {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        private nhanvienRepository: NhanvienRepository,
        private khoaRepository: KhoaRepository
    ) { }

    findAllBacSi = async () => {
        const bacSiList = await this.nhanvienRepository.findAllBacSi();
        bacSiList.forEach(bacSi => bacSi.clearPassword()); // Clear password for security
        return bacSiList;
    }

    // cập nhật token của nhân viên
    updateNhanVienToken = async (refresh_token: string, id: string) => {
        return await this.nhanvienRepository.updateNhanVienToken(refresh_token, id);
    }

   
    // đăng nhập nhân viên
    login = async (nhanVien: NhanVien, res: Response) => {
        const { MaNV, DiaChi, HoTen,LoaiNV,Luong,NgaySinh,SDT,LaTruongKhoa,MaKhoaId,TrinhDo } = nhanVien;
        const payload = {
            sub: "token login",
            iss: "from sever",
            MaNV,
            DiaChi,
            HoTen,
            LoaiNV,
            Luong,
            NgaySinh,
            SDT,
            LaTruongKhoa,
            MaKhoaId,
            TrinhDo
        }

        const refresh_token = this.createRefreshToken(payload);

        await this.nhanvienRepository.updateNhanVienToken(refresh_token, MaNV);

        res.cookie("refresh_token", refresh_token, {
            httpOnly: true,
            maxAge: ms(this.configService.get<string>("JWT_REFRESH_EXPIRED_NHANVIEN"))
        })

        return {
            user: {
                MaNV,
                DiaChi,
                HoTen,
                LoaiNV,
                Luong,
                NgaySinh,
                SDT,
                LaTruongKhoa,
                MaKhoaId,
                TrinhDo
            },
            access_token: this.jwtService.sign(payload),
        }
    }

    // Create refresh token
    createRefreshToken = (payload: any) => {
        const refresh_token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET_NHANVIEN"),
            expiresIn: ms(this.configService.get<string>("JWT_REFRESH_EXPIRED_NHANVIEN")) / 1000
        })

        return refresh_token;
    }

    // kiểm tra thông tin đăng nhập của nhân viên
    validateNhanVien = async (SDT: string, pass: string): Promise<NhanVien | null> => {
        const nhanvien = await this.nhanvienRepository.findBySDT(SDT);
        if (nhanvien) {
            const isValid = bcrypt.compareSync(pass, nhanvien.Matkhau);
            if (isValid === true) {
                nhanvien.clearPassword();
                return nhanvien;
            }
        }
        return null;
    }

    // Xử lý token mới
    processNewToken = async (refreshToken: string, res: Response) => {
        try {
            this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET_NHANVIEN"),
            })
            const user = await this.nhanvienRepository.findByRefreshToken(refreshToken);
            if (user) {
                user.clearPassword();
                res.clearCookie("refresh_token");
                return await this.login(user, res);
            } else {
                throw new BadRequestException("Refresh token không hợp lệ. Vui lòng đăng nhập lại")
            }
        } catch (error) {
            throw new BadRequestException("Refresh token không hợp lệ. Vui lòng đăng nhập lại")
        }
    }

   
    // đăng xuất nhân viên
    logout = async (res: Response, nhanVien: NhanVien) => {
        await this.nhanvienRepository.clearRefreshToken(nhanVien.MaNV);
        res.clearCookie("refresh_token");
        return "thành công";
    }

    // đổi mật khẩu nhân viên
    changePassword = async (SDT: string, oldPassword: string, newPassword: string) => {
        const nhanVien = await this.nhanvienRepository.findBySDT(SDT);
        if (!nhanVien) {
            throw new BadRequestException("Nhân viên không tồn tại");
        }
        const isValid = bcrypt.compareSync(oldPassword, nhanVien.Matkhau);
        if (!isValid) {
            throw new BadRequestException("Mật khẩu cũ không đúng");
        }
        const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
        await this.nhanvienRepository.updatePassword(SDT, hashedNewPassword);
        return "Đổi mật khẩu thành công";
    }

    // Lấy thông tin nhân viên theo mã nhân viên
    findOneByMaNV = async (value: string) => {
        if (!value) {
            throw new BadRequestException("Mã nhân viên không được để trống");
        }
        const nhanVien = await this.nhanvienRepository.findByMaNV(value);
        if (!nhanVien) {
            throw new BadRequestException("Nhân viên không tồn tại");
        }
        nhanVien.clearPassword();
        return nhanVien;
    }

    // Lấy thông tin khoa theo mã nhân viên
    findKhoaByNhanVienId = async (id: string) => {
        if (!id) {
            throw new BadRequestException("Mã nhân viên không được để trống");
        }
        const nhanVien = await this.nhanvienRepository.findByMaNV(id);
        if (!nhanVien) {
            throw new BadRequestException("Nhân viên không tồn tại");
        }
        //Lấy mã khoa của nhân viên
        if (!nhanVien.MaKhoaId) {
            throw new BadRequestException("Nhân viên không có khoa");
        }
        const khoa = await this.khoaRepository.findById(nhanVien.MaKhoaId);
        return khoa;
    }

    addNhanVien = async (newNhanVien: NhanVienDto) => {
        if (!newNhanVien.Matkhau) {
            throw new BadRequestException("Mật khẩu không được để trống");
        }
        const existingNhanVien = await this.nhanvienRepository.findByPhone(newNhanVien.SDT);
        if (existingNhanVien) {
            throw new BadRequestException("Số điện thoại đã tồn tại");
        }
        const hashedPassword = bcrypt.hashSync(newNhanVien.Matkhau, 10);
        const createdNhanVien = await this.nhanvienRepository.createNhanVien({
            ...newNhanVien,
            Matkhau: hashedPassword
        });
        createdNhanVien.clearPassword();
        return createdNhanVien;
    }

    // Lấy danh sách nhân viên
    findAll = async () => {
        const nhanVienList = await this.nhanvienRepository.findAll();
        nhanVienList.forEach(nv => nv.Matkhau = undefined);
        return nhanVienList;
    }

    updateNhanVien = async (id: string, updatedNhanVien: NhanVienDto) => {
        const existingNhanVien = await this.nhanvienRepository.findByMaNV(id);
        if (!existingNhanVien) {
            throw new BadRequestException("Nhân viên không tồn tại");
        }
        
        // Prepare update data
        const updateData = { ...updatedNhanVien };
        
        // Hash password if provided
        if (updateData.Matkhau) {
            updateData.Matkhau = bcrypt.hashSync(updateData.Matkhau, 10);
        } else {
            // Remove password field if not provided (don't update password)
            delete updateData.Matkhau;
        }
        
        const result = await this.nhanvienRepository.updateNhanVien(id, updateData);
        result.clearPassword();
        return result;
    }

    deleteNhanVien = async (id: string) => {
        const existingNhanVien = await this.nhanvienRepository.findByMaNV(id);
        if (!existingNhanVien) {
            throw new BadRequestException("Nhân viên không tồn tại");
        }
        
        try {
            await this.nhanvienRepository.deleteNhanVien(id);
            return "Xoá nhân viên thành công";
        } catch (error) {
            // Handle foreign key constraint error
            if (error.code === 'P2003') {
                throw new BadRequestException(
                    "Không thể xóa nhân viên này vì đang có dữ liệu liên quan (hóa đơn, lịch khám, phiếu yêu cầu, v.v.). Vui lòng xóa các dữ liệu liên quan trước hoặc liên hệ quản trị viên."
                );
            }
            throw error;
        }
    }

    updateAccount = async (MaNV: string, updatedAccount: NhanVienDto) => {
        const existingNhanVien = await this.nhanvienRepository.findByMaNV(MaNV);
        if (!existingNhanVien) {
            throw new BadRequestException("Nhân viên không tồn tại");
        }
        const result = await this.nhanvienRepository.updateAccount(MaNV, updatedAccount);
        result.clearPassword();
        return result;
    }
}