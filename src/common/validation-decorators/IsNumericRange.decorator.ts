import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

interface IntegerRangeOptions {
  smallest: number;
  largest: number;
}

export function IsIntegerRange(
  integerRangeOptions: IntegerRangeOptions,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [integerRangeOptions],
      validator: IsIntegerRangeConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'IsIntegerRange' })
export class IsIntegerRangeConstraint implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    function isInteger(str) {
      const parsed = parseInt(str, 10);
      return parsed.toString() === str;
    }

    const splits = text.split('-');

    if (splits.length !== 2) return false;

    const leftSide = splits[0];
    const rightSide = splits[1];

    if (!isInteger(leftSide) || !isInteger(rightSide)) {
      return false;
    }

    const [integerRangeOptions] = args.constraints;

    if (
      parseInt(leftSide) < integerRangeOptions.smallest ||
      parseInt(leftSide) > integerRangeOptions.largest - 1 ||
      parseInt(rightSide) < integerRangeOptions.smallest + 1 ||
      parseInt(rightSide) > integerRangeOptions.largest
    ) {
      return false;
    }

    return true;
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments.property} is not a numeric range between ${validationArguments.constraints[0].smallest} and ${validationArguments.constraints[0].largest}`;
  }
}
