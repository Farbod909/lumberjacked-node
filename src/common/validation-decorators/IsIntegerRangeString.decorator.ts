import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

interface IntegerRangeStringOptions {
  canBeSingleInteger: boolean;
  smallest: number;
  largest: number;
}

export function IsIntegerRangeString(
  integerRangeOptions: IntegerRangeStringOptions,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [integerRangeOptions],
      validator: IsIntegerRangeStringConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'IsIntegerRangeString' })
export class IsIntegerRangeStringConstraint
  implements ValidatorConstraintInterface
{
  validate(text: string, args: ValidationArguments) {
    function isInteger(str) {
      const parsed = parseInt(str, 10);
      return parsed.toString() === str;
    }

    if (typeof text !== 'string') return false;

    const [integerRangeOptions] = args.constraints;

    const splits = text.split('-');

    const expectedMinSplitLength = integerRangeOptions.canBeSingleInteger
      ? 1
      : 2;

    if (splits.length < expectedMinSplitLength || splits.length > 2) {
      return false;
    }

    if (splits.length == 2) {
      const leftSide = splits[0];
      const rightSide = splits[1];

      if (!isInteger(leftSide) || !isInteger(rightSide)) {
        return false;
      }

      if (
        parseInt(leftSide) < integerRangeOptions.smallest ||
        parseInt(leftSide) > integerRangeOptions.largest - 1 ||
        parseInt(rightSide) < integerRangeOptions.smallest + 1 ||
        parseInt(rightSide) > integerRangeOptions.largest
      ) {
        return false;
      }
    }

    if (splits.length == 1) {
      const expectedInteger = splits[0];
      if (!isInteger(expectedInteger)) {
        return false;
      }

      if (
        parseInt(expectedInteger) < integerRangeOptions.smallest ||
        parseInt(expectedInteger) > integerRangeOptions.largest
      ) {
        return false;
      }
    }

    return true;
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments.property} is not a numeric range with values between ${validationArguments.constraints[0].smallest} and ${validationArguments.constraints[0].largest}`;
  }
}
