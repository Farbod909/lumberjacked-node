import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UnauthorizedException,
} from '@nestjs/common';
import { MovementsService } from './movements.service';
import { CreateMovementDto } from './dto/create-movement.dto';
import { UpdateMovmenentDto } from './dto/update-movement.dto';
import { CurrentUser } from 'src/authentication/decorators/current-user.decorator';
import UserSessionInfo from 'src/authentication/entities/UserSessionInfo';
import { AuthorizationService } from 'src/authorization/authorization.service';

@Controller('movements')
export class MovementsController {
  constructor(
    private readonly movementsService: MovementsService,
    private readonly authorizationService: AuthorizationService,
  ) {}

  /**
   * Creates a movement and sets the currently logged-in user as author.
   */
  @Post()
  create(
    @CurrentUser() user: UserSessionInfo,
    @Body() createMovementDto: CreateMovementDto,
  ) {
    return this.movementsService.create(createMovementDto, user.id);
  }

  /**
   * Get all movements for the currently logged-in user.
   */
  @Get()
  findAll(@CurrentUser() user: UserSessionInfo) {
    return this.movementsService.findAll(user.id);
  }

  /**
   * Get a single movement based on movement ID.
   *
   * Only authorized if logged-in user is author of requested movement.
   */
  @Get(':id')
  async findOne(@CurrentUser() user: UserSessionInfo, @Param('id') id: number) {
    const isAuthorized =
      await this.authorizationService.userHasAccessToMovement(user.id, id);
    if (!isAuthorized) {
      throw new UnauthorizedException();
    }

    return this.movementsService.findOne(id);
  }

  /**
   * Update a single movement based on movement ID.
   *
   * Only authorized if logged-in user is author of requested movement.
   */
  @Patch(':id')
  async update(
    @CurrentUser() user: UserSessionInfo,
    @Param('id') id: number,
    @Body() updateMovementDto: UpdateMovmenentDto,
  ) {
    const isAuthorized =
      await this.authorizationService.userHasAccessToMovement(user.id, id);
    if (!isAuthorized) {
      throw new UnauthorizedException();
    }

    return this.movementsService.update(id, updateMovementDto);
  }

  /**
   * Delete a single movement based on movement ID.
   *
   * Only authorized if logged-in user is author of requested movement.
   */
  @Delete(':id')
  async remove(@CurrentUser() user: UserSessionInfo, @Param('id') id: number) {
    const isAuthorized =
      await this.authorizationService.userHasAccessToMovement(user.id, id);
    if (!isAuthorized) {
      throw new UnauthorizedException();
    }

    return this.movementsService.remove(id);
  }
}
