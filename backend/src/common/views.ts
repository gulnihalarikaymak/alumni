import type { NestExpressApplication } from '@nestjs/platform-express';
import { readFileSync, readdirSync } from 'fs';
import { basename, join } from 'path';
import * as hbs from 'hbs';

// The view layer: Handlebars templates in backend/views/.
// A controller route names a template (@Render('users/index') or
// res.render(...)) and passes data; the template turns it into HTML.
// {{value}} escapes HTML automatically, so typed input never runs as markup.
// Every page is wrapped in views/layout.hbs.
export function setupViews(app: NestExpressApplication): void {
  // dist/common -> backend/views (same in Docker: /app/dist/common -> /app/views)
  const viewsDir = join(__dirname, '..', '..', 'views');
  app.setBaseViewsDir(viewsDir);
  app.setViewEngine('hbs');

  // views/partials/errors.hbs -> {{> errors}}. Read synchronously so every
  // partial exists before the first request.
  const partialsDir = join(viewsDir, 'partials');
  for (const file of readdirSync(partialsDir).filter((f) => f.endsWith('.hbs'))) {
    hbs.registerPartial(basename(file, '.hbs'), readFileSync(join(partialsDir, file), 'utf8'));
  }

  // {{#if (same a b)}}: equal, ignoring case. Used to pre-select <option>s.
  hbs.registerHelper('same', (a: unknown, b: unknown) =>
    String(a ?? '').toUpperCase() === String(b ?? '').toUpperCase(),
  );
}
