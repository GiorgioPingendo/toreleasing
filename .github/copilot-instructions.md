## Project quick overview

- Static site built with Eleventy (11ty). Source content lives in the repository root (HTML, `posts/`, `faq/`, `_includes/`), built site output goes to `_site/`.
- Site is deployed to Netlify (see `netlify.toml`). Serverless functions live in `functions/` and are deployed together with the static site.

## Key files and directories (start here)
- `package.json` — build script: `npm run build` runs `npx @11ty/eleventy && node post.js`.
- `netlify.toml` — publish directory is `_site`, functions folder is `functions/`.
- `post.js` — script that generates `_site/sitemap.xml` by reading files in `posts/`.
- `functions/send.js` — Netlify serverless function that sends contact emails using SendGrid (reads `process.env.SENDGRID_API_KEY`).
- `assets/js/scripts.js` — front-end JS: AJAX POST to `/.netlify/functions/send` when contact form is submitted.
- `posts/` — Markdown posts; Eleventy will render each `.md` to `_site/posts/{slug}/` (used by `post.js` for sitemap).
- `faq/` — Markdown FAQ items; templates iterate `collections.faq` in `index.html`.
- `_includes/` — Eleventy partials used by templates.
- `admin/` — Netlify CMS admin UI (Netlify Identity referenced in `admin/index.html`).

## Big-picture architecture & data flows
- Authoring: write markdown under `posts/` and `faq/`. Eleventy collects these into `collections` and renders during build.
- Build: `npx @11ty/eleventy` produces `_site/`. After build, `node post.js` reads `posts/` and writes a sitemap into `_site/sitemap.xml`.
- Client interactions: contact form on `index.html` posts via AJAX to `/.netlify/functions/send` (see `assets/js/scripts.js`). That function uses SendGrid to email site owners.
- Deployment: Netlify reads `netlify.toml`, publishes `_site/` and deploys functions from `functions/`.

## Developer workflows (explicit commands)
- Local build (no Netlify emulation):
  - npm run build
  - serve built site: `npx serve _site` or `npx http-server _site` (not included, install globally or use npx)
- Local dev with functions (recommended):
  - Install Netlify CLI: `npm i -g netlify-cli`
  - Run: `netlify dev` from repo root — this serves the site and routes `/.netlify/functions/*` to `functions/`
- Environment variables:
  - `functions/send.js` expects `SENDGRID_API_KEY` in environment. Do NOT commit real keys. Use Netlify dashboard or a local `.env` for `netlify dev` (add `.env` to `.gitignore`). Note: this repo currently contains a `.env` file with a key — rotate/remove it and configure secrets in Netlify.

## Project-specific conventions & patterns
- Templates use Eleventy collection names in Liquid-style tags: e.g. `{% for faq in collections.faq %}` (see `index.html`). Expect Liquid/Nunjucks-style templating rather than client-side rendering.
- Routes/URLs: built site uses trailing-slash friendly structure: pages live at `_site/posts/{slug}/` and are linked from HTML as `/posts/{slug}` or `/posts/{slug}/`.
- Client form shape: `assets/js/scripts.js` serializes the form and expects these fields: `name`, `phone`, `email`, `citta`, `provincia`. `functions/send.js` reads `querystring.parse(event.body)` and accesses `{name, phone, email, citta, provincia}`.
- Sitemap: `post.js` assumes every `posts/*.md` should be included; it forms URLs as `https://prestitoin.it/posts/{basename}/` — update `baseUrl` in `post.js` if staging or different domain is used.

## Integration points & external dependencies
- SendGrid — used in `functions/send.js` via `@sendgrid/mail`. Configure `SENDGRID_API_KEY` in Netlify environment variables.
- Netlify — deployment + functions + Netlify CMS (`admin/`). `deno.lock` presence indicates possible Netlify Edge usage but primary functions are Node-based under `functions/`.
- JS libraries: front-end assets under `assets/` reference jQuery, Bootstrap, WOW, backstretch.

## Examples for common edits (copy/paste friendly)
- Add a new blog post: create `posts/my-new-post.md` with frontmatter (title/date) — Eleventy will render it to `_site/posts/my-new-post/` on build.
- Add a new FAQ: create `faq/faq-slug.md` with frontmatter: `title: 'My FAQ'`, optionally `order:` and `sub_title:` — templates will include it in the FAQ grid.
- Test contact function locally:
  - Ensure `SENDGRID_API_KEY` is set locally (or mock it).
  - Run `netlify dev` and submit the form on `http://localhost:8888` — front-end posts to `/.netlify/functions/send` (see `assets/js/scripts.js`).

## Troubleshooting hints
- If contact emails fail, inspect function logs in Netlify UI or run `netlify functions:invoke send --data "name=foo&email=bar@example.com&phone=123&citta=City&provincia=PV"` locally.
- If sitemap doesn't include new posts, make sure filenames in `posts/` end with `.md` and `post.js` `baseUrl` is correct.

## Safety & secrets
- Remove `.env` from repo and rotate any exposed API keys. Use Netlify environment variables for production secrets.

---
If any section is unclear or you want examples tailored to a specific task (edit a post template, add a function, or run local tests), tell me which task and I'll expand the instructions. 
