import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

/**
 * The base dist folder where the built SPA lives.
 * Structure after `ng build`:
 *   dist/web-app-smart-palm/
 *     browser/
 *       index.html
 *       *.js / *.css
 *     server/
 *       server.mjs
 */
const baseDistFolder = join(import.meta.dirname, '..');
const browserDistFolder = join(baseDistFolder, 'browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Static file serving for the SPA (no locale prefixes).
 * All assets are served from the single browser/ folder.
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: 'index.html',
    redirect: false,
  }),
);

/**
 * Handle all requests by rendering the Angular application (SPA mode).
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
