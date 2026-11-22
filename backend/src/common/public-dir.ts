import { join } from 'path';

// Works both from src/common in development and from dist/common in Docker.
export const publicDir = join(__dirname, '..', '..', 'public');
