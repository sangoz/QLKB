import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsToday(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isToday',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!(value instanceof Date)) return false;

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const inputDate = new Date(value);
          inputDate.setHours(0, 0, 0, 0);

          return inputDate.getTime() === today.getTime();
        },
        defaultMessage(): string {
          return 'Giá trị phải là ngày hôm nay';
        },
      },
    });
  };
}
