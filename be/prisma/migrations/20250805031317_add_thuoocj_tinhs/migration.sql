/*
  Warnings:

  - Added the required column `MaNV` to the `HoSoBenhAn` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HoSoBenhAn" ADD COLUMN     "MaNV" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "HoSoBenhAn" ADD CONSTRAINT "HoSoBenhAn_MaNV_fkey" FOREIGN KEY ("MaNV") REFERENCES "NhanVien"("MaNV") ON DELETE RESTRICT ON UPDATE CASCADE;
