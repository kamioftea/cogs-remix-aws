const path = require("path");

/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  appDirectory: "app",
  cacheDirectory: "./node_modules/.cache/remix",
  assetsBuildDirectory: "public/build",
  publicPath: "/_static/build/",
  serverBuildTarget: "arc",
  server: "./server.ts",
  ignoredRouteFiles: ["**/.*", "**/*.css", "**/*.test.{js,jsx,ts,tsx}"],
  routes(defineRoutes) {
    return defineRoutes((route) => {
      if (process.env.NODE_ENV === "production") return;

      console.log("⚠️  Test routes enabled.");

      let appDir = path.join(__dirname, "app");

      route(
        "__tests/create-user",
        path.relative(appDir, "cypress/support/test-routes/create-user.ts"),
      );

      route(
        "__tests/setup-tournament",
        path.relative(
          appDir,
          "cypress/support/test-routes/setup-tournament.ts",
        ),
      );

      route(
        "__tests/validate-user-and-redirect/:email",
        path.relative(
          appDir,
          "cypress/support/test-routes/validate-user-and-redirect.ts",
        ),
      );
    });
  },
};
