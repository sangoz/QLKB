import { Body, Controller, Get, Param, Post, Put, Res } from '@nestjs/common';
import { HosobenhanService } from './hosobenhan.service';
import { ResponseMessage } from 'src/decorators/response.decorator';
import { HoSoBenhAnDto } from './dto/HoSoBenhAn.dto';
import { Response } from 'express';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/role.decorator';
import { LoaiNhanVien, NhanVien } from 'src/nhanvien/entity/nhanvien.entity';
import { LoaiHoadon } from 'src/hoadon/entity/hoadon.entity';
import { User } from 'src/decorators/user.decorator';

@Controller('hosobenhan')
export class HosobenhanController {
  constructor(private readonly hosobenhanService: HosobenhanService) {}

  @ResponseMessage('Hồ sơ bệnh nhân đã được tạo thành công')
  @Roles(...Object.values(LoaiNhanVien))
  @Post()
  async createHosobenhan(@User() user: NhanVien, @Body() body: HoSoBenhAnDto) {
    return await this.hosobenhanService.createHosobenhan(user.MaNV, body);
  }

  @ResponseMessage("Lấy danh sách hồ sơ bệnh nhân theo")
  @Get()
  async getAllHSBN() {
    return await this.hosobenhanService.getAllHSBN();
  }

  @Public()
  @Get("benhnhan/:MaBN/export-excel")
  async exportHoSoBenhAnExcel(@Param("MaBN") MaBN: string, @Res() res: Response) {
    try {
      const excelBuffer = await this.hosobenhanService.exportHoSoBenhAnExcel(MaBN);
      
      res.set({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="ho-so-benh-an-${MaBN}.xlsx"`,
        'Content-Length': excelBuffer.length.toString(),
      });
      
      res.send(excelBuffer);
    } catch (error) {
      res.status(400).json({
        statusCode: 400,
        message: error.message,
      });
    }
  }

  @ResponseMessage("Lây thông tin hồ sơ bệnh nhân theo MaBN thành công")
  @Get("benhnhan/:MaBN")
  async getHosobenhanByMaBN(@Param("MaBN") MaBN: string
  ) {
    return await this.hosobenhanService.getHosobenhanByMaBN(MaBN);
  }

  

  @ResponseMessage("Lấy thông tin hồ sơ bệnh nhân theo id thành công")
  @Get(":MaHSBA")
  async getHosobenhanByMaHSBA(@Param("MaHSBA") MaHSBA: string) {
    return await this.hosobenhanService.getHosobenhanByMaHSBA(MaHSBA);
  }

  @ResponseMessage("Hồ sơ bệnh án đã được cập nhật thành công")
  @Put(":MaHSBA")
  @Roles(...Object.values(LoaiNhanVien))
  async updateHosobenhan(@User() user: NhanVien, @Param("MaHSBA") MaHSBA: string, @Body() updateData: HoSoBenhAnDto) {
    return await this.hosobenhanService.updateHosobenhan(MaHSBA, updateData, user.MaNV);
  }

  @ResponseMessage("Lấy hồ sơ bệnh án gần đây của bác sĩ thành công")
  @Public()
  @Get("bacsi/:id/recent")
  async getRecentDiagnosesByDoctor(@Param("id") id: string) {
    return await this.hosobenhanService.getRecentDiagnosesByDoctor(id);
  }

}
