import { Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common';
import { ToathuocService } from './toathuoc.service';
import { ResponseMessage } from 'src/decorators/response.decorator';
import { LoaiNhanVien, NhanVien } from 'src/nhanvien/entity/nhanvien.entity';
import { Roles } from 'src/decorators/role.decorator';
import { CreateUpdateToaThuocDto } from './dto/create-uptoathuoc.dto';
import { User } from 'src/decorators/user.decorator';
import { Response } from 'express';

@Controller('toathuoc')
export class ToathuocController {
  constructor(private readonly toathuocService: ToathuocService) {}

  @ResponseMessage("Tạo toa thuốc thành công")
  @Roles(LoaiNhanVien.BacSi)
  @Post()
  async createToaThuoc(@Body() createUpdateToaThuocDto: CreateUpdateToaThuocDto) {
    return await this.toathuocService.createToaThuoc(createUpdateToaThuocDto);
  }

  @ResponseMessage("Lấy tất cả toa thuốc thành công")
  @Get()
  async getAllToaThuoc() {
    return await this.toathuocService.getAllToaThuoc();
  }


  @ResponseMessage("Cập nhật toa thuốc thành công")
  @Put(':id')
  async updateToaThuoc(@Param('id') id: string, @Body() createUpdateToaThuocDto: CreateUpdateToaThuocDto) {
    return await this.toathuocService.updateToaThuoc(id, createUpdateToaThuocDto);
  }


  @ResponseMessage("Xóa toa thuốc thành công")
  @Roles(LoaiNhanVien.BacSi)
  @Delete(':id')
  async deleteToaThuoc(@Param('id') id: string) {
    return await this.toathuocService.deleteToaThuoc(id);
  }

  @ResponseMessage("Lấy toa thuốc theo mã toa thuốc thành công")
  @Roles(LoaiNhanVien.ThuNgan)
  @Get(':id')
  async getToaThuocById(@Param('id') id: string) {
    return await this.toathuocService.getToaThuocById(id);
  }


  @ResponseMessage("Lấy thông tin in toa thuốc thành công")
  @Roles(LoaiNhanVien.BacSi)
  @Get(':id/print')
  async getPrintToaThuoc(@Param('id') id: string) {
    return await this.toathuocService.getPrintToaThuoc(id);
  }
  
  @ResponseMessage("Tải PDF toa thuốc thành công")
  @Roles(LoaiNhanVien.ThuNgan, LoaiNhanVien.BacSi)
  @Get(':id/pdf')
  async downloadToaThuocPdf(@Param('id') id: string, @Res() res: Response) {
    try {
      const pdfBuffer = await this.toathuocService.generateToaThuocPdf(id);
      
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="toa-thuoc-${id}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      });
      
      res.end(pdfBuffer);
    } catch (error) {
      res.status(404).json({
        message: 'Không thể tạo PDF toa thuốc',
        error: error.message
      });
    }

  }
}
