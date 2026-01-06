import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { LoaiNhanVien } from 'src/nhanvien/entity/nhanvien.entity'; // domain enum của bạn

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  private matchRoles(allowedRoles: LoaiNhanVien[], userRole: LoaiNhanVien): boolean {
    return allowedRoles.includes(userRole);
  }

  canActivate(context: ExecutionContext): boolean {
    const allowedRoles = this.reflector.get<LoaiNhanVien[]>('roles', context.getHandler());
    if (!allowedRoles) {
      return true; // Không khai báo @Roles thì cho qua
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) return false;

    const userRole: LoaiNhanVien = user.LoaiNV;
    return this.matchRoles(allowedRoles, userRole);
  }
}
