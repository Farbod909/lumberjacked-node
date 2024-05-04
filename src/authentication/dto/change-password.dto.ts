import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { Match } from 'src/common/validation-decorators/Match.decorator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minUppercase: 1,
    minSymbols: 0,
  })
  newPassword: string;

  @Match('newPassword', {
    message: 'new password does not match confirmation.',
  })
  newPasswordConfirmation: string;
}
