
import { Body, Controller, Get, Post, Put, Req, Res, UnauthorizedException, UseGuards, Param, Query } from '@nestjs/common';
import { BenhnhanService } from './benhnhan.service';
import { Public } from 'src/decorators/public.decorator';
import { ResponseMessage } from 'src/decorators/response.decorator';
import { User } from 'src/decorators/user.decorator';
import { BenhNhan } from './entity/benhnhan.entity';
import { Request, Response } from 'express';
import { ChangePasswordDto } from 'src/nhanvien/dto/changepass.dto';
import { LoginBenhNhanDto } from './dto/login.dto';
import { CreaUpDto } from './dto/cre-up.dto';
import { Roles } from 'src/decorators/role.decorator';
import { LoaiNhanVien } from 'src/nhanvien/entity/nhanvien.entity';

@Controller('benhnhan')
export class BenhnhanController {
  constructor(private readonly benhnhanService: BenhnhanService) {}

    @Public()
    @ResponseMessage('Đăng nhập thành công')
    @Post('login')
    async login(@Body() req: LoginBenhNhanDto, @Res({ passthrough: true }) res: Response) {
        const benhnhan = await this.benhnhanService.validateBenhNhan(req.SDT, req.password);
        if (!benhnhan) {
            throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ');
        }
        return this.benhnhanService.login(benhnhan, res);
    }

    // Api get user by refresh token
    @Public()
    @ResponseMessage("Get user by refresh token")
    @Get("refresh")
    handleRefreshToken(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response
    ) {
        const refreshToken = req.cookies["refresh_token"]
        return this.benhnhanService.processNewToken(refreshToken, res);
    }

        // Api logout
    @Post("logout")
    @ResponseMessage("Đăng xuất thành công")
    handleLogout(
        @User() benhnhan: BenhNhan,
        @Res({ passthrough: true }) res: Response
    ) {
        return this.benhnhanService.logout(res, benhnhan)
    }

        //lấy thông tin bênh nhân theo cccd (qua body)
    @ResponseMessage("Lấy thông tin bệnh nhân theo cccd thành công")
    @Get("cccd/:cccd")
    @Public()
    async getByCCCD(@Param('cccd') cccd: string) {
        return this.benhnhanService.findOneByCCCD(cccd);
    }


    // Api change password
    @Post("change-password")
    @ResponseMessage("Change password")
    handleChangePassword(
        @User() benhnhan: BenhNhan,
        @Body() changePass: ChangePasswordDto
    ) {
        return this.benhnhanService.changePassword(benhnhan.SDT, changePass.oldPassword, changePass.newPassword);
    }

    // Api get user information
    @ResponseMessage("Get user information")
    @Get("account")
    handleGetAccount(@User() benhnhan: BenhNhan) {
        return this.benhnhanService.findOneByMaBN(benhnhan.MaBN);
    }

    @ResponseMessage("Cập nhật thông tin thành công")
    @Put()
    handleUpdateAccount(
        @User() benhnhan: BenhNhan,
        @Body() updateData: CreaUpDto
    ) {
        return this.benhnhanService.updateAccount(benhnhan.MaBN, updateData);
    }

    @ResponseMessage("Đăng ký tài khoản thành công")
    @Public()
    @Post("register")
    async register(@Body() createData: CreaUpDto) {
        return this.benhnhanService.createAccount(createData);
    }


    @Public()
    @ResponseMessage("Lấy thông tin bệnh nhân thành công")
    @Get(":id")
    async getById(@Param('id') id: string) {
        return this.benhnhanService.findOneByMaBN(id);
    }


    @ResponseMessage("Cập nhật thông tin cho bệnh nhân thành công")
    @Put(":id")
    @Roles(LoaiNhanVien.QuanLyNoiTru)
    async update(@Param('id') id: string, @Body() updateData: CreaUpDto) {
        return this.benhnhanService.updateAccount(id, updateData);
    }


    @ResponseMessage("Lấy danh sách bệnh nhân theo phòng bệnh thành công")
    @Get("phong/:MaPhong")
    @Roles(LoaiNhanVien.QuanLyNoiTru)
    async getByPhong(@Param('MaPhong') MaPhong: string) {
        return this.benhnhanService.findByPhong(MaPhong);
    }

    @ResponseMessage("Lấy danh sách bệnh nhân thành công")
    @Get()
    async getAll() {
        return this.benhnhanService.findAll();
    }


}

