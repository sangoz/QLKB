// validators/is-so-benh-nhan-toi-da-hop-le.decorator.ts
import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsSoBenhNhanHopLe(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isSoBenhNhanHopLe',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const obj = args.object as any;
          // Kiểm tra cả soBNToiDa và SoBNToiDa (case-sensitive)
          const soBNToiDa = obj.soBNToiDa || obj.SoBNToiDa;
          
          return typeof value === 'number' && typeof soBNToiDa === 'number'
            ? value <= soBNToiDa  // Sửa logic: số hiện tại <= số tối đa
            : false;
        },
        defaultMessage(args: ValidationArguments) {
          return `Số bệnh nhân hiện tại không được lớn hơn số bệnh nhân tối đa`;
        },
      },
    });
  };
}
