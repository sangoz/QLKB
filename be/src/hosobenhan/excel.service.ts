import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { HoSoBenhAnEntity } from './entity/hosobenhnhan.entity';

@Injectable()
export class ExcelService {
  async generateHoSoBenhAnExcel(hoSoBenhAn: HoSoBenhAnEntity[], benhNhanInfo?: any): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Hồ Sơ Bệnh Án');

    // Set column headers
    worksheet.columns = [

      { header: 'Mã HSBA', key: 'MaHSBA', width: 15 },
      { header: 'Triệu Chứng', key: 'TrieuChung', width: 30 },
      { header: 'Chẩn Đoán', key: 'ChanDoan', width: 30 },
      { header: 'Ngày Khám', key: 'NgayKham', width: 15 },

    ];

    // Style the header row
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '366092' }
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // Add title section
    worksheet.insertRow(1, ['HỒ SƠ BỆNH ÁN']);
    worksheet.mergeCells('A1:D1');
    const titleCell = worksheet.getCell('A1');
    titleCell.font = { bold: true, size: 16 };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9EAD3' }
    };

    // Add patient info if available
    if (benhNhanInfo) {
      worksheet.insertRow(2, ['Thông tin bệnh nhân:']);
      worksheet.mergeCells('A2:D2');
      const patientHeaderCell = worksheet.getCell('A2');
      patientHeaderCell.font = { bold: true, size: 12 };
      patientHeaderCell.alignment = { vertical: 'middle', horizontal: 'left' };


      worksheet.insertRow(3, [`Họ tên: ${benhNhanInfo.HoTen || 'N/A'}`]);
      worksheet.mergeCells('A3:D3');
      
      worksheet.insertRow(4, [`Số điện thoại: ${benhNhanInfo.SDT || 'N/A'}`]);
      worksheet.mergeCells('A4:D4');

      worksheet.insertRow(5, [`CCCD: ${benhNhanInfo.CCCD || 'N/A'}`]);
      worksheet.mergeCells('A5:D5');
      // Add empty row
      worksheet.insertRow(6, []);
      
      // Update header row position
      worksheet.getRow(7).values = ['Ngày Khám', 'Triệu Chứng', 'Chẩn Đoán'];
      worksheet.getRow(7).eachCell((cell) => {
        cell.font = { bold: true, color: { argb: 'FFFFFF' } };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '366092' }
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    }

    // Add data rows

    const startRow = benhNhanInfo ? 8 : 2;
    hoSoBenhAn.forEach((hsba, index) => {
      const row = worksheet.addRow({
        NgayKham: hsba.NgayKham ? hsba.NgayKham.toLocaleDateString('vi-VN') : 'N/A',
        TrieuChung: hsba.TrieuChung,
        ChanDoan: hsba.ChanDoan,
      });

      // Style data rows
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
      });

      // Alternate row colors
      if (index % 2 === 0) {
        row.eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'F9F9F9' }
          };
        });
      }
    });

    // Auto-fit columns
    worksheet.columns.forEach((column) => {
      if (column.key) {
        let maxLength = 0;
        const columnKey = column.key;
        
        worksheet.eachRow((row) => {
          const cell = row.getCell(columnKey);
          const cellValue = cell.value ? cell.value.toString() : '';
          if (cellValue.length > maxLength) {
            maxLength = cellValue.length;
          }
        });
        
        column.width = Math.min(Math.max(maxLength + 2, 10), 50);
      }
    });

    // Add footer
    const lastRow = worksheet.addRow([]);
    worksheet.addRow([`Xuất file: ${new Date().toLocaleString('vi-VN')}`]);
    const footerRow = worksheet.lastRow;
    worksheet.mergeCells(`A${footerRow.number}:D${footerRow.number}`);
    const footerCell = worksheet.getCell(`A${footerRow.number}`);
    footerCell.font = { italic: true, size: 10 };
    footerCell.alignment = { vertical: 'middle', horizontal: 'center' };

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
