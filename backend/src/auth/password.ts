// Password hashing with Node's built-in scrypt (no extra package).
//
// A password is never stored. We store "scrypt$<salt>$<hash>": a random salt
// per user, so two equal passwords get different hashes, and scrypt is slow on
// purpose, so guessing millions of passwords from a stolen table takes long.
import { randomBytes, scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt) as (password: string, salt: Buffer, length: number) => Promise<Buffer>;
const KEY_LENGTH = 64;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scryptAsync(password, salt, KEY_LENGTH);
  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [method, saltHex, hashHex] = stored.split('$');
  if (method !== 'scrypt' || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, 'hex');
  const actual = await scryptAsync(password, Buffer.from(saltHex, 'hex'), expected.length);
  // timingSafeEqual takes the same time for every wrong answer, so the
  // response time does not reveal how many characters were right.
  return timingSafeEqual(actual, expected);
}
