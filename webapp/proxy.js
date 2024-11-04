import { execSync } from "node:child_process";

// Get the token and cache it for 30 minutes
const getToken = (function () {
  let token = null;
  let cacheTime = 0;
  const lifeTime = 1800000; // 30 minutes

  return function () {
    if (new Date().getTime() > cacheTime + lifeTime) {
      // Get token with gcloud
      const response = execSync("gcloud auth print-access-token");
      // Delete the line break of the final
      token = response.toString().slice(0, -1);
      cacheTime = new Date().getTime();
    }
    return token;
  };
})();

export const proxyConfiguration = {
  "/c/s/": {
    target: "https://dev-bbva-gateway.appspot.com/techbeat",
    changeOrigin: true,
    rewrite: (path) => path.replace(RegExp("^/c/s/"), "/"),
    configure: (proxy) => {
      proxy.on("proxyReq", function (proxyReq) {
        const token = getToken();
        // put the header of Authorization
        proxyReq.setHeader("Authorization", "Bearer " + token.toString());
        // TODO: put here the identifier of the front project for dev
        proxyReq.setHeader("X-BBVA-AppId", "dev-bbva-techbeat");
      });
    },
  },
  "/c/gnameindexer": {
    target: "https://dev-bbva-gateway.appspot.com/gnameindexer",
    changeOrigin: true,
    rewrite: (path) => path.replace(RegExp("^/c/s/"), "/"),
    configure: (proxy) => {
      proxy.on("proxyReq", function (proxyReq) {
        const token = getToken();
        // put the header of Authorization
        proxyReq.setHeader("Authorization", "Bearer " + token.toString());
        // TODO: put here the identifier of the front project for dev
        proxyReq.setHeader("X-BBVA-AppId", "dev-bbva-techbeat");
      });
    },
  },
};