# WebAppSmartPalm

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.10.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Deploy to Cloudflare Pages

This is a client-side rendered (CSR) Angular SPA. Cloudflare Pages serves
the built assets directly with no Worker / SSR runtime.

### One-time setup

1. Connect the GitHub repository to Cloudflare Pages
   (https://dash.cloudflare.com → Workers & Pages → Create → Pages → Connect to Git).
2. In the project setup screen, configure the build:

   | Field              | Value                                |
   | ------------------ | ------------------------------------ |
   | Framework preset   | **None** (or "Angular" if available) |
   | Build command      | `npm run build`                      |
   | Build output      | `dist/web-app-smart-palm/browser`    |
   | Root directory    | `/`                                  |
   | Node version      | `22` (matches `.nvmrc`)              |

3. No environment variables are required for the build.

### How routing works

- Every route is rendered on the client (`RenderMode.Client`).
- The `public/_redirects` rule `/*  /index.html  200` makes the SPA fallback work
  for deep links (`/dashboard`, `/plantaciones/:id`, etc.).
- `public/_headers` sets security headers and immutable cache for hashed assets.

### Local preview of the production build

```bash
npm run build
npx wrangler pages dev dist/web-app-smart-palm/browser
```

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
