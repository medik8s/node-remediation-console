import { defineConfig } from "cypress";
import * as util from "util";
import * as path from "path";

const exec = util.promisify(require("child_process").exec);
const runCommand = (cmd, failOnError = true) => {
  console.log(cmd);
  return exec(cmd)
    .then((stdout, stderr) => {
      console.log(stdout);
      return 0;
    })
    .catch((err) => {
      if (failOnError) {
        throw err;
      } else {
        console.log(err);
        return 0;
      }
    });
};

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:9000",
    defaultCommandTimeout: 60000,
    setupNodeEvents(on, config) {
      on("task", {
        deleteAllNHCs() {
          return runCommand(`oc delete NodeHealthCheck --all`);
        },
        apply(fixture) {
          return runCommand(
            `oc apply -f ${path.join(
              __dirname,
              "cypress",
              "fixtures",
              fixture
            )}`
          );
        },
        deleteNodeHealthCheck(name) {
          return runCommand(`oc delete NodeHealthCheck ${name}`, false);
        },
      });
    },
  },
  viewportHeight: 1080,
  viewportWidth: 1920,
});
