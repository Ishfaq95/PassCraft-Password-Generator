import { MmkvPasswordRepository } from '@/repositories/password';
import { storage } from '@/storage';

import { PasswordStorageService } from './PasswordStorageService';

export { createPasswordId } from './createPasswordId';
export { PasswordStorageService } from './PasswordStorageService';

const passwordRepository = new MmkvPasswordRepository(storage);

export const passwordStorageService = new PasswordStorageService(
  passwordRepository,
);
