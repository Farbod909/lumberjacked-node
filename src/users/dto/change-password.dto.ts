import { IntersectionType, PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

class CurrentPasswordInfo {
  currentPassword: string;
}

export class ChangePasswordDto extends IntersectionType(
  PickType(CreateUserDto, ['password', 'passwordConfirmation'] as const),
  CurrentPasswordInfo,
) {}
