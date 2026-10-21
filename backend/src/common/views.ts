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

  // {{date createdAt}}: an ISO timestamp shown as "11 Oct 2026, 15:10", Istanbul time.
  const dateFormat = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Istanbul',
  });
  hbs.registerHelper('date', (iso: unknown) => {
    const d = new Date(String(iso));
    return Number.isNaN(d.getTime()) ? '' : dateFormat.format(d);
  });

  // {{day deadline}}: a date-only "yyyy-mm-dd" shown as "30 Nov 2026". Read in UTC,
  // as the model writes it, so no time zone moves it to another day.
  const dayFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
  hbs.registerHelper('day', (ymd: unknown) => {
    const d = new Date(String(ymd));
    return ymd && !Number.isNaN(d.getTime()) ? dayFormat.format(d) : '';
  });

  // {{excerpt content 160}}: the first characters of a long text, for lists.
  hbs.registerHelper('excerpt', (text: unknown, max: unknown) => {
    const s = String(text ?? '').replace(/\s+/g, ' ').trim();
    const n = typeof max === 'number' ? max : 160;
    return s.length > n ? `${s.slice(0, n).trimEnd()}…` : s;
  });

  // {{navCurrent "/users"}}: marks the menu link of the section being viewed.
  // currentPath is set for every request by the middleware below.
  hbs.registerHelper('navCurrent', (prefix: string, options: { data?: { root?: { currentPath?: string } } }) => {
    const path = String(options.data?.root?.currentPath ?? '');
    const match = path === prefix || path.startsWith(`${prefix}/`);
    return match ? new hbs.handlebars.SafeString('aria-current="page"') : '';
  });
  app.use((req: { path: string }, res: { locals: Record<string, unknown> }, next: () => void) => {
    res.locals.currentPath = req.path;
    next();
  });
}
