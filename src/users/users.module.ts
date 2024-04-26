import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'src/database/database.module';
import { CommonModule } from 'src/common/common.module';
import { AuthenticationModule } from 'src/authentication/authentication.module';

@Module({
  imports: [
    DatabaseModule,
    CommonModule,
    forwardRef(() => AuthenticationModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
