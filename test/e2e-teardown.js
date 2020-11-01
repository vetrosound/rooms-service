const { execSync } = require("child_process");

module.exports = async () => {
  execSync("docker-compose down", { stdio: [0, 1, 2] });
};
