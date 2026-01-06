import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { ToaThuoc } from './entity/toathuoc.entity';

@Injectable()
export class ToaThuocPdfService {
  async generateToaThuocPdf(
    toaThuoc: ToaThuoc, 
    benhNhanInfo?: any, 
    nhanVienInfo?: any, 
    chiTietToaThuoc?: any[]
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margins: { top: 50, left: 50, right: 50, bottom: 50 },
          info: {
            Title: `Toa thuoc ${toaThuoc.MaToaThuoc}`,
            Subject: 'Toa thuoc chi tiet',
          }
        });

        const buffers: Buffer[] = [];
        
        // Collect data chunks
        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', reject);

        // Register font for Vietnamese characters
        const fontPath = 'assets/fonts/Roboto-Regular.ttf';
        try {
          doc.registerFont('Roboto', fontPath);
          doc.font('Roboto');
        } catch (error) {
          // Fallback to default font if custom font fails
          console.warn('Could not load custom font, using default');
        }

        // Header
        doc.fontSize(20)
           .font('Helvetica-Bold')
           .text('TOA THUOC', { align: 'center' })
           .moveDown();

        // Hospital/Clinic Info
        doc.fontSize(12)
           .font('Helvetica')
           .text('BENH VIEN DAI HOC Y DUOC', { align: 'center' })
           .text('Dia chi: 215 Hong Bang, Q.5, TP.HCM', { align: 'center' })
           .text('Dien thoai: (028) 3855 2225', { align: 'center' })
           .moveDown(2);

        // Prescription Info
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .text(`Ma toa thuoc: ${toaThuoc.MaToaThuoc}`)
           .font('Helvetica')
           .text(`Ngay ke: ${toaThuoc.NgayKe.toLocaleDateString('vi-VN')}`)
           .text(`Trang thai: ${toaThuoc.TrangThai}`)
           .moveDown();

        // Patient Info
        if (benhNhanInfo) {
          doc.fontSize(14)
             .font('Helvetica-Bold')
             .text('THONG TIN BENH NHAN:')
             .font('Helvetica')
             .text(`Ma benh nhan: ${toaThuoc.MaBN}`)
             .text(`Ho ten: ${benhNhanInfo.HoTen || 'N/A'}`)
             .text(`So dien thoai: ${benhNhanInfo.SDT || 'N/A'}`)
             .text(`Dia chi: ${benhNhanInfo.DiaChi || 'N/A'}`)
             .moveDown();
        }

        // Doctor Info
        if (nhanVienInfo) {
          doc.fontSize(14)
             .font('Helvetica-Bold')
             .text('BAC SI KE TOA:')
             .font('Helvetica')
             .text(`Ho ten: ${nhanVienInfo.HoTen || 'N/A'}`)
             .text(`Chuyen khoa: ${nhanVienInfo.TrinhDo || 'N/A'}`)
             .moveDown();
        }

        // Line separator
        doc.moveTo(50, doc.y)
           .lineTo(545, doc.y)
           .stroke()
           .moveDown();

        // Medicine details
        if (chiTietToaThuoc && chiTietToaThuoc.length > 0) {
          doc.fontSize(16)
             .font('Helvetica-Bold')
             .text('CHI TIET TOA THUOC:', { align: 'left' })
             .moveDown();

          // Table header
          const tableTop = doc.y;
          doc.fontSize(12)
             .font('Helvetica-Bold');

          doc.text('STT', 50, tableTop, { width: 30 });
          doc.text('Ten thuoc', 90, tableTop, { width: 150 });
          doc.text('Ham luong', 250, tableTop, { width: 80 });
          doc.text('So luong', 340, tableTop, { width: 60 });
          doc.text('Lieu luong', 410, tableTop, { width: 80 });
          doc.text('Don gia', 500, tableTop, { width: 70 });

          // Draw header line
          doc.moveTo(50, tableTop + 15)
             .lineTo(570, tableTop + 15)
             .stroke();

          let currentY = tableTop + 25;
          let totalAmount = 0;

          // Table rows
          chiTietToaThuoc.forEach((chiTiet, index) => {
            doc.fontSize(11)
               .font('Helvetica');

            doc.text((index + 1).toString(), 50, currentY, { width: 30 });
            doc.text(chiTiet.Thuoc?.TenThuoc || 'N/A', 90, currentY, { width: 150 });
            doc.text(chiTiet.Thuoc?.HamLuong || 'N/A', 250, currentY, { width: 80 });
            doc.text(chiTiet.SoLuong?.toString() || '0', 340, currentY, { width: 60 });
            doc.text(chiTiet.LieuLuong || 'N/A', 410, currentY, { width: 80 });
            doc.text(`${Number(chiTiet.DonGia || 0).toLocaleString('vi-VN')} VND`, 500, currentY, { width: 70 });

            totalAmount += Number(chiTiet.DonGia || 0) * Number(chiTiet.SoLuong || 0);
            currentY += 20;

            // Draw row separator
            doc.moveTo(50, currentY - 5)
               .lineTo(570, currentY - 5)
               .stroke();
          });

          // Total amount
          doc.moveDown();
          doc.fontSize(14)
             .font('Helvetica-Bold')
             .text(`TONG TIEN: ${totalAmount.toLocaleString('vi-VN')} VND`, { align: 'right' })
             .moveDown(2);
        }

        // Usage instructions
        doc.fontSize(12)
           .font('Helvetica-Bold')
           .text('HUONG DAN SU DUNG:')
           .font('Helvetica')
           .text('- Su dung thuoc theo dung lieu luong bac si chi dinh')
           .text('- Khong tu y tang giam lieu thuoc')
           .text('- Bao quan thuoc o noi kho rao, tranh anh sang truc tiep')
           .text('- Lien he bac si neu co phan ung phu')
           .moveDown(2);

        // Footer
        doc.fontSize(10)
           .font('Helvetica')
           .text('Cam on quy khach da su dung dich vu!', { align: 'center' })
           .moveDown()
           .text(`Toa thuoc duoc tao tu dong vao ${new Date().toLocaleString('vi-VN')}`, { align: 'center' });

        // Signature section
        doc.moveDown(3);
        doc.fontSize(12)
           .font('Helvetica-Bold')
           .text('Bac si ke toa', 400, doc.y, { align: 'center' })
           .moveDown(3)
           .text(nhanVienInfo?.HoTen || '', 400, doc.y, { align: 'center' });

        // Finalize the PDF
        doc.end();

      } catch (error) {
        reject(error);
      }
    });
  }
}
