import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res } from '@nestjs/common';
import { PhieuService } from './phieu.service';
import { ResponseMessage } from 'src/decorators/response.decorator';
import { User } from 'src/decorators/user.decorator';
import { LoaiNhanVien, NhanVien } from 'src/nhanvien/entity/nhanvien.entity';
import { CreateUpdatePhieuDto } from './dto/cre-upphieu.dto';
import { Roles } from 'src/decorators/role.decorator';
import { Response } from 'express';
import { Public } from 'src/decorators/public.decorator';


@Controller('phieu')
export class PhieuController {
  constructor(private readonly phieuService: PhieuService) {}

  @ResponseMessage("Tạo phiếu thành công")
  @Post()
  async createPhieu(@User() user: NhanVien, @Body() body: CreateUpdatePhieuDto, @Res() res: Response) {
    try {
      const result = await this.phieuService.createPhieuWithPdf(user.MaNV, body);
      
      // Set headers for multipart response with JSON and PDF
      res.set({
        'Content-Type': 'application/json',
      });

      // Send JSON response with phieu info and PDF as base64
      res.json({
        statusCode: 201,
        message: "Tạo phiếu thành công",
        data: result.phieu,
        pdf: {
          filename: `phieu-${result.phieu.MaPYC}.pdf`,
          contentType: 'application/pdf',
          data: result.pdfBuffer.toString('base64')
        }
      });
    } catch (error) {
      res.status(400).json({
        statusCode: 400,
        message: error.message,
      });
    }
  }

  @ResponseMessage("Tạo phiếu thành công (không có PDF)")
  @Roles(LoaiNhanVien.BacSi)
  @Post('simple')
  async createSimplePhieu(@User() user: NhanVien, @Body() body: CreateUpdatePhieuDto) {
    return await this.phieuService.createPhieu(user.MaNV, body);
  }

  @ResponseMessage("Cập nhật phiếu thành công")
  @Put(':id')
  async updatePhieu(@Param('id') id: string, @User() user: NhanVien, @Body() body: CreateUpdatePhieuDto) {
    return await this.phieuService.updatePhieu(user.MaNV, id, body);
  }

  @ResponseMessage("Xóa phiếu thành công")
  @Roles(LoaiNhanVien.BacSi)
  @Delete(':id')
  async deletePhieu(@Param('id') id: string) {
    return await this.phieuService.deletePhieu(id);
  }

  @ResponseMessage("Lấy danh sách phiếu thành công")
  @Public()
  @Get()
  async getAllPhieu() {
    return await this.phieuService.getAllPhieu();
  }

  //lấy danh sach phiếu theo loại phiếu
  @ResponseMessage("Lấy danh sách phiếu theo loại phiếu thành công")
  @Get('loai/:Loai')
  async getPhieuByLoai(@Param('Loai') Loai: string) {
    return await this.phieuService.getPhieuByLoai(Loai);
  }

  @ResponseMessage("Lấy phiếu thành công theo loại phiếu theo mã bệnh nhân")
  @Get('benhnhan/:MaBN')
  async getPhieuByMaBN(@Param('MaBN') MaBN: string, @Query('Loai') Loai?: string) {
    return await this.phieuService.getPhieuByMaBN(MaBN, Loai);
  }

  @ResponseMessage("Lấy phiếu thành công theo ID")
  @Public()
  @Get('details/:id')
  async getPhieuById(@Param('id') id: string) {
    return await this.phieuService.getPhieuById(id);
  }

  @Get(':id/download-pdf')
  async downloadPhieuPdf(@Param('id') id: string, @Res() res: Response) {
    try {
      const pdfBuffer = await this.phieuService.downloadPhieuPdf(id);
      
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="phieu-${id}.pdf"`,
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