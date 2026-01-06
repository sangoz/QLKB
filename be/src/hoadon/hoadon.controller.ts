
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res } from '@nestjs/common';

import { HoadonService } from './hoadon.service';
import { ResponseMessage } from 'src/decorators/response.decorator';
import {  NhanVien } from 'src/nhanvien/entity/nhanvien.entity';
import { CreateUpdateHoadonDto } from './dto/cre-uphoadon.dto';
import { User } from 'src/decorators/user.decorator';

import { Response } from 'express';
import { Public } from 'src/decorators/public.decorator';

@Controller('hoadon')
export class HoadonController {
  constructor(private readonly hoadonService: HoadonService) {}

  @ResponseMessage('Danh sách hóa đơn đã được lấy thành công')
  @Get()
  async getAllHoadon() {
    return await this.hoadonService.getAllHoadon();
  }

  @ResponseMessage('Hóa đơn đã được tạo thành công')
  @Post()
  async createHoadon(@User() user: NhanVien, @Body() createUpdateHoadonDto: CreateUpdateHoadonDto) {
    return await this.hoadonService.createHoadon(user.MaNV, createUpdateHoadonDto);
  }

  @ResponseMessage('Hóa đơn đã được tạo thành công (tự động)')
  @Public()
  @Post('auto-create')
  async createHoadonWithoutNV(@Body() createUpdateHoadonDto: CreateUpdateHoadonDto) {
    return await this.hoadonService.createHoadonWithoutNV(createUpdateHoadonDto);
  }


  @ResponseMessage("Hóa đơn đã được cập nhật thành công")
  @Put(":id")
  async updateHoadon(@User() user: NhanVien, @Param("id") id: string, @Body() createUpdateHoadonDto: CreateUpdateHoadonDto) {
    return await this.hoadonService.updateHoadon(user.MaNV, id, createUpdateHoadonDto);
  }

  @ResponseMessage("Hóa đơn đã được xóa thành công")
  @Delete(":id")
  async deleteHoadon(@Param("id") id: string) {
    return await this.hoadonService.deleteHoadon(id);
  }

  @ResponseMessage("Lấy danh sách hóa đơn thành công cho bệnh nhân")
  @Get("benhnhan/:MaBN")
  async getHoadonByBenhNhan(@Param("MaBN") MaBN: string, @Query("LoaiHoaDon") Loai?: string) {
    return await this.hoadonService.getHoadonByBenhNhan(MaBN, Loai);
  }

  @ResponseMessage("Thay đổi trạng thái hóa đơn thành công")
  @Put(":id/trangthai")
  async changeStatusHoadon(@Param("id") id: string, @Body("TrangThai") TrangThai: string) {
    return await this.hoadonService.changeStatusHoadon(id, TrangThai);
  }



  @Public()
  @Get(":id/download-pdf")
  async downloadHoadonPdf(@Param("id") id: string, @Res() res: Response) {
    try {
      const pdfBuffer = await this.hoadonService.downloadHoadonPdf(id);
      
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="hoadon-${id}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      });
      
      res.send(pdfBuffer);
    } catch (error) {
      res.status(400).json({
        statusCode: 400,
        message: error.message,
      });
    }
  }


}