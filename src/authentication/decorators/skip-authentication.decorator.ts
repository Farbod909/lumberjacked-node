import { SetMetadata } from '@nestjs/common';

export const SKIP_AUTHENTICATION_KEY = 'skipAuthentication';
export const SkipAuthentication = () =>
  SetMetadata(SKIP_AUTHENTICATION_KEY, true);
