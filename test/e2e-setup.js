const { execSync } = require("child_process");

module.exports = async () => {
  try {
    execSync("docker-compose up -d mongo", { stdio: [0, 1, 2] });
  } catch(e) {
    execSync("docker-compose down", { stdio: [0, 1, 2] });
    throw e;
  }
};
