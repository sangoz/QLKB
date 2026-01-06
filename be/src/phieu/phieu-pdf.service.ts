// Hàm loại bỏ dấu tiếng Việt
function removeVietnameseTones(str: string): string {
  return str
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D');
}
import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { PhieuEntity } from './entity/phieu.entity';

@Injectable()
export class PhieuPdfService {
  async generatePhieuPdf(phieu: PhieuEntity, benhNhanInfo?: any, nhanVienInfo?: any, dichVuInfo?: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margins: { top: 50, left: 50, right: 50, bottom: 50 },
          info: {
            Title: `Phieu ${phieu.MaPYC}`,
            Subject: 'Phieu yeu cau',
          }
        });

        const buffers: Buffer[] = [];
        
        // Collect data chunks
        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', reject);

        // Header
        doc.fontSize(20)
           .font('Times-Bold')
           .text('PHIEU YEU CAU', { align: 'center' })
           .moveDown();

        // Hospital/Clinic Info
        doc.fontSize(12)
           .font('Times-Roman')
           .text('BENH VIEN DAI HOC Y DUOC TP.HCM', { align: 'center' })
           .text('Dia chi: 215 Hong Bang, Phuong Cho Lon, TP. Ho Chi Minh', { align: 'center' })
           .text('Dien thoai: 028 3855 426', { align: 'center' })
           .moveDown(2);

        // Phieu Info
        doc.fontSize(14)
           .font('Times-Bold')
           .text(`Ma phieu: ${phieu.MaPYC}`)
           .font('Times-Roman')
           .text(`Ngay yeu cau: ${phieu.NgayYeuCau.toLocaleDateString('vi-VN')}`)
           .text(`Loai phieu: ${phieu.Loai}`)
           .text(`Don gia: ${Number(phieu.DonGia).toLocaleString('vi-VN')} VND`)
           .moveDown();

        // Patient Info
        if (benhNhanInfo) {
          doc.fontSize(14)
             .font('Times-Bold')
             .text('THONG TIN BENH NHAN:')
             .font('Times-Roman')
             .text(`Ma benh nhan: ${phieu.MaBN}`)
             .text(`Ho ten: ${benhNhanInfo.HoTen || 'N/A'}`)
             .text(`So dien thoai: ${benhNhanInfo.SDT || 'N/A'}`)
             .moveDown();
        }

        // Staff Info
        if (nhanVienInfo) {
          doc.fontSize(14)
             .font('Times-Bold')
             .text('THONG TIN NHAN VIEN:')
             .font('Times-Roman')
             .text(`Ma nhan vien: ${phieu.MaNV}`)
             .text(`Ho ten: ${nhanVienInfo.HoTen ? removeVietnameseTones(nhanVienInfo.HoTen) : 'N/A'}`)
             .moveDown();
        }

        // Service Info (if applicable)
        if (dichVuInfo && phieu.MaDichVu) {
          doc.fontSize(14)
             .font('Times-Bold')
             .text('THONG TIN DICH VU:')
             .font('Times-Roman')
             .text(`Ma dich vu: ${phieu.MaDichVu}`)
             .text(`Ten dich vu: ${dichVuInfo.TenDichVu || 'N/A'}`)
             .text(`Mo ta: ${dichVuInfo.MoTa || 'N/A'}`)
             .moveDown();
        }

        // Line separator
        doc.moveTo(50, doc.y)
           .lineTo(545, doc.y)
           .stroke()
           .moveDown();

        // Amount section
        doc.fontSize(16)
           .font('Times-Bold')
           .text('CHI TIET THANH TOAN:', { align: 'left' })
           .moveDown();

        // Total amount
        doc.fontSize(18)
           .font('Times-Bold')
           .text(`Tong tien: ${Number(phieu.DonGia) === 0 ? "Da dat lich" : Number(phieu.DonGia).toLocaleString('vi-VN') + ' VND'}`, { align: 'right' })
           .moveDown(2);

        // Footer
        doc.fontSize(10)
           .font('Times-Roman')
           .text('Cam on quy khach da su dung dich vu!', { align: 'center' })
           .moveDown()
           .text(`Phieu duoc tao tu dong vao ${new Date().toLocaleString('vi-VN')}`, { align: 'center' });

        // Finalize the PDF
        doc.end();

      } catch (error) {
        reject(error);
      }
    });
  }
}
