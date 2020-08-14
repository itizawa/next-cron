const express = require('express');
const next = require('next');

const port = parseInt(process.env.PORT, 10) || 3000;

class NextCronApp {

  constructor() {
    this.nextApp = undefined;
    this.expressApp = undefined;
  }

  getExpressApp() {
    return this.expressApp;
  }

  /**
   * initialize
   */
  async init() {
    this.nextApp = this.initNextJs();

    await this.nextApp.prepare();


    this.expressApp = express();
    await this.initRoutes(this.nextApp, this.expressApp);
  }

  /**
   * Initialize Next.js
   */
  initNextJs() {
    return next({
      dir: '.',
      dev: (process.env.NODE_ENV !== 'production'),
    });
  }

  /**
   * initialize Express instance
   * @param {object} nextApp
   * @param {object} expressApp
   */
  initRoutes(nextApp, expressApp) {

    // Default catch-all handler to allow Next.js to handle all other routes
    expressApp.all('*', async(req, res) => {
      const nextRequestHandler = nextApp.getRequestHandler();
      return nextRequestHandler(req, res);
    });
  }

}

/** **********************************
 *          Main Process
 ********************************** */

const nextCronApp = new NextCronApp();
nextCronApp.init().then(() => {
  const expressApp = nextCronApp.getExpressApp();
  expressApp.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
