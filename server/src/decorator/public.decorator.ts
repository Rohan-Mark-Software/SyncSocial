import { SetMetadata } from '@nestjs/common';

export const KEY = 'isPublic';
export const Public = () => SetMetadata(KEY, true);
