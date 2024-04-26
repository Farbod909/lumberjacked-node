import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthorizationService } from './authorization.service';

export class AuthorizationPolicyConfiguration {
  // multiple types of policies can be set, but all checks must pass to grant access.
  allUsers?: boolean;
  resourceAccess?: ResourceAccessPolicyOptions;
}

export interface ResourceAccessPolicyOptions {
  resourceType: AuthorizationResourceType;
  resourceIdContainer?: HttpRequestContainer;
  resourceIdFieldName?: string;
}

export enum AuthorizationResourceType {
  User = 'user',
  Movement = 'movement',
  MovementLog = 'movementLog',
}

export enum HttpRequestContainer {
  Params = 'params',
  Query = 'query',
  Body = 'body',
  Headers = 'headers',
  Session = 'session',
}

export const AUTHORIZATION_POLICY_CONFIG_KEY = 'authz_policy_config';
export const AuthorizationPolicy = (config: AuthorizationPolicyConfiguration) =>
  SetMetadata(AUTHORIZATION_POLICY_CONFIG_KEY, config);

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authorizationService: AuthorizationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authorizationPolicyConfig =
      this.reflector.get<AuthorizationPolicyConfiguration>(
        AUTHORIZATION_POLICY_CONFIG_KEY,
        context.getHandler(),
      );

    if (!authorizationPolicyConfig) {
      return true;
    }

    let hasAccess = true;

    await Promise.all(
      Object.keys(authorizationPolicyConfig).map(async (configKey) => {
        const policyCheckResult = await this.checkPolicy(
          authorizationPolicyConfig,
          configKey,
          context,
        );
        hasAccess = hasAccess && policyCheckResult;
      }),
    );

    return hasAccess;
  }

  async checkPolicy(
    config: AuthorizationPolicyConfiguration,
    configKey: string,
    context: ExecutionContext,
  ): Promise<boolean> {
    switch (configKey) {
      case 'allUsers':
        return true;
      case 'resourceAccess':
        return this.checkResourceAccessPolicy(config, context);
      default:
        throw new ForbiddenException(`Unknown config key ${configKey}.`);
    }
  }

  async checkResourceAccessPolicy(
    config: AuthorizationPolicyConfiguration,
    context: ExecutionContext,
  ) {
    const request = context.switchToHttp().getRequest();
    const userId: number = +request.user.id;

    // Set defaults if not set by user.
    if (config.resourceAccess.resourceIdContainer === undefined) {
      config.resourceAccess.resourceIdContainer = HttpRequestContainer.Params;
    }
    if (config.resourceAccess.resourceIdFieldName === undefined) {
      config.resourceAccess.resourceIdFieldName = 'id';
    }

    const resourceId: number =
      +request[config.resourceAccess.resourceIdContainer][
        config.resourceAccess.resourceIdFieldName
      ];
    const resourceType = config.resourceAccess.resourceType;

    return this.authorizationService.userHasAccessToResource(
      userId,
      resourceId,
      resourceType,
    );
  }
}
