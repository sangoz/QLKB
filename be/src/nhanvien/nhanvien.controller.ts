import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res, UnauthorizedException} from '@nestjs/common';
import { NhanVienService } from './nhanvien.service';
import { User } from 'src/decorators/user.decorator';
import { LoaiNhanVien, NhanVien } from './entity/nhanvien.entity';
import { Public } from 'src/decorators/public.decorator';
import { ResponseMessage } from 'src/decorators/response.decorator';
import { Request, Response } from 'express';
import { ChangePasswordDto } from './dto/changepass.dto';
import { LoginDto } from './dto/login.dto';
import { NhanVienMapper } from './entity/nhanvien.mapper';
import { Roles } from 'src/decorators/role.decorator';
import { NhanVienDto } from './dto/addNV.dto';

@Controller('nhanvien')
export class NhanVienController {
    constructor(
        private nhanVienService: NhanVienService,
    ) {}

    @Public()
    @ResponseMessage('Đăng nhập thành công')
    @Post('login')
    async login(@Body() req: LoginDto, @Res({ passthrough: true }) res: Response) {
        const nhanvien = await this.nhanVienService.validateNhanVien(req.SDT, req.password);
        if (!nhanvien) {
            throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ');
        }
        return this.nhanVienService.login(NhanVienMapper.toEntity(nhanvien), res);
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
        return this.nhanVienService.processNewToken(refreshToken, res);
    }

    // Api logout
    @Post("logout")
    @ResponseMessage("Logout")
    handleLogout(
        @User() nhanVien: NhanVien,
        @Res({ passthrough: true }) res: Response
    ) {
        return this.nhanVienService.logout(res, nhanVien)
    }

    // Api change password
    @Post("change-password")
    @ResponseMessage("Change password")
    handleChangePassword(
        @User() nhanVien: NhanVien,
        @Body() changePass: ChangePasswordDto
    ) {
        return this.nhanVienService.changePassword(nhanVien.SDT, changePass.oldPassword, changePass.newPassword);
    }

    // Api get user information
    @ResponseMessage("Get user information")
    @Get("account")
    handleGetAccount(@User() nhanVien: NhanVien) {
        return this.nhanVienService.findOneByMaNV(nhanVien.MaNV);
    }

    @ResponseMessage("Đã thêm nhân viên thành công")
    @Roles(LoaiNhanVien.BanGiamDoc)
    @Post("add")
    handleAddNhanVien(
        @Body() newNhanVien: NhanVienDto
    ) {
        return this.nhanVienService.addNhanVien(newNhanVien);
    }

    @ResponseMessage("Lấy danh sách nhân viên thành công")
    @Public()
    @Get("list")
    handleGetListNhanVien() {
        return this.nhanVienService.findAll();
    }

    @ResponseMessage("Sửa thông tin nhân viên thành công")
    @Roles(LoaiNhanVien.BanGiamDoc)
    @Put("edit/:id")
    handleEditNhanVien(
        @Param("id") id: string,
        @Body() updatedNhanVien: NhanVienDto
    ) {
        return this.nhanVienService.updateNhanVien(id, updatedNhanVien);
    }

    @ResponseMessage("Xoá nhân viên thành công")
    @Roles(LoaiNhanVien.BanGiamDoc)
    @Delete("delete/:id")
    handleDeleteNhanVien(
        @Param("id") id: string
    ) {
        return this.nhanVienService.deleteNhanVien(id);
    }

    @ResponseMessage("Sửa thông tin cá nhân thành công")
    @Roles(...Object.values(LoaiNhanVien))
    @Put("edit-account")
    handleEditAccount(
        @User() nhanVien: NhanVien,
        @Body() updatedAccount: NhanVienDto
    ) {
        return this.nhanVienService.updateAccount(nhanVien.MaNV, updatedAccount);
    }

    @ResponseMessage("Lấy danh sách bác sĩ thành công")
    @Public()
    @Get("bacsi")
    handleGetListBacSi() {
        return this.nhanVienService.findAllBacSi();
    }

    @ResponseMessage("Lấy thông tin theo mã nhân viên thành công")
    @Get(":id")
    handleGetNhanVienById(@Param("id") id: string) {
        return this.nhanVienService.findOneByMaNV(id);
    }


    @ResponseMessage("Lấy tên khoa theo mã nhân viên thành công")
    @Get(":id/khoa")
    handleGetKhoaByNhanVienId(@Param("id") id: string) {
        return this.nhanVienService.findKhoaByNhanVienId(id);
    }

}
