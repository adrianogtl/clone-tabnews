const { exec } = require("node:child_process");

let count = 0;
const spinner = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

function checkPostgres() {
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);

  function handleReturn(error, stdout) {
    if (stdout.search("accepting connections") === -1) {
      const frameIndex = count % spinner.length;
      process.stdout.write(
        `\r🔴 Waiting for Postgres to be ready ${spinner[frameIndex]}`,
      );

      count++;
      checkPostgres();
      return;
    }

    console.log("\r🟢 Postgres is ready and is accepting connections!");
  }
}

checkPostgres();
