import { Injectable } from '@nestjs/common';

// Text for the generic 404 page.
@Injectable()
export class NotFoundService {
  // "from" comes from the URL, so anyone can type anything there. Only a plain
  // path of this site is shown (and the template escapes it); anything else gets
  // the general sentence, so a crafted link cannot put its own text on the page.
  reasonFor(from: unknown): string {
    const ok =
      typeof from === 'string' && from.startsWith('/') && !from.startsWith('//') && from.length <= 200;
    return ok ? `Nothing was found at ${from}.` : 'The page you asked for does not exist.';
  }
}
