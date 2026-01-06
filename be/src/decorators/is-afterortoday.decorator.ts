import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsFutureOrToday(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isFutureOrToday',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments): boolean {
          const date = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return date >= today;
        },
        defaultMessage(): string {
          return 'Ngày phải là hôm nay hoặc tương lai';
        },
      },
    });
  };
}
