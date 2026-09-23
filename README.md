# JonKirkpatrick.github.io

Personal portfolio site for Jon Kirkpatrick: a static Astro site presenting selected software, AI, systems, mathematics, and game projects.

Live site: <https://jonkirkpatrick.github.io>

## Stack

- Astro with TypeScript support
- Plain CSS in `src/styles/site.css`
- Astro sitemap integration
- GitHub Pages deployment through GitHub Actions
- Node.js 22 and npm

There is no frontend framework, backend, test suite, formatter, or linter configured. Astro's diagnostics and the production build are the main checks.

## Repository layout

```text
src/pages/index.astro          Home page and project-card data
src/pages/projects/            Individual project case studies
src/styles/site.css            Shared layout, responsive rules, and visual design
assets/                        Source images and videos processed by Astro
docs/                          Public, unprocessed files and PDFs
astro.config.mjs               Site URL, sitemap, and public directory configuration
.github/workflows/deploy.yml   GitHub Pages build and deployment workflow
```

The current case studies are:

- `/projects/bbs/` - Build-a-Bot Stadium
- `/projects/tactile/` - Tactile Pattern Classification
- `/projects/torus/` - Torus Knots and Curvy Plots
- `/projects/honeydew/` - Honeydew Hollow

## Local development

Install the locked dependency set, then start Astro's development server:

```sh
npm ci
npm run dev
```

Astro will print the local URL, normally `http://localhost:4321`. Use the development server while editing pages and styles because it gives immediate feedback and catches broken imports as they are introduced.

Before publishing a change, run:

```sh
npm run check
npm run build
```

`npm run check` runs Astro and TypeScript diagnostics. `npm run build` creates the production output in `dist/`; do not edit or commit that directory manually. `npm run preview` serves the most recent production build locally.

## How to revise the site

### Home page

Edit `src/pages/index.astro` to change the hero copy, about section, contact links, or the four project cards. Each card's data includes its title, category, description, image, technology tags, and case-study URL. Keep the URL trailing slash consistent with the existing routes.

### Case studies

Edit the matching file in `src/pages/projects/`. Each page keeps its content in the frontmatter at the top, followed by semantic HTML sections. When adding or removing a section, preserve:

- A unique page title and meta description.
- One primary `h1`, followed by logical heading levels.
- Descriptive `alt` text for every image.
- `target="_blank"` and `rel="noopener noreferrer"` for external links.
- A working link back to the home page and the shared footer.

Project pages are intentionally self-contained rather than generated from a content collection. This makes long-form case-study editing straightforward, but means a new project needs both a new page and a new entry in the `projects` array on `index.astro`.

### Images and video

Put source media in the matching directory under `assets/` (`BBS`, `CNN`, `Torus`, or `About`) and import it from the Astro page. Use Astro's `Image` component for images so they are optimized during the build. Keep filenames and capitalization exact; the deployment environment is case-sensitive.

Put files that need a stable public URL, such as PDFs, a resume, or external documentation assets, under `docs/`. Astro is configured with `publicDir: './docs'`, so a file at `docs/CNN/DataPrep.pdf` is linked as `/CNN/DataPrep.pdf`. These files are copied as-is and are not processed by Astro.

When replacing media, search the source pages for the old filename first. A file can be referenced by an image import, a video source, a PDF link, or a poster image.

### Shared styling

Make site-wide visual changes in `src/styles/site.css`. The main responsive breakpoints are `900px` and `560px`; update the related desktop and mobile rules together when changing layout. Reuse the existing CSS variables and classes before adding page-specific styles.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`. The workflow:

1. Uses Node.js 22.
2. Runs `npm ci` from `package-lock.json`.
3. Runs `npm run build`.
4. Uploads `dist/` and deploys it to GitHub Pages.

The Astro site URL is configured as `https://jonkirkpatrick.github.io` in `astro.config.mjs`; changing it affects canonical URLs and sitemap output. A manual deployment can also be started from the GitHub Actions workflow using `workflow_dispatch`.

## Revision checklist

1. Update the relevant page, stylesheet, asset directory, or `docs/` file.
2. Check titles, descriptions, internal links, and image alt text.
3. Run `npm run check`.
4. Run `npm run build`.
5. Review the affected page at desktop and mobile widths with `npm run dev` or `npm run preview`.
6. Confirm that new files are included in the change and that generated `dist/` or `.astro/` output is not being added.