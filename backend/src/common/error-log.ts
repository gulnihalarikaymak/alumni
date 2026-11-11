import { appendFile, mkdirSync } from 'fs';
import { join } from 'path';

// The error log: logs/error.logs, relative to where the app runs (backend/ on a
// dev computer, /app in Docker; docker-compose.yml maps it to backend/logs/ on
// your computer, so you can open it there).
const LOG_DIR = join(process.cwd(), 'logs');
const LOG_FILE = join(LOG_DIR, 'error.logs');

let ready = false;

// Adds text to the end of the file. Failing to log must never break a request,
// so a problem is reported on the terminal and then ignored.
export function writeErrorLog(text: string): void {
  try {
    if (!ready) {
      mkdirSync(LOG_DIR, { recursive: true }); // does nothing if the folder exists
      ready = true;
    }
  } catch (err) {
    console.error('Cannot create the logs folder:', (err as Error).message);
    return;
  }
  appendFile(LOG_FILE, `${text}\n`, (err) => {
    if (err) console.error('Cannot write logs/error.logs:', err.message);
  });
}
