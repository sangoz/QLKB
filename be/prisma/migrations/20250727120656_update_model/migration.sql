/*
  Warnings:

  - A unique constraint covering the columns `[RefreshToken]` on the table `BenhNhan` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[RefreshToken]` on the table `NhanVien` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BenhNhan_RefreshToken_key" ON "BenhNhan"("RefreshToken");

-- CreateIndex
CREATE UNIQUE INDEX "NhanVien_RefreshToken_key" ON "NhanVien"("RefreshToken");
