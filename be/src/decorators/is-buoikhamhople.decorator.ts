// validators/is-buoi-kham-hop-le.decorator.ts
import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsBuoiKhamHopLe(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isBuoiKhamHopLe',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(_: any, args: ValidationArguments) {
          const obj = args.object as any;
          const buoi = obj['buoi'];
          const ngay = new Date(obj['ngay']);

          if (!(ngay instanceof Date) || isNaN(ngay.getTime())) return false;

          const gio = ngay.getHours();
          if (buoi === 'Sang') {
            return gio < 12;
          } else if (buoi === 'Chieu') {
            return gio >= 12;
          }
          return false;
        },
        defaultMessage(args: ValidationArguments) {
          return `Buổi khám không hợp lệ với thời gian hiện tại`;
        },
      },
    });
  };
}
