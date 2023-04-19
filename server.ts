import { createRequestHandler } from "@remix-run/architect";
import * as build from "@remix-run/dev/server-build";

if (process.env.NODE_ENV !== "production") {
  require("./mocks");
}

export const handler = createRequestHandler({
  //Seems to be annoyed I've removed tailwind and postcss - still works
  build: build as any,
  mode: process.env.NODE_ENV,
});
