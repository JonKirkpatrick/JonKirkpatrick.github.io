# AGENTS.md

## Repository purpose

This repository contains Jon Kirkpatrick's personal portfolio site, built with Astro and deployed to GitHub Pages at `https://jonkirkpatrick.github.io`.

Keep changes focused on the portfolio experience: project presentation, case-study content, accessibility, responsive layout, and the supporting build configuration. Do not introduce application backends or client-side frameworks unless the task explicitly requires them.

## Technology and runtime

- Astro with TypeScript support.
- Node.js 22 is used by the GitHub Actions deployment workflow.
- npm is the package manager. `package-lock.json` must remain synchronized with `package.json`.
- Shared styles are plain CSS; there is no separate component library, formatter, linter, or test framework configured.

## Important commands

Run these from the repository root:

```sh
npm ci             # Install the locked dependency set
npm run dev        # Start the local Astro development server
npm run check      # Run Astro/TypeScript diagnostics
npm run build      # Build the production site into dist/
npm run preview    # Serve the production build locally
```

For normal source changes, run `npm run check` and `npm run build` before finishing. The deployment workflow runs `npm ci` and `npm run build`; there is no automated test command beyond Astro's checks.

## Project layout

- `src/pages/`: Astro routes. `index.astro` is the home page; `src/pages/projects/*.astro` contains project case studies.
- `src/styles/site.css`: shared site-wide styles, layout, responsive breakpoints, typography, and color variables.
- `assets/`: source images and videos imported by Astro pages. Keep project media grouped in the existing project directories.
- `docs/`: Astro's configured `publicDir`. Files here are copied to the site unchanged, including the resume, verification file, PDFs, and documentation assets.
- `astro.config.mjs`: Astro configuration, site URL, sitemap integration, and the `docs/` public directory setting.
- `.github/workflows/deploy.yml`: GitHub Pages deployment workflow.
- `dist/`: generated production output. Do not edit it by hand or commit it.
- `.astro/`: generated Astro metadata/cache. Do not edit it by hand or commit it.

## Editing conventions

### Astro pages

- Follow the existing pattern: imports and page data in the frontmatter block, followed by semantic HTML.
- Reuse classes and patterns from `src/styles/site.css` before adding new ones.
- Use Astro's `Image` component for imported local images when appropriate, with meaningful `alt` text and responsive `widths`/`sizes` values.
- Keep external links explicit with `target="_blank"` and `rel="noopener noreferrer"` when they open a new tab.
- Preserve semantic headings, landmarks, labels, and keyboard-accessible links.
- Internal project links use the existing trailing-slash route style, such as `/projects/bbs/`.

### Styling

- Use the existing CSS variables and visual language unless the task is a deliberate redesign.
- Preserve responsive behavior at the existing `900px` and `560px` breakpoints, or update the relevant rules together when changing layout.
- Keep typography, spacing, and color changes in `src/styles/site.css` rather than scattering inline styles through pages.

### Assets and public files

- Put source media for a project in its matching directory under `assets/`.
- Put files that must be served at a stable URL without Astro processing under `docs/`.
- Check asset paths and case sensitivity carefully; GitHub Pages runs on Linux even though local development may be on macOS.
- Do not replace existing media or public files without checking their current consumers.

## Configuration and deployment

Astro is configured with `site: 'https://jonkirkpatrick.github.io'`, the sitemap integration, and `publicDir: './docs'`. Changes to these settings can affect canonical URLs, sitemap output, or the availability of files in `docs/`, so validate them with a production build.

The `Deploy portfolio` workflow runs on pushes to `main` and manual dispatches. It uses Node.js 22, installs with `npm ci`, builds `dist/`, uploads that directory as a Pages artifact, and deploys it to the `github-pages` environment. Do not add generated `dist/` output to source control to fix deployment issues.

## Change checklist

1. Make the smallest change that satisfies the request and preserve unrelated working-tree changes.
2. Check local asset imports, internal links, page titles, descriptions, and accessibility text when editing a page.
3. Run `npm run check`.
4. Run `npm run build` for any page, style, asset, or configuration change.
5. Inspect the rendered page with `npm run dev` or `npm run preview` when the change affects layout or interaction.

There are currently no repository-specific test, lint, or formatting commands beyond the scripts documented above.